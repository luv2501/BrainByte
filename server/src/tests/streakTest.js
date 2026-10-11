import assert from "assert";
import {
  getDayKey,
  getDayDifference,
  recordAcceptedSolveStreak,
  getEffectiveStreak,
  syncAndGetEffectiveStreak,
  APP_TIMEZONE,
} from "../utils/streak.js";

async function runStreakTests() {
  console.log("--------------------------------------------------");
  console.log("Running Streak Unit Tests (Timezone:", APP_TIMEZONE, ")");
  console.log("--------------------------------------------------");

  // Test 1: Day key generation and day difference
  console.log("\n[Test 1] Calendar Day Key & Difference Calculation");
  const day1 = getDayKey(new Date("2026-10-10T10:00:00Z"));
  const day2 = getDayKey(new Date("2026-10-11T10:00:00Z"));
  const diff = getDayDifference(day1, day2);
  assert.strictEqual(diff, 1, "Difference between consecutive days should be 1");
  console.log("✓ Day keys:", { day1, day2, diff });

  // Test 2: First solve (lastSolvedDate is null)
  console.log("\n[Test 2] First Solve (lastSolvedDate = null)");
  let user = {
    streak: 0,
    longestStreak: 0,
    lastSolvedDate: null,
  };
  const t1 = new Date("2026-10-11T09:00:00Z");
  recordAcceptedSolveStreak(user, t1);
  assert.strictEqual(user.streak, 1, "First solve should set streak to 1");
  assert.strictEqual(user.longestStreak, 1, "longestStreak should be 1");
  assert.strictEqual(user.lastSolvedDate, t1);
  console.log("✓ Result:", { streak: user.streak, longestStreak: user.longestStreak });

  // Test 3: Same-day second solve
  console.log("\n[Test 3] Same-Day Second Solve (diff = 0)");
  const t2 = new Date("2026-10-11T15:30:00Z");
  const resSameDay = recordAcceptedSolveStreak(user, t2);
  assert.strictEqual(user.streak, 1, "Same-day solve should not increment streak");
  assert.strictEqual(user.longestStreak, 1, "longestStreak should remain 1");
  assert.strictEqual(resSameDay.streakIncreased, false);
  console.log("✓ Result:", { streak: user.streak, streakIncreased: resSameDay.streakIncreased });

  // Test 4: Next-day solve (consecutive day, diff = 1)
  console.log("\n[Test 4] Next-Day Solve (diff = 1)");
  const t3 = new Date("2026-10-12T08:00:00Z");
  const resNextDay = recordAcceptedSolveStreak(user, t3);
  assert.strictEqual(user.streak, 2, "Consecutive day solve should increment streak to 2");
  assert.strictEqual(user.longestStreak, 2, "longestStreak should update to 2");
  assert.strictEqual(resNextDay.streakIncreased, true);
  console.log("✓ Result:", { streak: user.streak, longestStreak: user.longestStreak });

  // Test 5: Next-day solve again (diff = 1) -> streak 3
  console.log("\n[Test 5] Consecutive Day 3 Solve (diff = 1)");
  const t4 = new Date("2026-10-13T11:00:00Z");
  recordAcceptedSolveStreak(user, t4);
  assert.strictEqual(user.streak, 3, "Day 3 solve should increment streak to 3");
  assert.strictEqual(user.longestStreak, 3, "longestStreak should update to 3");
  console.log("✓ Result:", { streak: user.streak, longestStreak: user.longestStreak });

  // Test 6: Gap of 2+ days (diff >= 2) -> reset to 1, longestStreak preserved
  console.log("\n[Test 6] Solve after 2+ Days Gap (Reset and count today)");
  const t5 = new Date("2026-10-16T10:00:00Z"); // Missed Oct 14 & 15 (diff = 3)
  recordAcceptedSolveStreak(user, t5);
  assert.strictEqual(user.streak, 1, "Streak should reset to 1 after missing days");
  assert.strictEqual(user.longestStreak, 3, "longestStreak should be preserved at 3");
  console.log("✓ Result:", { streak: user.streak, longestStreak: user.longestStreak });

  // Test 7: Read-time effective streak check
  console.log("\n[Test 7] Read-Time Effective Streak Check");
  // If user solved on 2026-10-16, on 2026-10-17 (next day) streak is still active (1)
  const readNextDay = new Date("2026-10-17T12:00:00Z");
  let effStreak1 = getEffectiveStreak(user, readNextDay);
  assert.strictEqual(effStreak1, 1, "On next day without a solve yet, streak is still 1");
  console.log("✓ Read next day (2026-10-17):", effStreak1);

  // On 2026-10-18 (2 days later with no solve), streak should be 0
  const readTwoDaysLater = new Date("2026-10-18T12:00:00Z");
  let effStreak2 = getEffectiveStreak(user, readTwoDaysLater);
  assert.strictEqual(effStreak2, 0, "2 days later without solve, effective streak must be 0");
  console.log("✓ Read 2 days later (2026-10-18):", effStreak2);

  // Test 8: Read-time sync & persist reset
  console.log("\n[Test 8] Read-time Persistence on Reset");
  let saved = false;
  const mockUserDoc = {
    streak: 2,
    longestStreak: 2,
    lastSolvedDate: new Date("2026-10-10T10:00:00Z"),
    save: async function () {
      saved = true;
    },
  };
  const readDate = new Date("2026-10-13T10:00:00Z"); // 3 days gap
  const syncedStreak = await syncAndGetEffectiveStreak(mockUserDoc, readDate);
  assert.strictEqual(syncedStreak, 0, "Streak should return 0");
  assert.strictEqual(mockUserDoc.streak, 0, "mockUserDoc.streak should be persisted to 0");
  assert.strictEqual(saved, true, "user.save() should have been called");
  console.log("✓ Synced streak:", syncedStreak, "Saved to DB:", saved);

  // Test 9: Existing user with streak=2 but null lastSolvedDate
  console.log("\n[Test 9] Existing user with streak=2 and null lastSolvedDate");
  let legacyUser = {
    streak: 2,
    longestStreak: 2,
    lastSolvedDate: null,
    save: async function () {
      saved = true;
    },
  };
  const legacyEffective = await syncAndGetEffectiveStreak(legacyUser);
  assert.strictEqual(legacyEffective, 0, "Legacy user without lastSolvedDate has effective streak 0");
  assert.strictEqual(legacyUser.streak, 0, "Legacy user streak is reset to 0");

  // When they solve today:
  recordAcceptedSolveStreak(legacyUser, new Date());
  assert.strictEqual(legacyUser.streak, 1, "Legacy user's first new solve correctly becomes streak 1");
  console.log("✓ Legacy user handled gracefully:", { streak: legacyUser.streak });

  console.log("\n==================================================");
  console.log("ALL 9 STREAK LOGIC TESTS PASSED!");
  console.log("==================================================");
}

runStreakTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
