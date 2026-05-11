'use strict';

const path = require('path');
const fs = require('fs');
const express = require('express');
const { open } = require('./db');

const PORT = process.env.PORT || 4178;
const ROOT = __dirname;
const DB_PATH = path.join(ROOT, 'birdclaw.db');
const PUBLIC_DIR = path.join(ROOT, 'public');

let db;

async function buildApp() {
  db = await open(DB_PATH);
  setupSchema();
  maybeSeed();
  setupRoutes();
  return app;
}

async function boot() {
  await buildApp();
  app.listen(PORT, () => {
    console.log(`\n  birdclaw ▸ http://localhost:${PORT}\n`);
  });
}

function setupSchema() {

  db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    handle       TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    bio          TEXT DEFAULT '',
    avatar_hue   INTEGER NOT NULL DEFAULT 210,
    verified     INTEGER NOT NULL DEFAULT 0,
    created_at   INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id    INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    body         TEXT NOT NULL,
    created_at   INTEGER NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_posts_parent  ON posts(parent_id);
  CREATE INDEX IF NOT EXISTS idx_posts_author  ON posts(author_id);

  CREATE TABLE IF NOT EXISTS likes (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
  );

  CREATE TABLE IF NOT EXISTS reposts (
    user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id    INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (user_id, post_id)
  );

  CREATE TABLE IF NOT EXISTS follows (
    follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    followee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at  INTEGER NOT NULL,
    PRIMARY KEY (follower_id, followee_id),
    CHECK (follower_id <> followee_id)
  );
  `);
}

function maybeSeed() {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    require('./scripts/seed.js')(db);
  }
}

// ── Session (super basic: pick a user via cookie, no real auth) ───────────────
function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(rest.join('='));
  }
  return out;
}

function currentUser(req) {
  const cookies = parseCookies(req.headers.cookie);
  let id = parseInt(cookies.bc_uid, 10);
  if (!id || Number.isNaN(id)) id = 1; // default to first user
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  return u || db.prepare('SELECT * FROM users ORDER BY id ASC LIMIT 1').get();
}

// ── App ───────────────────────────────────────────────────────────────────────
const app = express();
app.use(express.json({ limit: '64kb' }));
app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));

function setupRoutes() {

// Hydrate post with author + counts + viewer state
function hydratePosts(rows, viewerId) {
  if (rows.length === 0) return [];
  const ids = rows.map((r) => r.id);
  const placeholders = ids.map(() => '?').join(',');

  const likeRows = db
    .prepare(`SELECT post_id, COUNT(*) AS c FROM likes WHERE post_id IN (${placeholders}) GROUP BY post_id`)
    .all(...ids);
  const repostRows = db
    .prepare(`SELECT post_id, COUNT(*) AS c FROM reposts WHERE post_id IN (${placeholders}) GROUP BY post_id`)
    .all(...ids);
  const replyRows = db
    .prepare(`SELECT parent_id AS post_id, COUNT(*) AS c FROM posts WHERE parent_id IN (${placeholders}) GROUP BY parent_id`)
    .all(...ids);

  const viewerLikes = viewerId
    ? db.prepare(`SELECT post_id FROM likes WHERE user_id = ? AND post_id IN (${placeholders})`).all(viewerId, ...ids)
    : [];
  const viewerReposts = viewerId
    ? db.prepare(`SELECT post_id FROM reposts WHERE user_id = ? AND post_id IN (${placeholders})`).all(viewerId, ...ids)
    : [];

  const likeMap = new Map(likeRows.map((r) => [r.post_id, r.c]));
  const repostMap = new Map(repostRows.map((r) => [r.post_id, r.c]));
  const replyMap = new Map(replyRows.map((r) => [r.post_id, r.c]));
  const likedSet = new Set(viewerLikes.map((r) => r.post_id));
  const repostedSet = new Set(viewerReposts.map((r) => r.post_id));

  const authorIds = [...new Set(rows.map((r) => r.author_id))];
  const authors = db
    .prepare(`SELECT * FROM users WHERE id IN (${authorIds.map(() => '?').join(',')})`)
    .all(...authorIds);
  const authorMap = new Map(authors.map((a) => [a.id, a]));

  return rows.map((r) => {
    const a = authorMap.get(r.author_id);
    return {
      id: r.id,
      body: r.body,
      created_at: r.created_at,
      parent_id: r.parent_id,
      author: a
        ? {
            id: a.id,
            handle: a.handle,
            display_name: a.display_name,
            avatar_hue: a.avatar_hue,
            verified: !!a.verified,
          }
        : null,
      likes: likeMap.get(r.id) || 0,
      reposts: repostMap.get(r.id) || 0,
      replies: replyMap.get(r.id) || 0,
      viewer_liked: likedSet.has(r.id),
      viewer_reposted: repostedSet.has(r.id),
    };
  });
}

// ── Routes ────────────────────────────────────────────────────────────────────
app.get('/api/me', (req, res) => {
  const u = currentUser(req);
  const followers = db.prepare('SELECT COUNT(*) AS c FROM follows WHERE followee_id = ?').get(u.id).c;
  const following = db.prepare('SELECT COUNT(*) AS c FROM follows WHERE follower_id = ?').get(u.id).c;
  res.json({ ...u, verified: !!u.verified, followers, following });
});

app.get('/api/users', (_req, res) => {
  const rows = db.prepare('SELECT id, handle, display_name, avatar_hue, verified FROM users ORDER BY id ASC').all();
  res.json(rows.map((r) => ({ ...r, verified: !!r.verified })));
});

app.post('/api/switch-user', (req, res) => {
  const id = parseInt(req.body && req.body.id, 10);
  if (!id) return res.status(400).json({ error: 'id required' });
  const u = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!u) return res.status(404).json({ error: 'user not found' });
  res.setHeader('Set-Cookie', `bc_uid=${id}; Path=/; Max-Age=31536000; SameSite=Lax`);
  res.json({ ok: true });
});

app.get('/api/feed', (req, res) => {
  const me = currentUser(req);
  const tab = req.query.tab === 'following' ? 'following' : 'foryou';
  let rows;
  if (tab === 'following') {
    rows = db
      .prepare(
        `SELECT p.* FROM posts p
         WHERE p.parent_id IS NULL
           AND (p.author_id = ? OR p.author_id IN (SELECT followee_id FROM follows WHERE follower_id = ?))
         ORDER BY p.created_at DESC LIMIT 100`
      )
      .all(me.id, me.id);
  } else {
    rows = db
      .prepare(
        `SELECT p.*,
           (SELECT COUNT(*) FROM likes  l WHERE l.post_id = p.id) AS lc,
           (SELECT COUNT(*) FROM reposts r WHERE r.post_id = p.id) AS rc
         FROM posts p
         WHERE p.parent_id IS NULL
         ORDER BY (lc*2 + rc*3) DESC, p.created_at DESC
         LIMIT 100`
      )
      .all();
  }
  res.json(hydratePosts(rows, me.id));
});

app.get('/api/posts/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const me = currentUser(req);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) return res.status(404).json({ error: 'not found' });
  const ancestors = [];
  let cur = post;
  while (cur.parent_id) {
    const p = db.prepare('SELECT * FROM posts WHERE id = ?').get(cur.parent_id);
    if (!p) break;
    ancestors.unshift(p);
    cur = p;
  }
  const replies = db.prepare('SELECT * FROM posts WHERE parent_id = ? ORDER BY created_at ASC').all(id);
  res.json({
    ancestors: hydratePosts(ancestors, me.id),
    post: hydratePosts([post], me.id)[0],
    replies: hydratePosts(replies, me.id),
  });
});

app.post('/api/posts', (req, res) => {
  const me = currentUser(req);
  const body = (req.body && req.body.body || '').toString().trim();
  const parentId = req.body && req.body.parent_id ? parseInt(req.body.parent_id, 10) : null;
  if (!body) return res.status(400).json({ error: 'empty' });
  if (body.length > 280) return res.status(400).json({ error: 'too long' });
  if (parentId) {
    const parent = db.prepare('SELECT id FROM posts WHERE id = ?').get(parentId);
    if (!parent) return res.status(400).json({ error: 'parent not found' });
  }
  const info = db
    .prepare('INSERT INTO posts (author_id, parent_id, body, created_at) VALUES (?, ?, ?, ?)')
    .run(me.id, parentId, body, Date.now());
  const row = db.prepare('SELECT * FROM posts WHERE id = ?').get(info.lastInsertRowid);
  res.json(hydratePosts([row], me.id)[0]);
});

app.post('/api/posts/:id/like', (req, res) => {
  const me = currentUser(req);
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND post_id = ?').get(me.id, id);
  if (existing) {
    db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(me.id, id);
    res.json({ liked: false });
  } else {
    db.prepare('INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)').run(me.id, id, Date.now());
    res.json({ liked: true });
  }
});

app.post('/api/posts/:id/repost', (req, res) => {
  const me = currentUser(req);
  const id = parseInt(req.params.id, 10);
  const existing = db.prepare('SELECT 1 FROM reposts WHERE user_id = ? AND post_id = ?').get(me.id, id);
  if (existing) {
    db.prepare('DELETE FROM reposts WHERE user_id = ? AND post_id = ?').run(me.id, id);
    res.json({ reposted: false });
  } else {
    db.prepare('INSERT INTO reposts (user_id, post_id, created_at) VALUES (?, ?, ?)').run(me.id, id, Date.now());
    res.json({ reposted: true });
  }
});

app.delete('/api/posts/:id', (req, res) => {
  const me = currentUser(req);
  const id = parseInt(req.params.id, 10);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) return res.status(404).json({ error: 'not found' });
  if (post.author_id !== me.id) return res.status(403).json({ error: 'forbidden' });
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  res.json({ ok: true });
});

app.get('/api/users/:handle', (req, res) => {
  const me = currentUser(req);
  const u = db.prepare('SELECT * FROM users WHERE handle = ?').get(req.params.handle);
  if (!u) return res.status(404).json({ error: 'not found' });
  const posts = db
    .prepare('SELECT * FROM posts WHERE author_id = ? AND parent_id IS NULL ORDER BY created_at DESC LIMIT 100')
    .all(u.id);
  const replies = db
    .prepare('SELECT * FROM posts WHERE author_id = ? AND parent_id IS NOT NULL ORDER BY created_at DESC LIMIT 100')
    .all(u.id);
  const liked = db
    .prepare(
      `SELECT p.* FROM posts p JOIN likes l ON l.post_id = p.id
       WHERE l.user_id = ? ORDER BY l.created_at DESC LIMIT 100`
    )
    .all(u.id);
  const followers = db.prepare('SELECT COUNT(*) AS c FROM follows WHERE followee_id = ?').get(u.id).c;
  const following = db.prepare('SELECT COUNT(*) AS c FROM follows WHERE follower_id = ?').get(u.id).c;
  const viewerFollows = !!db
    .prepare('SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?')
    .get(me.id, u.id);
  res.json({
    user: { ...u, verified: !!u.verified },
    posts: hydratePosts(posts, me.id),
    replies: hydratePosts(replies, me.id),
    liked: hydratePosts(liked, me.id),
    followers,
    following,
    viewer_follows: viewerFollows,
    is_self: me.id === u.id,
  });
});

app.post('/api/users/:handle/follow', (req, res) => {
  const me = currentUser(req);
  const u = db.prepare('SELECT id FROM users WHERE handle = ?').get(req.params.handle);
  if (!u) return res.status(404).json({ error: 'not found' });
  if (u.id === me.id) return res.status(400).json({ error: 'cannot follow self' });
  const existing = db
    .prepare('SELECT 1 FROM follows WHERE follower_id = ? AND followee_id = ?')
    .get(me.id, u.id);
  if (existing) {
    db.prepare('DELETE FROM follows WHERE follower_id = ? AND followee_id = ?').run(me.id, u.id);
    res.json({ following: false });
  } else {
    db.prepare('INSERT INTO follows (follower_id, followee_id, created_at) VALUES (?, ?, ?)').run(
      me.id,
      u.id,
      Date.now()
    );
    res.json({ following: true });
  }
});

app.get('/api/suggestions', (req, res) => {
  const me = currentUser(req);
  const rows = db
    .prepare(
      `SELECT u.id, u.handle, u.display_name, u.avatar_hue, u.verified
       FROM users u
       WHERE u.id <> ?
         AND u.id NOT IN (SELECT followee_id FROM follows WHERE follower_id = ?)
       ORDER BY (SELECT COUNT(*) FROM follows WHERE followee_id = u.id) DESC
       LIMIT 5`
    )
    .all(me.id, me.id);
  res.json(rows.map((r) => ({ ...r, verified: !!r.verified })));
});

app.get('/api/search', (req, res) => {
  const me = currentUser(req);
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.json({ posts: [], users: [] });
  const like = `%${q}%`;
  const users = db
    .prepare(
      `SELECT id, handle, display_name, avatar_hue, verified FROM users
       WHERE handle LIKE ? OR display_name LIKE ? LIMIT 10`
    )
    .all(like, like)
    .map((r) => ({ ...r, verified: !!r.verified }));
  const posts = db
    .prepare('SELECT * FROM posts WHERE body LIKE ? ORDER BY created_at DESC LIMIT 50')
    .all(like);
  res.json({ posts: hydratePosts(posts, me.id), users });
});

app.get('/api/trends', (_req, res) => {
  // Compute trending hashtags from recent posts.
  const since = Date.now() - 1000 * 60 * 60 * 24 * 14;
  const rows = db.prepare('SELECT body FROM posts WHERE created_at > ?').all(since);
  const counts = new Map();
  for (const r of rows) {
    const tags = (r.body.match(/#[A-Za-z0-9_]{2,32}/g) || []).map((t) => t.toLowerCase());
    for (const t of tags) counts.set(t, (counts.get(t) || 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  res.json(sorted.map(([tag, count]) => ({ tag, count })));
});

// SPA fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  const indexPath = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
  next();
});
} // end setupRoutes

module.exports = { buildApp };

if (require.main === module) {
  boot().catch((e) => { console.error(e); process.exit(1); });
}
