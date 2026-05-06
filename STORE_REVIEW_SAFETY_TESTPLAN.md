# Store Review Safety Test Plan (Report + Block)

## Scope

This protocol verifies that community safety controls are enforced for:
- reporting users/content
- blocking users
- private thread messaging authorization

Run all checks with two real test accounts:
- **Account A** (reporter / blocker)
- **Account B** (reported / blocked)

---

## Preconditions

1. Deploy backend and rules:
   - `firebase deploy --only firestore:rules,functions`
2. Ensure mobile app build uses current backend.
3. On both test devices:
   - clean app start
   - community consent accepted
   - each account can open community and private chat

---

## Test 1: Report from private thread menu

### Steps
1. Account A opens private thread with Account B.
2. Open thread menu (`⋮`).
3. Tap `Report`.

### Expected
- Success confirmation is shown in app.
- New document is created in `reports` with:
  - `type = "private_thread_user_report"`
  - `reporterUid = A`
  - `reportedUid = B`
  - `threadId` present
  - `createdAt` present

---

## Test 2: Report from community feed actions

### Steps
1. Account B creates a public post.
2. Account A opens community feed.
3. On B's post, tap `Report` and select reason.

### Expected
- Success confirmation in app.
- New document in `reports` with:
  - `type = "community_post_report"`
  - `reporterUid = A`
  - `reportedUid = B`
  - `postId` present
  - `reason` present
  - `createdAt` present

---

## Test 3: Block from private thread

### Steps
1. Account A opens private thread with Account B.
2. Open thread menu (`⋮`), tap `Block`.
3. Account B tries to send message to Account A.

### Expected
- A sees blocked info UI.
- Backend rejects blocked delivery (`blocked_by_peer` path).
- B receives send error/info instead of successful delivery.
- New blocked relationship exists in:
  - local `blocked_uids` on A
  - `community_users/{A}.blockedUids` contains B (if rules permit write)

---

## Test 4: Block from Endyia Chat header menu

### Steps
1. Account A opens Endyia Chat list.
2. Open header burger menu.
3. Tap `Block` (or `Unblock` if already blocked).

### Expected
- Action toggles block state for selected chat peer.
- Feed/chat visibility updates accordingly.
- Firestore `community_users/{A}.blockedUids` matches action.

---

## Test 5: Authorization hardening (negative tests)

### Steps
1. Try sending to thread where current user is not participant (simulated or QA tool).
2. Try creating report with forged `reporterUid` not equal to current auth uid.
3. Try direct client write to another user's `community_users/{uid}`.

### Expected
- All requests are denied by rules/function auth checks.
- No unauthorized write appears in Firestore.

---

## Test 6: Unblock flow

### Steps
1. Account A unblocks Account B.
2. Account B sends new message in same private thread.

### Expected
- Message delivery succeeds.
- `community_users/{A}.blockedUids` no longer contains B.
- App no longer shows blocked state.

---

## Evidence to attach for App Store review

1. Screenshot of menu entries showing `Report` + `Block`.
2. Screenshot/video of blocked send attempt (and rejection behavior).
3. Firestore screenshots of:
   - `reports` entry
   - `community_users/{uid}.blockedUids` before/after unblock
4. Brief note in privacy/terms that report and block data are processed for safety moderation.

---

## Pass criteria

Release is safety-ready when:
- all report actions create immutable server-side records
- block status is enforced during message send on backend
- unauthorized writes are denied by Firestore rules
- unblock restores communication as expected
