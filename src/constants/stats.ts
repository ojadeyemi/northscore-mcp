/**
 * Stat type constants for different sports
 * Used for leaderboard filtering and validation
 */

/**
 * Basketball stat types (CEBL, U SPORTS Basketball, OCAA Basketball, Hoop Queens)
 */
export const BASKETBALL_STAT_TYPES = [
  'POINTS',
  'POINTS_PER_GAME',
  'REBOUNDS',
  'REBOUNDS_PER_GAME',
  'ASSISTS',
  'ASSISTS_PER_GAME',
  'STEALS',
  'STEALS_PER_GAME',
  'BLOCKS',
  'BLOCKS_PER_GAME',
  'FIELD_GOAL_PERCENTAGE',
  'THREE_POINT_PERCENTAGE',
  'FREE_THROW_PERCENTAGE',
  'TURNOVERS',
  'TURNOVERS_PER_GAME',
  'MINUTES',
  'MINUTES_PER_GAME',
] as const;

/**
 * Common basketball stats (most frequently used)
 */
export const COMMON_BASKETBALL_STATS = [
  'POINTS',
  'REBOUNDS',
  'ASSISTS',
  'STEALS',
  'BLOCKS',
  'FIELD_GOAL_PERCENTAGE',
  'THREE_POINT_PERCENTAGE',
  'FREE_THROW_PERCENTAGE',
] as const;

/**
 * TODO: Add stat types for other sports:
 * - Football (CFL, U SPORTS Football)
 * - Soccer (CPL, U SPORTS Soccer)
 * - Hockey (CHL, U SPORTS Hockey)
 * - Volleyball (U SPORTS Volleyball, OCAA Volleyball)
 *
 * Example format:
 * export const FOOTBALL_STAT_TYPES = [...] as const;
 * export const SOCCER_STAT_TYPES = [...] as const;
 * export const HOCKEY_STAT_TYPES = [...] as const;
 * export const VOLLEYBALL_STAT_TYPES = [...] as const;
 */
