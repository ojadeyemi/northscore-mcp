/**
 * Centralized type exports
 */

// API response types
export type { StandardResponse, ApiError } from './api.js';
export { isApiError } from './api.js';

// Game and league types
export type {
  GenericGame,
  GenericStandings,
  GenericPlayerLeaderboard,
  GenericTeamStat,
  GenericTeamInfo,
  PlayerProfile,
  TeamScore,
  NorthScoreApiError,
} from './games.js';

export { GameStatus, GameCompetition, USportsSport, USportsLeague } from './games.js';

// Team name types
export type {
  CEBLTeamName,
  CFLTeamName,
  CPLTeamName,
  HoopQueensTeamName,
  USportsSchoolName,
  OCAASchoolName,
  AnyTeamName,
} from './teams.js';

// League system types
export type {
  LeagueSystem,
  SimpleLeague,
  USportsLeagueSystem,
  OCAALeagueSystem,
} from './leagues.js';

// Stat types
export type { BasketballStatType } from './stats.js';

// Query parameter types
export type {
  CompetitionType,
  ModeType,
  ConferenceType,
  PlayerSegmentType,
  TeamSegmentType,
  SeasonOptionType,
  GamesQueryParams,
  LeaderboardQueryParams,
  TeamStatsQueryParams,
  TeamRosterQueryParams,
  TeamComparisonQueryParams,
} from './params.js';

// Additional response types
export type {
  GenericRosterPlayer,
  GenericTeamRoster,
  GenericTeamComparison,
  CollegeTeamComparison,
  CollegeRadarCategories,
  CollegeRadarData,
  CollegeLeagueAverages,
  RadarMetricMetadata,
  ValidationErrorDetail,
} from './responses.js';
