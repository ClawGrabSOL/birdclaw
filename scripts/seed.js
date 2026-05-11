'use strict';

// Seed birdclaw with believable starter content.
// Voices vary: shitposter, dev, designer, founder, journalist, casual.

const USERS = [
  { handle: 'you',           display_name: 'you',                    bio: "this is your account. post whatever.",                  avatar_hue: 207, verified: 0 },
  { handle: 'kasey',         display_name: 'Kasey M.',               bio: "writes code, drinks coffee, will argue about vim.",     avatar_hue: 14,  verified: 0 },
  { handle: 'lina_codes',    display_name: 'lina',                   bio: "frontend at a startup you've never heard of. ex-Adobe.", avatar_hue: 320, verified: 1 },
  { handle: 'paulhdraws',    display_name: 'Paul H.',                bio: "illustrator. dogs. occasional bad takes.",              avatar_hue: 42,  verified: 0 },
  { handle: 'nightowl',      display_name: 'nightowl 🦉',            bio: "i post when i should be sleeping",                       avatar_hue: 260, verified: 0 },
  { handle: 'devops_dani',   display_name: 'Dani / on-call',         bio: "SRE. PagerDuty has my number and my soul.",             avatar_hue: 130, verified: 0 },
  { handle: 'mira',          display_name: 'mira',                   bio: "product designer. figma all day. talk to me about typefaces.", avatar_hue: 285, verified: 1 },
  { handle: 'jasontalks',    display_name: 'Jason Reeves',           bio: "tech journalist. dms open. tips welcome.",              avatar_hue: 5,   verified: 1 },
  { handle: 'roshi',         display_name: 'roshi 🍜',               bio: "ramen, rust, ridiculous side projects.",                avatar_hue: 25,  verified: 0 },
  { handle: 'em_writes',     display_name: 'Em',                     bio: "writing a novel nobody asked for. brooklyn.",           avatar_hue: 340, verified: 0 },
  { handle: 'theofficial',   display_name: 'Theo',                   bio: "founder of something. you'll see.",                     avatar_hue: 200, verified: 1 },
  { handle: 'kimchi',        display_name: 'kimchi',                 bio: "i eat lunch and tweet about it",                         avatar_hue: 0,   verified: 0 },
];

// (authorHandle, body, hoursAgo, parentIndex|null, likes_from_indices, repost_from_indices)
// parentIndex refers to the array index of an already-inserted post.
const POSTS = [
  // 0
  ['lina_codes', "shipping a redesign tomorrow. team is calm. i am not.", 0.3, null, [2,3,5,7,9], [7]],
  // 1
  ['paulhdraws', "drew a crab in a tuxedo. don't ask why.", 1.1, null, [1,4,6,8,11], [4]],
  // 2
  ['kasey', "vim still wins. yes i tried helix. yes i tried zed. yes i'm aware it's 2026.", 2.4, null, [3,5,8,9], [3,8]],
  // 3 reply to 2
  ['roshi', "helix is good actually. but i'll see you at the next vim funeral.", 2.0, 2, [2,5], []],
  // 4
  ['mira', "if your error states look the same as your success states, please rethink your career", 3.7, null, [1,2,5,6,7,9,11], [1,2,6]],
  // 5
  ['theofficial', "raised our seed. building in public starts monday. excited to share more.", 5.2, null, [1,2,7,9,10], [7]],
  // 6
  ['jasontalks', "interesting that nobody's covering the rate-limit changes shipping next week. story to come.", 7.0, null, [1,3,5,10], [5,10]],
  // 7 reply to 5
  ['kasey', "congrats. what's the actual product though", 4.9, 5, [3,4,10], []],
  // 8 reply to 7
  ['theofficial', "soon™", 4.7, 7, [2,3,9,11], []],
  // 9
  ['devops_dani', "got paged at 3am for a CPU spike that turned out to be the monitoring agent itself. love this industry.", 9.3, null, [1,2,5,8,9], [2,5]],
  // 10
  ['em_writes', "writing tip: nobody cares about your protagonist's coffee order. start with motion.", 12.0, null, [1,2,4,6,9,11], [4,9]],
  // 11
  ['nightowl', "it's 2am, the fridge is judging me", 13.4, null, [4,8,9,11], []],
  // 12
  ['kimchi', "had a sandwich. would have again.", 18.0, null, [4,8,11], []],
  // 13
  ['roshi', "spent 4 hours debugging a rust lifetime issue. solution was to delete the function. ten out of ten.", 21.5, null, [1,2,3,5,9], [2]],
  // 14
  ['lina_codes', "css subgrid is the single best thing to happen to layout in a decade and i will not be taking questions", 26.2, null, [2,6,7,9,11], [6]],
  // 15
  ['mira', "tiny detail i love: when a button's hover state matches the cursor's velocity. you don't notice it. you feel it.", 30.0, null, [1,2,4,6,7,9,11], [2,4,7]],
  // 16 reply to 15
  ['lina_codes', "this is the kind of thing that separates 'designed' from 'styled'", 29.5, 15, [4,6], []],
  // 17
  ['paulhdraws', "my dog has decided 5:47am is the new morning. i have not been consulted.", 33.0, null, [2,5,8,9,11], [11]],
  // 18
  ['jasontalks', "if your product roadmap fits in a tweet, you don't have a roadmap. you have vibes.", 40.0, null, [1,2,5,6,10], [5,6]],
  // 19
  ['devops_dani', "incident postmortem template: 1) what broke 2) why we didn't catch it 3) who's tired 4) what we're changing", 48.0, null, [1,2,5,7,10], [2,5]],
  // 20
  ['kasey', "every codebase has one file nobody touches. that file is load-bearing. that file is the codebase.", 56.0, null, [2,3,5,6,8,9,11], [3,5,8]],
  // 21 reply to 20
  ['roshi', "ours is called 'utils.ts'. it is 4,000 lines. it imports itself.", 55.0, 20, [2,3,8,9], []],
  // 22
  ['em_writes', "started typing 'i should start journaling' into my journal app. realized the problem.", 64.0, null, [1,3,4,9,11], []],
  // 23
  ['theofficial', "hot take: most 'AI features' are just a textarea that posts to gpt and renders the response. there's a whole product layer most teams skip.", 70.0, null, [1,2,6,7,9,10], [2,6,7]],
  // 24
  ['mira', "spent the weekend redesigning my own portfolio. it's worse now. ship it.", 78.0, null, [1,2,3,4,9,11], [3]],
  // 25
  ['nightowl', "anyone else's brain like \"hey remember that embarrassing thing from 2014\" at exactly 1:43am every night", 84.0, null, [4,8,9,11], [11]],
  // 26
  ['paulhdraws', "commission piece done. client loved it. i hate it. as it should be.", 92.0, null, [2,4,6,9,11], []],
  // 27
  ['jasontalks', "covering the new EU device pairing rules tomorrow. spoiler: it's messier than the press release suggests.", 100.0, null, [1,5,6,10], [5,10]],
  // 28
  ['kimchi', "the airport sushi was, against all odds, fine", 108.0, null, [4,8,11], []],
  // 29
  ['lina_codes', "you can tell a senior engineer because they get excited about deleting code", 115.0, null, [1,2,3,5,6,8,9,11], [2,3,5,6,8]],
];

function seed(db) {
  const now = Date.now();
  const insertUser = db.prepare(
    'INSERT INTO users (handle, display_name, bio, avatar_hue, verified, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const userIdByHandle = new Map();
  const insertMany = db.transaction(() => {
    for (const u of USERS) {
      const info = insertUser.run(u.handle, u.display_name, u.bio, u.avatar_hue, u.verified, now - 1000 * 60 * 60 * 24 * 30);
      userIdByHandle.set(u.handle, info.lastInsertRowid);
    }

    const insertPost = db.prepare(
      'INSERT INTO posts (author_id, parent_id, body, created_at) VALUES (?, ?, ?, ?)'
    );
    const insertLike = db.prepare('INSERT OR IGNORE INTO likes (user_id, post_id, created_at) VALUES (?, ?, ?)');
    const insertRepost = db.prepare('INSERT OR IGNORE INTO reposts (user_id, post_id, created_at) VALUES (?, ?, ?)');

    const postIds = [];
    for (const [handle, body, hoursAgo, parentIdx, likers, reposters] of POSTS) {
      const authorId = userIdByHandle.get(handle);
      const parentId = parentIdx === null ? null : postIds[parentIdx];
      const createdAt = now - Math.round(hoursAgo * 60 * 60 * 1000);
      const info = insertPost.run(authorId, parentId, body, createdAt);
      postIds.push(info.lastInsertRowid);

      for (const i of likers) {
        const liker = userIdByHandle.get(USERS[i].handle);
        if (liker) insertLike.run(liker, info.lastInsertRowid, createdAt + 1000 * 60);
      }
      for (const i of reposters) {
        const rep = userIdByHandle.get(USERS[i].handle);
        if (rep) insertRepost.run(rep, info.lastInsertRowid, createdAt + 1000 * 60 * 2);
      }
    }

    // Follow graph: "you" follows everyone except kimchi and theofficial.
    const insertFollow = db.prepare('INSERT OR IGNORE INTO follows (follower_id, followee_id, created_at) VALUES (?, ?, ?)');
    const meId = userIdByHandle.get('you');
    for (const u of USERS) {
      if (u.handle === 'you') continue;
      if (u.handle === 'kimchi' || u.handle === 'theofficial') continue;
      insertFollow.run(meId, userIdByHandle.get(u.handle), now - 1000 * 60 * 60 * 24 * 14);
    }
    // Build a believable web of follows.
    const webOfFollows = [
      ['kasey', 'lina_codes'], ['kasey', 'roshi'], ['kasey', 'devops_dani'], ['kasey', 'mira'],
      ['lina_codes', 'mira'], ['lina_codes', 'kasey'], ['lina_codes', 'jasontalks'],
      ['paulhdraws', 'mira'], ['paulhdraws', 'em_writes'], ['paulhdraws', 'nightowl'],
      ['nightowl', 'em_writes'], ['nightowl', 'kimchi'], ['nightowl', 'roshi'],
      ['devops_dani', 'kasey'], ['devops_dani', 'jasontalks'],
      ['mira', 'lina_codes'], ['mira', 'paulhdraws'], ['mira', 'em_writes'],
      ['jasontalks', 'theofficial'], ['jasontalks', 'devops_dani'], ['jasontalks', 'kasey'],
      ['roshi', 'kasey'], ['roshi', 'lina_codes'], ['roshi', 'nightowl'],
      ['em_writes', 'paulhdraws'], ['em_writes', 'mira'], ['em_writes', 'nightowl'],
      ['theofficial', 'jasontalks'], ['theofficial', 'kasey'],
      ['kimchi', 'nightowl'], ['kimchi', 'paulhdraws'],
    ];
    for (const [a, b] of webOfFollows) {
      insertFollow.run(userIdByHandle.get(a), userIdByHandle.get(b), now - 1000 * 60 * 60 * 24 * 10);
    }
  });
  insertMany();
  console.log(`seeded ${USERS.length} users and ${POSTS.length} posts`);
}

if (require.main === module) {
  console.error('Run via `npm start` instead. The server seeds on boot.');
  process.exit(1);
}

module.exports = seed;
