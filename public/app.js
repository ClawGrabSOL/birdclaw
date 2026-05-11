// birdclaw — frontend (vanilla, no framework)

const $app = document.getElementById('app');
const tplPost = document.getElementById('tpl-post');

const ICONS = {
  home:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.591 7.146L12.52 1.157c-.316-.21-.724-.21-1.04 0L2.409 7.146c-.86.566-.51 1.795.5 1.795H4v9.86c0 .7.57 1.27 1.27 1.27h3.18c.7 0 1.27-.57 1.27-1.27v-3.81c0-.92.74-1.66 1.66-1.66h1.24c.92 0 1.66.74 1.66 1.66v3.81c0 .7.57 1.27 1.27 1.27h3.18c.7 0 1.27-.57 1.27-1.27v-9.86h1.092c1.01 0 1.36-1.228.5-1.795z"/></svg>',
  homeOutline: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21.591 7.146 12.52 1.157a1 1 0 0 0-1.04 0L2.409 7.146A.916.916 0 0 0 2.91 8.94H4v9.86c0 .7.57 1.27 1.27 1.27h3.18c.7 0 1.27-.57 1.27-1.27v-3.81c0-.92.74-1.66 1.66-1.66h1.24c.92 0 1.66.74 1.66 1.66v3.81c0 .7.57 1.27 1.27 1.27h3.18c.7 0 1.27-.57 1.27-1.27V8.94h1.092a.916.916 0 0 0 .501-1.794z"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M10.25 4.0a6.25 6.25 0 1 0 3.71 11.27l4.04 4.04 1.41-1.41-4.04-4.04A6.25 6.25 0 0 0 10.25 4Zm0 2a4.25 4.25 0 1 1 0 8.5 4.25 4.25 0 0 1 0-8.5Z"/></svg>',
  bell:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M19.993 20.428a3.501 3.501 0 0 1-3.5 3.5h-9a3.501 3.501 0 0 1-3.5-3.5h16Zm-8-17.5a6 6 0 0 1 6 6v3.18c0 .77.32 1.5.87 2.04l1.92 1.86c.32.31.5.74.5 1.18v.74h-18.5v-.74c0-.44.18-.87.5-1.18l1.92-1.86c.55-.54.87-1.27.87-2.04V8.93a6 6 0 0 1 6-6Z"/></svg>',
  mail:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 5h18v14H3z"/><path d="m3 7 9 6 9-6"/></svg>',
  profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  more:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>',
  bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3z"/></svg>',
  hashtag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 3 8 21M16 3l-2 18M3 8h18M2 16h18"/></svg>',
  arrowLeft:'<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.414 13H20v-2H7.414l5.293-5.293-1.414-1.414L3.586 12l7.707 7.707 1.414-1.414z"/></svg>',
  image:   '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.881 3 21 4.12 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.119 21 3 19.88 3 18.5v-13zM5.5 5a.5.5 0 0 0-.5.5v9.086l3-3 3 3 5-5 3 3V5.5a.5.5 0 0 0-.5-.5h-13zM19 15.414l-3-3-5 5-3-3-3 3V18.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-3.086zM9.75 7C8.784 7 8 7.784 8 8.75s.784 1.75 1.75 1.75 1.75-.784 1.75-1.75S10.716 7 9.75 7z"/></svg>',
  gif:     '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5C3 4.119 4.12 3 5.5 3h13C19.881 3 21 4.12 21 5.5v13c0 1.381-1.12 2.5-2.5 2.5h-13C4.119 21 3 19.88 3 18.5v-13zM5.5 5a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5h-13zM7 9h3v6H9V11.5H8.5L7 13V9zm5 0h1v6h-1V9zm3 0h3v1h-2v1.5h2v1h-2V15h-1V9z"/></svg>',
  poll:    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h2v14H6V5zm5 4h2v10h-2V9zm5-4h2v14h-2V5z"/></svg>',
  emoji:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r=".5" fill="currentColor"/><circle cx="15" cy="10" r=".5" fill="currentColor"/><path d="M8.5 14.5a4 4 0 0 0 7 0"/></svg>',
  schedule:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
};

// ── State ────────────────────────────────────────────────────────────────────
const state = {
  me: null,
  route: { name: 'home', params: {} },
  feedTab: 'foryou',
  profileTab: 'posts',
};

// ── API helpers ──────────────────────────────────────────────────────────────
async function api(path, opts = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

// ── Utilities ────────────────────────────────────────────────────────────────
function initials(name) {
  const parts = String(name || '?').trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0] || '').join('').toUpperCase() || '?';
}
function relTime(ts) {
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.max(1, Math.floor(diff))}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  const days = Math.floor(diff / 86400);
  if (days < 7) return `${days}d`;
  const d = new Date(ts);
  const sameYear = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: sameYear ? undefined : 'numeric' });
}
function absTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric',
  });
}
function compact(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  if (n < 1e6) return Math.floor(n / 1000) + 'K';
  return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
}

function el(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstElementChild;
}

function renderBody(text) {
  // Escape, then linkify hashtags, @mentions, URLs.
  const esc = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return esc
    .replace(/(https?:\/\/[^\s<]+)/g, '<a class="link" href="$1" target="_blank" rel="noopener">$1</a>')
    .replace(/(^|\s)#([A-Za-z0-9_]{2,32})/g, '$1<a class="tag" href="#/search?q=%23$2">#$2</a>')
    .replace(/(^|\s)@([A-Za-z0-9_]{1,20})/g, '$1<a class="mention" href="#/u/$2">@$2</a>');
}

function avatar(user, size = '') {
  const cls = size ? `avatar ${size}` : 'avatar';
  const init = initials(user.display_name || user.handle);
  return `<span class="${cls}" style="--h:${user.avatar_hue || 210}">${init}</span>`;
}

function toast(text) {
  const t = el(`<div class="toast">${text}</div>`);
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2900);
}

// ── Router ───────────────────────────────────────────────────────────────────
function parseHash() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash || hash === '/' || hash === '/home') return { name: 'home', params: {} };
  if (hash.startsWith('/u/')) {
    const [handle, sub] = hash.slice(3).split('/');
    return { name: 'profile', params: { handle, sub: sub || 'posts' } };
  }
  if (hash.startsWith('/p/')) {
    return { name: 'post', params: { id: parseInt(hash.slice(3), 10) } };
  }
  if (hash.startsWith('/search')) {
    const q = new URLSearchParams(hash.split('?')[1] || '');
    return { name: 'search', params: { q: q.get('q') || '' } };
  }
  if (hash === '/notifications') return { name: 'notifications', params: {} };
  if (hash === '/bookmarks')     return { name: 'bookmarks', params: {} };
  if (hash === '/messages')      return { name: 'messages', params: {} };
  return { name: 'home', params: {} };
}

function navigate(hash) {
  if (location.hash === hash) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
  } else {
    location.hash = hash;
  }
}

// ── Render: shell ────────────────────────────────────────────────────────────
function renderShell() {
  $app.innerHTML = `
    <div class="shell">
      <nav class="rail" aria-label="Primary">
        <a class="rail-logo" href="#/" aria-label="birdclaw home"><img src="/assets/birdclaw-logo.jpg" alt="" /></a>
        <a class="rail-link" data-route="home" href="#/">${ICONS.homeOutline}<span>Home</span></a>
        <a class="rail-link" data-route="search" href="#/search">${ICONS.hashtag}<span>Explore</span></a>
        <a class="rail-link" data-route="notifications" href="#/notifications">${ICONS.bell}<span>Notifications</span></a>
        <a class="rail-link" data-route="messages" href="#/messages">${ICONS.mail}<span>Messages</span></a>
        <a class="rail-link" data-route="bookmarks" href="#/bookmarks">${ICONS.bookmark}<span>Bookmarks</span></a>
        <a class="rail-link" data-route="profile" href="#/u/me" id="rail-profile">${ICONS.profile}<span>Profile</span></a>
        <button class="rail-cta" id="btn-post">Post</button>
        <div class="rail-spacer"></div>
        <div class="rail-user" id="rail-user" title="Switch account"></div>
      </nav>
      <main class="feed" id="feed"></main>
      <aside class="aside" id="aside"></aside>
    </div>
  `;

  document.getElementById('btn-post').addEventListener('click', () => openComposerModal());
  document.getElementById('rail-user').addEventListener('click', () => openUserSwitcher());
  highlightRail();
}

function highlightRail() {
  for (const link of document.querySelectorAll('.rail-link')) link.classList.remove('is-active');
  let routeKey = state.route.name;
  if (state.route.name === 'profile' && state.route.params.handle === (state.me && state.me.handle)) {
    routeKey = 'profile';
  } else if (state.route.name === 'profile') {
    routeKey = null;
  }
  const target = document.querySelector(`.rail-link[data-route="${routeKey}"]`);
  if (target) target.classList.add('is-active');
  // Fix the "profile" link to point at /u/<me>
  const meLink = document.getElementById('rail-profile');
  if (meLink && state.me) meLink.setAttribute('href', `#/u/${state.me.handle}`);
}

function renderRailUser() {
  const me = state.me;
  const node = document.getElementById('rail-user');
  if (!me || !node) return;
  node.innerHTML = `
    ${avatar(me, 'sm')}
    <div class="rail-user-text">
      <div class="rail-user-name">${escapeHtml(me.display_name)}</div>
      <div class="rail-user-handle">@${escapeHtml(me.handle)}</div>
    </div>
    ${ICONS.more}
  `;
}

function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Compose ──────────────────────────────────────────────────────────────────
function renderComposer({ parent = null, autofocus = false } = {}) {
  const c = el(`
    <div class="composer">
      <div class="composer-avatar">${avatar(state.me)}</div>
      <div class="composer-main">
        <textarea class="composer-textarea" maxlength="280" placeholder="${parent ? 'Post your reply' : "What's happening?"}" rows="1"></textarea>
        <div class="composer-actions">
          <div class="composer-tools">
            <button title="Media" type="button">${ICONS.image}</button>
            <button title="GIF" type="button">${ICONS.gif}</button>
            <button title="Poll" type="button">${ICONS.poll}</button>
            <button title="Emoji" type="button">${ICONS.emoji}</button>
            <button title="Schedule" type="button">${ICONS.schedule}</button>
          </div>
          <div class="composer-meter">
            <svg class="meter-ring" viewBox="0 0 28 28">
              <circle class="track" cx="14" cy="14" r="12"></circle>
              <circle class="indicator" cx="14" cy="14" r="12" stroke-dasharray="75.4" stroke-dashoffset="75.4" stroke-linecap="round"></circle>
            </svg>
            <button class="composer-submit" disabled type="button">${parent ? 'Reply' : 'Post'}</button>
          </div>
        </div>
      </div>
    </div>
  `);
  const ta = c.querySelector('.composer-textarea');
  const submit = c.querySelector('.composer-submit');
  const ring = c.querySelector('.meter-ring');
  const indicator = c.querySelector('.indicator');
  const CIRC = 2 * Math.PI * 12;
  indicator.setAttribute('stroke-dasharray', CIRC.toFixed(2));
  indicator.setAttribute('stroke-dashoffset', CIRC.toFixed(2));

  function autosize() {
    ta.style.height = 'auto';
    ta.style.height = Math.min(320, ta.scrollHeight) + 'px';
  }
  function refresh() {
    const len = ta.value.length;
    const pct = Math.min(len / 280, 1);
    indicator.setAttribute('stroke-dashoffset', (CIRC * (1 - pct)).toFixed(2));
    ring.classList.toggle('is-warn', len >= 260 && len < 280);
    ring.classList.toggle('is-over', len >= 280);
    submit.disabled = len === 0 || len > 280;
    autosize();
  }
  ta.addEventListener('input', refresh);
  ta.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit.click();
    }
  });
  submit.addEventListener('click', async () => {
    const body = ta.value.trim();
    if (!body) return;
    submit.disabled = true;
    try {
      const newPost = await api('/api/posts', {
        method: 'POST',
        body: JSON.stringify({ body, parent_id: parent || null }),
      });
      ta.value = '';
      refresh();
      window.dispatchEvent(new CustomEvent('bc:posted', { detail: { post: newPost, parent } }));
      if (parent) toast('Your reply was sent');
      else toast('Your post was sent');
    } catch (err) {
      submit.disabled = false;
      toast('Could not post');
    }
  });

  if (autofocus) setTimeout(() => ta.focus(), 30);
  return c;
}

function openComposerModal(parentId = null) {
  const backdrop = el(`<div class="modal-backdrop"></div>`);
  const modal = el(`<div class="modal">
    <div class="modal-head"><button class="modal-close" aria-label="Close">${ICONS.arrowLeft.replace('viewBox="0 0 24 24"', 'viewBox="0 0 24 24" width="20" height="20"')}</button></div>
  </div>`);
  modal.appendChild(renderComposer({ parent: parentId, autofocus: true }));
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);

  function close() { backdrop.remove(); }
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  modal.querySelector('.modal-close').addEventListener('click', close);
  window.addEventListener('bc:posted', close, { once: true });
}

// ── Post rendering ───────────────────────────────────────────────────────────
function renderPostNode(post, opts = {}) {
  const node = tplPost.content.firstElementChild.cloneNode(true);
  node.dataset.id = post.id;
  if (post.author && post.author.verified) node.classList.add('is-verified');

  // Avatar slot
  const avSlot = node.querySelector('.post-avatar-link');
  avSlot.innerHTML = avatar(post.author);
  avSlot.setAttribute('href', `#/u/${post.author.handle}`);

  node.querySelector('.post-name').textContent = post.author.display_name;
  node.querySelector('.post-name').setAttribute('href', `#/u/${post.author.handle}`);
  node.querySelector('.post-handle').textContent = '@' + post.author.handle;
  node.querySelector('.post-time').textContent = relTime(post.created_at);
  node.querySelector('.post-time').setAttribute('title', absTime(post.created_at));
  node.querySelector('.post-body').innerHTML = renderBody(post.body);

  const replyBtn = node.querySelector('.act-reply');
  const repostBtn = node.querySelector('.act-repost');
  const likeBtn = node.querySelector('.act-like');
  replyBtn.querySelector('.act-count').textContent = post.replies ? compact(post.replies) : '';
  repostBtn.querySelector('.act-count').textContent = post.reposts ? compact(post.reposts) : '';
  likeBtn.querySelector('.act-count').textContent = post.likes ? compact(post.likes) : '';
  if (post.viewer_liked) likeBtn.classList.add('is-active');
  if (post.viewer_reposted) repostBtn.classList.add('is-active');

  // Click through to detail
  node.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    navigate(`#/p/${post.id}`);
  });

  replyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openComposerModal(post.id);
  });
  likeBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const wasActive = likeBtn.classList.contains('is-active');
    likeBtn.classList.toggle('is-active');
    const cnt = likeBtn.querySelector('.act-count');
    const cur = parseInt(cnt.dataset.raw || post.likes, 10);
    const next = cur + (wasActive ? -1 : 1);
    cnt.dataset.raw = next;
    cnt.textContent = next ? compact(next) : '';
    try {
      await api(`/api/posts/${post.id}/like`, { method: 'POST' });
    } catch {
      likeBtn.classList.toggle('is-active');
      cnt.dataset.raw = cur;
      cnt.textContent = cur ? compact(cur) : '';
    }
  });
  repostBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const wasActive = repostBtn.classList.contains('is-active');
    repostBtn.classList.toggle('is-active');
    const cnt = repostBtn.querySelector('.act-count');
    const cur = parseInt(cnt.dataset.raw || post.reposts, 10);
    const next = cur + (wasActive ? -1 : 1);
    cnt.dataset.raw = next;
    cnt.textContent = next ? compact(next) : '';
    try {
      await api(`/api/posts/${post.id}/repost`, { method: 'POST' });
      toast(wasActive ? 'Repost undone' : 'Reposted');
    } catch {
      repostBtn.classList.toggle('is-active');
      cnt.dataset.raw = cur;
      cnt.textContent = cur ? compact(cur) : '';
    }
  });
  node.querySelector('.act-share').addEventListener('click', (e) => {
    e.stopPropagation();
    const url = `${location.origin}/#/p/${post.id}`;
    navigator.clipboard?.writeText(url).then(
      () => toast('Link copied'),
      () => toast('Could not copy')
    );
  });
  node.querySelector('.post-more').addEventListener('click', async (e) => {
    e.stopPropagation();
    if (post.author.id !== state.me.id) {
      toast("Can't delete someone else's post");
      return;
    }
    if (!confirm('Delete this post?')) return;
    try {
      await api(`/api/posts/${post.id}`, { method: 'DELETE' });
      node.remove();
      toast('Post deleted');
    } catch {
      toast('Could not delete');
    }
  });

  return node;
}

// ── Views ───────────────────────────────────────────────────────────────────
async function viewHome() {
  const feed = document.getElementById('feed');
  feed.innerHTML = `
    <header class="feed-head">
      <div class="feed-head-title">Home</div>
      <div class="feed-tabs">
        <button class="feed-tab ${state.feedTab === 'foryou' ? 'is-active' : ''}" data-tab="foryou">For you</button>
        <button class="feed-tab ${state.feedTab === 'following' ? 'is-active' : ''}" data-tab="following">Following</button>
      </div>
    </header>
  `;
  feed.appendChild(renderComposer({}));
  const feedList = el(`<div id="feed-list"></div>`);
  feed.appendChild(feedList);
  feedList.innerHTML = skeletonList(5);

  for (const t of feed.querySelectorAll('.feed-tab')) {
    t.addEventListener('click', () => {
      state.feedTab = t.dataset.tab;
      viewHome();
    });
  }

  try {
    const rows = await api(`/api/feed?tab=${encodeURIComponent(state.feedTab)}`);
    feedList.innerHTML = '';
    if (rows.length === 0) {
      feedList.appendChild(el(`<div class="empty"><h2>Nothing here yet</h2><p>${state.feedTab === 'following' ? 'Follow some folks to see their posts.' : 'Be the first to post.'}</p></div>`));
    } else {
      for (const p of rows) feedList.appendChild(renderPostNode(p));
    }
  } catch {
    feedList.innerHTML = `<div class="empty">Could not load feed.</div>`;
  }
}

function skeletonList(n) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += `
      <div class="post">
        <div class="skeleton" style="width:40px;height:40px;border-radius:50%"></div>
        <div style="flex:1;min-width:0;display:flex;flex-direction:column;gap:8px">
          <div class="skeleton" style="height:14px;width:30%"></div>
          <div class="skeleton" style="height:14px;width:90%"></div>
          <div class="skeleton" style="height:14px;width:60%"></div>
        </div>
      </div>`;
  }
  return out;
}

async function viewPost() {
  const id = state.route.params.id;
  const feed = document.getElementById('feed');
  feed.innerHTML = `
    <header class="feed-head">
      <div class="feed-head-title">
        <button class="feed-head-back" aria-label="Back" onclick="history.back()">${ICONS.arrowLeft}</button>
        Post
      </div>
    </header>
    <div id="thread">${skeletonList(2)}</div>
  `;
  try {
    const data = await api(`/api/posts/${id}`);
    const thread = document.getElementById('thread');
    thread.innerHTML = '';
    for (const a of data.ancestors) thread.appendChild(renderPostNode(a));
    thread.appendChild(renderPostDetail(data.post));
    // inline reply composer
    const composer = renderComposer({ parent: data.post.id });
    composer.style.borderBottom = '1px solid var(--line)';
    thread.appendChild(composer);
    for (const r of data.replies) thread.appendChild(renderPostNode(r));
  } catch {
    feed.querySelector('#thread').innerHTML = `<div class="empty">Post not found.</div>`;
  }
}

function renderPostDetail(post) {
  const wrap = el(`<article class="post-detail" data-id="${post.id}">
    <div class="detail-head">
      <a href="#/u/${post.author.handle}">${avatar(post.author)}</a>
      <div class="detail-author">
        <div class="detail-name"><a href="#/u/${post.author.handle}">${escapeHtml(post.author.display_name)}</a>${post.author.verified ? '<span style="color:var(--bc-blue)">✓</span>' : ''}</div>
        <div class="detail-handle">@${escapeHtml(post.author.handle)}</div>
      </div>
    </div>
    <div class="detail-body">${renderBody(post.body)}</div>
    <div class="detail-time">${absTime(post.created_at)}</div>
    <div class="detail-stats">
      <span><strong>${compact(post.reposts)}</strong> Reposts</span>
      <span><strong>${compact(post.likes)}</strong> Likes</span>
      <span><strong>${compact(post.replies)}</strong> Replies</span>
    </div>
    <div class="detail-actions"></div>
  </article>`);
  // wire detail action buttons by reusing the post node's bar
  const proxy = renderPostNode(post);
  const bar = proxy.querySelector('.post-actions');
  bar.style.maxWidth = 'none';
  bar.style.justifyContent = 'space-around';
  bar.style.margin = '0';
  wrap.querySelector('.detail-actions').appendChild(bar);
  return wrap;
}

async function viewProfile() {
  const { handle, sub } = state.route.params;
  state.profileTab = sub || 'posts';
  const feed = document.getElementById('feed');
  const realHandle = handle === 'me' ? state.me.handle : handle;
  feed.innerHTML = `
    <header class="feed-head">
      <div class="feed-head-title">
        <button class="feed-head-back" aria-label="Back" onclick="history.back()">${ICONS.arrowLeft}</button>
        <div>
          <div id="ph-name" class="skeleton" style="height:16px;width:120px"></div>
          <div id="ph-count" class="feed-head-sub"></div>
        </div>
      </div>
    </header>
    <div id="profile-body">${skeletonList(2)}</div>
  `;
  try {
    const data = await api(`/api/users/${encodeURIComponent(realHandle)}`);
    const u = data.user;
    document.querySelector('#ph-name').outerHTML = `<div style="display:flex;align-items:center;gap:4px;font-size:20px;font-weight:800">${escapeHtml(u.display_name)}${u.verified ? '<span style="color:var(--bc-blue)">✓</span>' : ''}</div>`;
    document.querySelector('#ph-count').textContent = `${compact(data.posts.length + data.replies.length)} posts`;
    const body = document.getElementById('profile-body');
    body.innerHTML = '';
    body.appendChild(el(`<div class="profile-banner" style="--h:${u.avatar_hue}"></div>`));
    const meta = el(`
      <div class="profile-meta">
        <div class="profile-avatar-wrap">
          ${avatar(u, 'lg')}
          <div>
            ${data.is_self
              ? `<button class="btn-follow is-following"><span class="label-following">Edit profile</span></button>`
              : `<button class="btn-follow ${data.viewer_follows ? 'is-following' : ''}" id="btn-follow">
                  ${data.viewer_follows
                    ? '<span class="label-following">Following</span><span class="label-unfollow">Unfollow</span>'
                    : 'Follow'}
                </button>`}
          </div>
        </div>
        <div class="profile-name">${escapeHtml(u.display_name)}${u.verified ? `<svg class="post-verified" style="display:inline-block;color:var(--bc-blue)" viewBox="0 0 22 22" width="20" height="20"><path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.164-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" fill="currentColor"/></svg>` : ''}</div>
        <div class="profile-handle">@${escapeHtml(u.handle)}</div>
        <div class="profile-bio">${escapeHtml(u.bio || '')}</div>
        <div class="profile-stats">
          <span><strong>${compact(data.following)}</strong>Following</span>
          <span><strong>${compact(data.followers)}</strong>Followers</span>
        </div>
      </div>
    `);
    body.appendChild(meta);

    const tabs = el(`<div class="profile-tabs">
      <button class="feed-tab ${state.profileTab === 'posts' ? 'is-active' : ''}" data-tab="posts">Posts</button>
      <button class="feed-tab ${state.profileTab === 'replies' ? 'is-active' : ''}" data-tab="replies">Replies</button>
      <button class="feed-tab ${state.profileTab === 'likes' ? 'is-active' : ''}" data-tab="likes">Likes</button>
    </div>`);
    body.appendChild(tabs);

    const list = el(`<div></div>`);
    body.appendChild(list);
    const drawList = () => {
      list.innerHTML = '';
      const rows = state.profileTab === 'posts' ? data.posts
                 : state.profileTab === 'replies' ? data.replies
                 : data.liked;
      if (rows.length === 0) {
        list.appendChild(el(`<div class="empty">No ${state.profileTab} yet.</div>`));
      } else {
        for (const p of rows) list.appendChild(renderPostNode(p));
      }
    };
    drawList();
    for (const t of tabs.querySelectorAll('.feed-tab')) {
      t.addEventListener('click', () => {
        state.profileTab = t.dataset.tab;
        for (const tt of tabs.querySelectorAll('.feed-tab')) tt.classList.toggle('is-active', tt === t);
        drawList();
      });
    }

    const followBtn = document.getElementById('btn-follow');
    if (followBtn) {
      followBtn.addEventListener('click', async () => {
        const wasFollowing = followBtn.classList.contains('is-following');
        try {
          const res = await api(`/api/users/${encodeURIComponent(u.handle)}/follow`, { method: 'POST' });
          followBtn.classList.toggle('is-following', res.following);
          followBtn.innerHTML = res.following
            ? '<span class="label-following">Following</span><span class="label-unfollow">Unfollow</span>'
            : 'Follow';
          toast(res.following ? `Now following @${u.handle}` : `Unfollowed @${u.handle}`);
        } catch {
          toast('Could not update follow');
        }
      });
    }
  } catch {
    document.getElementById('profile-body').innerHTML = `<div class="empty">User not found.</div>`;
  }
}

async function viewSearch() {
  const q = state.route.params.q || '';
  const feed = document.getElementById('feed');
  feed.innerHTML = `
    <header class="feed-head">
      <div class="feed-head-title">Explore</div>
      <div class="feed-head-sub">${q ? `Results for “${escapeHtml(q)}”` : 'Search posts, people, hashtags'}</div>
    </header>
    <div id="search-results">${q ? skeletonList(3) : '<div class="empty">Try searching for a hashtag like <a href="#/search?q=%23" style="color:var(--bc-blue)">#</a></div>'}</div>
  `;
  if (!q) return;
  try {
    const data = await api('/api/search?q=' + encodeURIComponent(q));
    const r = document.getElementById('search-results');
    r.innerHTML = '';
    if (data.users.length === 0 && data.posts.length === 0) {
      r.appendChild(el(`<div class="empty"><h2>No results for "${escapeHtml(q)}"</h2></div>`));
      return;
    }
    if (data.users.length) {
      const card = el(`<div class="card"><div class="card-title">People</div></div>`);
      for (const u of data.users) {
        card.appendChild(el(`
          <a class="card-row" href="#/u/${u.handle}" style="text-decoration:none;color:inherit">
            ${avatar(u, 'sm')}
            <div class="card-row-main">
              <div class="suggest-name">${escapeHtml(u.display_name)}${u.verified ? '<span style="color:var(--bc-blue)">✓</span>' : ''}</div>
              <div class="suggest-handle">@${escapeHtml(u.handle)}</div>
            </div>
          </a>`));
      }
      r.appendChild(card);
    }
    for (const p of data.posts) r.appendChild(renderPostNode(p));
  } catch {
    document.getElementById('search-results').innerHTML = `<div class="empty">Search failed.</div>`;
  }
}

function viewStatic(title, sub) {
  const feed = document.getElementById('feed');
  feed.innerHTML = `
    <header class="feed-head">
      <div class="feed-head-title">${escapeHtml(title)}</div>
    </header>
    <div class="empty">
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(sub)}</p>
    </div>`;
}

// ── Right aside ──────────────────────────────────────────────────────────────
async function renderAside() {
  const aside = document.getElementById('aside');
  aside.innerHTML = `
    <div class="search">
      <div class="search-box">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10.25 4a6.25 6.25 0 1 0 3.71 11.27l4.04 4.04 1.41-1.41-4.04-4.04A6.25 6.25 0 0 0 10.25 4Zm0 2a4.25 4.25 0 1 1 0 8.5 4.25 4.25 0 0 1 0-8.5Z"/></svg>
        <input id="search-input" placeholder="Search birdclaw" autocomplete="off" />
      </div>
    </div>
    <div class="card" id="trends-card">
      <div class="card-title">Trends for you</div>
      <div id="trends-body"><div class="card-row"><div class="card-row-main"><div class="card-row-cat">Loading…</div></div></div></div>
    </div>
    <div class="card" id="suggest-card">
      <div class="card-title">Who to follow</div>
      <div id="suggest-body"></div>
    </div>
    <div class="foot-small">
      <a href="#">Terms</a><a href="#">Privacy</a><a href="#">Cookies</a><a href="#">Accessibility</a>
      <span>© birdclaw</span>
    </div>
  `;

  document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = e.target.value.trim();
      if (v) navigate(`#/search?q=${encodeURIComponent(v)}`);
    }
  });

  // Trends
  api('/api/trends').then((trends) => {
    const body = document.getElementById('trends-body');
    body.innerHTML = '';
    if (trends.length === 0) {
      body.innerHTML = `<div class="card-row"><div class="card-row-main"><div class="card-row-meta">No trends yet — start a hashtag</div></div></div>`;
      return;
    }
    trends.forEach((t, i) => {
      body.appendChild(el(`
        <a class="card-row" href="#/search?q=${encodeURIComponent(t.tag)}" style="color:inherit">
          <div class="card-row-main">
            <div class="card-row-cat">Trending · #${i + 1}</div>
            <div class="card-row-title">${escapeHtml(t.tag)}</div>
            <div class="card-row-meta">${compact(t.count)} posts</div>
          </div>
        </a>`));
    });
  }).catch(() => {});

  // Suggestions
  try {
    const sug = await api('/api/suggestions');
    const body = document.getElementById('suggest-body');
    body.innerHTML = '';
    if (sug.length === 0) {
      body.innerHTML = `<div class="card-row"><div class="card-row-meta">You're following everyone. Look at you.</div></div>`;
    } else {
      for (const u of sug) {
        const row = el(`
          <div class="card-row">
            <a href="#/u/${u.handle}" style="display:contents">${avatar(u, 'sm')}</a>
            <div class="card-row-main">
              <a href="#/u/${u.handle}" style="color:inherit"><div class="suggest-name">${escapeHtml(u.display_name)}${u.verified ? '<span style="color:var(--bc-blue)">✓</span>' : ''}</div></a>
              <div class="suggest-handle">@${escapeHtml(u.handle)}</div>
            </div>
            <button class="btn-follow" data-handle="${u.handle}">Follow</button>
          </div>`);
        row.querySelector('.btn-follow').addEventListener('click', async (e) => {
          const btn = e.currentTarget;
          try {
            const res = await api(`/api/users/${u.handle}/follow`, { method: 'POST' });
            btn.classList.toggle('is-following', res.following);
            btn.innerHTML = res.following
              ? '<span class="label-following">Following</span><span class="label-unfollow">Unfollow</span>'
              : 'Follow';
          } catch { toast('Could not follow'); }
        });
        body.appendChild(row);
      }
    }
  } catch {}
}

// ── User switcher ────────────────────────────────────────────────────────────
async function openUserSwitcher() {
  const backdrop = el(`<div class="modal-backdrop"></div>`);
  const modal = el(`<div class="modal" style="width:380px">
    <div class="modal-head">
      <button class="modal-close" aria-label="Close">${ICONS.arrowLeft}</button>
      <div style="font-weight:800;font-size:18px">Switch account</div>
    </div>
    <div id="switch-body" style="padding:8px 0 16px"></div>
  </div>`);
  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });
  modal.querySelector('.modal-close').addEventListener('click', () => backdrop.remove());

  const body = modal.querySelector('#switch-body');
  try {
    const users = await api('/api/users');
    for (const u of users) {
      const row = el(`
        <div class="card-row" data-id="${u.id}">
          ${avatar(u)}
          <div class="card-row-main">
            <div class="suggest-name">${escapeHtml(u.display_name)}${u.verified ? '<span style="color:var(--bc-blue)">✓</span>' : ''}</div>
            <div class="suggest-handle">@${escapeHtml(u.handle)}</div>
          </div>
          ${u.id === state.me.id ? '<span style="color:var(--bc-blue);font-weight:700">active</span>' : ''}
        </div>`);
      row.addEventListener('click', async () => {
        await api('/api/switch-user', { method: 'POST', body: JSON.stringify({ id: u.id }) });
        backdrop.remove();
        await init();
      });
      body.appendChild(row);
    }
  } catch {
    body.textContent = 'Could not load users.';
  }
}

// ── Router driver ────────────────────────────────────────────────────────────
function dispatch() {
  state.route = parseHash();
  highlightRail();
  switch (state.route.name) {
    case 'home':           return viewHome();
    case 'post':           return viewPost();
    case 'profile':        return viewProfile();
    case 'search':         return viewSearch();
    case 'notifications':  return viewStatic('Notifications', "You're all caught up. (This demo doesn't track notifications yet.)");
    case 'messages':       return viewStatic('Messages', 'DMs not implemented in this build.');
    case 'bookmarks':      return viewStatic('Bookmarks', 'Save posts to read later. (Not in this build.)');
  }
}

window.addEventListener('hashchange', dispatch);
window.addEventListener('bc:posted', (e) => {
  const { post, parent } = e.detail;
  if (!parent && state.route.name === 'home') {
    const list = document.getElementById('feed-list');
    if (list) list.prepend(renderPostNode(post));
  }
  if (state.route.name === 'post') viewPost();
});

// ── Boot ─────────────────────────────────────────────────────────────────────
async function init() {
  if (!state.me) renderShell();
  try {
    state.me = await api('/api/me');
    renderRailUser();
    if (!state.shellReady) {
      renderAside();
      state.shellReady = true;
    }
    dispatch();
  } catch (err) {
    $app.innerHTML = `<div style="padding:48px;text-align:center;color:#f4212e">Could not connect to birdclaw server.</div>`;
  }
}

init();
