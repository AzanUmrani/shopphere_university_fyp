1. Treasure Garden — “Grow-to-Get” collection + mini-games
   Concept & hook: Players plant animated seeds that grow into collectible “product-flower” items. Growth needs small interactions (tap-to-water, mini-match puzzle) and finishes with a reward (discount, limited coupon). Social features: visitors can leave boosts; referrals give premium seeds. The visual, progressive growth + scarcity (rare seeds) creates completion drive.

Core loop

Plant a seed (free daily seed or purchased/earned premium seed).

Perform daily interaction (water, clear a 30-sec mini-puzzle) to speed growth.

Harvest for rewards (points, coupon).

Use rewards in store or trade for better seeds.

Retention & referrals

Daily login seeds + increasing streak multiplier.

Time-limited plants (seasonal seeds).

Invite friend → both get a “booster watering” and a premium seed.

Visitor actions: each friend visit adds a watering point (max cap).

Push notifications: “Your rose is about to bloom — tap to finish!”

Reward mapping

Common flower = 20 points (0.5% off voucher conversion).

Rare flower = 100 points + 10% off coupon.

Harvest milestone = guaranteed free-shipping coupon.

AI UI prompt (for image + UI kit)

"Create a friendly, colorful mobile-first ecommerce game UI: a sunny garden scene with simple 2D vector art, rounded buttons, soft shadows, and a sidebar showing 'Energy', 'Seeds', 'Streak'. Show a seed packet card, growth progress bar, an animated watering action icon, and a popup reward card at harvest. Style: modern flat vector, friendly, playful. Color palette: mint green, warm yellow, coral, soft blue. Include small badges for 'rare' and 'limited'."

Frontend components / wireframe

GardenCanvas (SVG / Canvas with plants, click interactions)

SeedCardList (catalog of seeds)

DailyActionPanel (water, mini-game button)

HarvestModal (shows reward & CTA to use coupon)

SocialInviteModal (share/referral)

Backend endpoints (examples)

POST /api/games/garden/plant { userId, seedId } → 201 plantId, startTime

POST /api/games/garden/action { userId, plantId, actionType } → progress delta

POST /api/games/garden/harvest { userId, plantId } → reward object

GET /api/games/garden/status?userId= → list of plants + timers

DB schema (simplified)

users (id, email, points, coupons[])

plants (id, userId, seedId, startAt, progress, status)

seeds (seedId, rarity, baseTime, premium:boolean)

actions (id, plantId, type, timestamp)

Anti-fraud

Rate-limit actions per user/IP.

Verify client timestamps with server time — server computes progress.

Flag rapid harvesting or repeated identical actions across accounts.

Use CAPTCHA for referrals over a threshold.

Metrics

Daily Active Users (DAU), retention (D1/D7/D30)

Conversion: players → purchasers, vouchers used

Average play time per session, invite acceptance rate

2. Coin Cascade — “Skill + Luck” coin pusher puzzle
   Concept & hook: A vertical board where users drop virtual coins; physics cause coins to push others into reward slots. Make it feel tactile with satisfying sounds/animations. Provide skill elements: angle boosters, slow-time, bumpers. Each play costs energy (recharges/free/earned). Very addictive — players watch coins cascade and chase big wins.

Core loop

Spend 1 energy to drop N coins.

Watch cascade; coins falling into slots yield points/vouchers or tokens.

Use tokens to buy power-ups or enter mini jackpots.

Leaderboard/challenges encourage replays to beat friends.

Retention & referrals

Energy refill over time + daily free drops.

Referral = extra energy + 1 premium coin.

Tournaments: weekly coin push leaderboard for exclusive coupons.

Reward mapping

Slot A (common) = 5 points; Slot B (rare) = 50 points; Jackpot slot = big coupon.

Salvage mechanics: convert leftover coins to small discount.

AI UI prompt

"Design a vertical 'coin cascade' mobile UI: realistic but stylized 2D coins, soft physics blur, wood panel background, three reward slots at bottom with glowing effects. Controls: 'Drop' button, power-up tray (magnet, slow-time), energy indicator at top, leaderboard badge. Style: premium toy-like, high-contrast highlights."

Frontend components

CascadeCanvas (2D physics — matter.js or planck.js)

DropControl (drag to set drop point)

PowerupBar (use tokens)

SlotsPanel (animated reward slots)

Backend endpoints

POST /api/game/coin/drop {userId, dropX, powerUpsUsed} → server sim? Or deterministic result ID.

GET /api/game/coin/state?userId → energy, tokens, leaderboard

POST /api/game/coin/claim {userId, roundId} → awards applied

Implementation note: For fairness and anti-cheat, either run physics server-side (costly) or use server-seeded deterministic outcome: client provides move; server computes result using seeded PRNG validated server-side.

DB schema

rounds (id, userId, seed, result, timestamp)

tokens (userId, count)

powerups (userId, inventory)

Anti-fraud

Use server-side determinism: seed = hash(userId + roundStart + serverSalt). Client shows physics but server validates.

Limit concurrent rounds per account.

Monitor improbable streaks and soft-ban.

Metrics

Avg rounds per user, token purchase rate, conversion after win

3. ForgeMatch — pattern forging mini-game (unique twist)
   Concept & hook: Players “forge” a product component by matching pattern sequences (like match-3 + rhythm). Each successful forge yields a limited edition “crafted coupon” that has collectible art. The uniqueness comes from combining time-based matching and recipe discovery — players experiment to find rare recipes.

Core loop

Choose a recipe (or auto-suggest).

Play a 45-second matching run; combos increase quality.

Resulting item quality determines reward.

Recipe discovery (random drops) increases curiosity/collection.

Retention & referrals

Daily “blueprint” gifts.

Allow trading of duplicate crafted coupons among friends (or send as gift).

Referral → instant blueprint + a one-time quality boost.

Reward mapping

Quality tiers → percent-off coupons, free add-on, or loyalty points.

AI UI prompt

"Create a clean compact UI for a 'forging' mini-game: a central match-grid with glowing tiles, a side 'recipe' card showing required patterns, a progress/quality meter, and celebratory confetti when forging succeeds. Style: semi-flat, metallic accents, clear microinteractions."

API endpoints

POST /api/game/forge/start {userId, recipeId} → sessionId, seed

POST /api/game/forge/action {sessionId, action} → combo, score

POST /api/game/forge/finish {sessionId} → reward

DB schema

forge_sessions (id, userId, status, score, quality)

blueprints (id, rarity, description)

Anti-fraud

All scoring validated on server, or server-provide seeds that determine tile layout.

Metrics

Blueprints collected, avg session score, conversion after rare rewards

4. MapSwipe — “Voucher Treasure Hunt” (grid exploration)
   Concept & hook: A map/grid of tiles; players reveal tiles to find rewards, traps, or story hints. Each reveal costs a reveal token; neighboring reveals sometimes give combos. Add seasonal maps and team events. The exploration element plus unpredictability keeps them hooked.

Core loop

Start a map (free small map or premium large map).

Reveal tiles — some reveal instant coupons, some spawn mini-puzzles to unlock bigger chests.

Close the map or finish to collect haul.

Retention & referrals

Share map progress with friends — friend reveals one tile for you, you get a bonus.

Map streaks: complete daily micro-maps for increasing rewards.

Reward mapping

Hidden chests -> discount tier, instant product bundle, mystery box coupon.

AI UI prompt

"Design an engaging 'treasure map' UI: parchment-style grid, stamped tiles, magnifying-glass cursor, chest popups, mini-map progress ring, inviting call-to-action 'Reveal'. Color palette: warm browns, teal highlights; icons: chest, trap, key, gem."

API endpoints

POST /api/game/map/reveal {userId, mapId, x, y} → tile result

GET /api/game/map/status?userId → active maps

DB schema

maps (mapId, userId, layoutSeed, claimedTiles[])

tiles (mapId, x, y, result)

Anti-fraud

server-seeded layouts, reveal counts per minute caps

Metrics

reveal-to-reward ratio, referral conversion

5. Storyline Stamps — progressive narrative + collectible stamps
   Concept & hook: Players progress through a short episodic story where choices unlock collectible "stamps" (art that also acts as vouchers). FOMO: limited-time episodes and stamp variants. This is more narrative-driven and emotionally engaging.

Core loop

Start episode (5–7 short choice screens).

Choices lead to branches and mini-challenges.

Finish to receive stamps and unlock next episode.

Retention & referrals

Bring friends to unlock co-op story endings or get a joint stamp.

Episode pass subscription for weekly episodes.

Reward mapping

Each stamp = loyalty points; completing a full set = high-value coupon.

AI UI prompt

"Create a readable mobile story UI: full-screen illustrated panels, choice buttons at bottom, progress stamps strip at top, collectible stamp gallery modal. Style: illustrated panels, warm mood, clean typography."

API endpoints

POST /api/game/story/start {userId, episodeId}

POST /api/game/story/choice {userId, sessionId, choiceId} → nextNode

POST /api/game/story/complete {userId, sessionId} → awards

DB schema

story_sessions (id, userId, episodeId, choicesMade, completed)

stamps (userId, stampId, acquiredAt)

Anti-fraud

single-completion receipts, IP checks if mass-claiming

Metrics

episodes completed, stamps collected, subscription conversion

Implementation notes — tech & scale (short)
React: use functional components + hooks; persist local game state with Redux or Zustand. For physics games use matter-js (client) + deterministic server seed.

Express: endpoints for actions, auth via JWT + refresh tokens. Validate every game action server-side.

DB: PostgreSQL for relational data (users, plants, rounds), Redis for ephemeral state (energy timers, leaderboards).

Realtime: Socket.io for live leaderboards/events if needed.

Assets: vector SVGs for small size; animated Lottie for micro-interactions.

Testing: UX A/B test reward frequencies and energy costs.

Security: server authoritative on rewards and seeds; require verification for coupon redemption (one-time code).

Scalability: shard leaderboards, cache heavy API returns; pre-generate map seeds.

Example: Minimal Express route + payload (Treasure Garden harvest)
js
Copy
Edit
// POST /api/games/garden/harvest
// Request body:
{
"userId": "u_123",
"plantId": "p_987"
}
// Response:
{
"success": true,
"reward": {
"type": "coupon",
"couponCode": "GROW10",
"discountPercent": 10,
"expiresAt": "2025-09-10T23:59:59Z"
},
"pointsEarned": 50,
"plantStatus": "harvested"
}
Server computes pointsEarned based on plant.seed.rarity + actions logged. Validate plant.owner === userId and plant.status === 'ready'.

Sample AI prompt for full-screen harvest reward card (for your AI generator)
"Create a 640x480 mobile harvest reward card for an ecommerce game: central golden flower illustration with sparkles, top label 'Harvest!' in playful rounded type, a large coupon badge '10% OFF', below small text 'Use on next purchase. Expires Sep 10, 2025.' Include two buttons 'Use Now' (primary) and 'Save' (secondary). Art style: flat vector, high contrast, friendly."
