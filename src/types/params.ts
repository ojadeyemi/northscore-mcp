/**
 * Query parameter types for Northscore API endpoints
 */

/**
 * Competition type for CEBL
 */
export type CompetitionType = 'REGULAR' | 'FINALS';

/**
 * Mode type for stat endpoints (CEBL, USports)
 */
export type ModeType = 'PER_GAME' | 'TOTALS';

/**
 * Conference type for USports
 */
export type ConferenceType = 'EAST' | 'WEST';

/**
 * Player segment type for CEBL
 */
export type PlayerSegmentType = 'EAST' | 'WEST' | 'HOME' | 'AWAY';

/**
 * Team segment type for CEBL
 */
export type TeamSegmentType =
  | 'HOME'
  | 'AWAY'
  | 'L7D'
  | 'L5G'
  | 'L10G'
  | 'MAY'
  | 'JUNE'
  | 'JULY'
  | 'AUGUST';

/**
 * Season option for USports
 */
export type SeasonOptionType = string; // e.g., '2023-2024'

/**
 * Common query parameters for games endpoint
 */
export interface GamesQueryParams {
  team_name?: string;
}

/**
 * Query parameters for leaderboard endpoint
 */
export interface LeaderboardQueryParams {
  mode?: ModeType;
  team_name?: string;
  competition?: CompetitionType;
  segment?: PlayerSegmentType;
  limit?: number;
  team_id?: string | number;
  conference?: ConferenceType;
  season_option?: SeasonOptionType;
}

/**
 * Query parameters for team statistics endpoint
 */
export interface TeamStatsQueryParams {
  mode?: ModeType;
  team_name?: string;
  competition?: CompetitionType;
  segment?: TeamSegmentType;
  conference?: ConferenceType;
  season_option?: SeasonOptionType;
}

/**
 * Query parameters for team roster endpoint
 */
export interface TeamRosterQueryParams {
  mode?: ModeType;
  season_option?: SeasonOptionType;
}

/**
 * Query parameters for team comparison endpoint
 */
export interface TeamComparisonQueryParams {
  team1: string;
  team2: string;
  mode?: ModeType;
  competition?: CompetitionType;
  segment?: TeamSegmentType;
  season_option?: SeasonOptionType;
}
