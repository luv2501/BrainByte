export const APP_TIMEZONE = process.env.APP_TIMEZONE || "Asia/Kolkata";

/**
 * Returns a calendar day string "YYYY-MM-DD" for a given Date in the configured timezone.
 *
 * @param {Date|string|number} date
 * @param {string} [timeZone=APP_TIMEZONE]
 * @returns {string} e.g. "2026-10-11"
 */
export const getDayKey = (date, timeZone = APP_TIMEZONE) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;

  // Use Intl.DateTimeFormat to reliably extract year, month, and day in the target timeZone
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return formatter.format(d); // "en-CA" formats as YYYY-MM-DD
};

/**
 * Calculates calendar day difference (dayKey2 - dayKey1).
 * Both keys are in "YYYY-MM-DD" format.
 *
 * @param {string} dayKey1
 * @param {string} dayKey2
 * @returns {number}
 */
export const getDayDifference = (dayKey1, dayKey2) => {
  if (!dayKey1 || !dayKey2) return null;
  // Parse UTC dates using YYYY-MM-DD to avoid DST skew
  const [y1, m1, d1] = dayKey1.split("-").map(Number);
  const [y2, m2, d2] = dayKey2.split("-").map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  const MS_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round((utc2 - utc1) / MS_PER_DAY);
};

/**
 * Returns the effective streak for a user.
 * If the user's last solved day is older than yesterday, the streak is broken and returns 0.
 * If user has no lastSolvedDate, returns 0.
 *
 * Also persists the reset to the database if user.save exists and streak changed.
 *
 * @param {object} user - Mongoose User document or plain object
 * @param {Date} [referenceDate=new Date()]
 * @param {string} [timeZone=APP_TIMEZONE]
 * @returns {Promise<number>|number}
 */
export const syncAndGetEffectiveStreak = async (user, referenceDate = new Date(), timeZone = APP_TIMEZONE) => {
  if (!user) return 0;

  const currentStreak = user.streak || 0;
  if (!user.lastSolvedDate) {
    if (currentStreak !== 0) {
      user.streak = 0;
      if (typeof user.save === "function") {
        await user.save();
      }
    }
    return 0;
  }

  const todayKey = getDayKey(referenceDate, timeZone);
  const lastKey = getDayKey(user.lastSolvedDate, timeZone);
  const diff = getDayDifference(lastKey, todayKey);

  // If last solved day was today (diff === 0) or yesterday (diff === 1), streak is intact.
  // If diff >= 2, streak is broken.
  if (diff >= 2) {
    if (user.streak !== 0) {
      user.streak = 0;
      if (typeof user.save === "function") {
        await user.save();
      }
    }
    return 0;
  }

  return user.streak || 0;
};

/**
 * Synchronous version to evaluate effective streak without DB save.
 * Useful for pure logic checks or when persistence is handled separately.
 */
export const getEffectiveStreak = (user, referenceDate = new Date(), timeZone = APP_TIMEZONE) => {
  if (!user || !user.lastSolvedDate) return 0;

  const todayKey = getDayKey(referenceDate, timeZone);
  const lastKey = getDayKey(user.lastSolvedDate, timeZone);
  const diff = getDayDifference(lastKey, todayKey);

  if (diff >= 2) {
    return 0;
  }

  return user.streak || 0;
};

/**
 * Calculates updated streak when a user achieves an Accepted solve.
 *
 * Rules:
 * - If lastSolvedDate is null: streak = 1.
 * - If last solved day is today (diff === 0): do nothing (streak already counted today).
 * - If last solved day is yesterday (diff === 1): streak += 1.
 * - If gap is 2 or more days (diff >= 2): streak = 1 (reset, then count today).
 * - Updates longestStreak = max(longestStreak, streak).
 * - Sets lastSolvedDate = now.
 *
 * @param {object} user - Mongoose User document
 * @param {Date} [now=new Date()]
 * @param {string} [timeZone=APP_TIMEZONE]
 * @returns {{ streak: number, longestStreak: number, streakIncreased: boolean }}
 */
export const recordAcceptedSolveStreak = (user, now = new Date(), timeZone = APP_TIMEZONE) => {
  const todayKey = getDayKey(now, timeZone);
  const lastKey = user.lastSolvedDate ? getDayKey(user.lastSolvedDate, timeZone) : null;

  let streakIncreased = false;

  if (!lastKey) {
    // First solve or existing user without lastSolvedDate
    user.streak = 1;
    streakIncreased = true;
  } else {
    const diff = getDayDifference(lastKey, todayKey);

    if (diff === 0) {
      // Same calendar day: do not increment
      streakIncreased = false;
    } else if (diff === 1) {
      // Consecutive day: increment streak
      user.streak = (user.streak || 0) + 1;
      streakIncreased = true;
    } else {
      // 2 or more days gap: reset to 1
      user.streak = 1;
      streakIncreased = true;
    }
  }

  user.lastSolvedDate = now;
  user.longestStreak = Math.max(user.longestStreak || 0, user.streak || 0);

  return {
    streak: user.streak,
    longestStreak: user.longestStreak,
    streakIncreased,
  };
};
