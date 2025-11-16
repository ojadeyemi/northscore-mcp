/**
 * Northscore API Services
 * Centralized exports for all service modules
 */

// Core API utilities
export { fetchData, NorthScoreApiClientError, ValidationError } from './api/client.js';
export {
  parseLeagueSystem,
  buildGamesEndpoint,
  buildStandingsEndpoint,
  buildLeaderboardEndpoint,
  buildTeamStatsEndpoint,
  buildTeamInfoEndpoint,
  buildTeamRosterEndpoint,
  buildTeamComparisonEndpoint,
} from './api/endpoints.js';
export { normalizeStandings, normalizeLeaderboard, normalizeTeamStats } from './api/normalizers.js';

// Validation utilities
export {
  validateTeamForLeague,
  normalizeTeamName,
  isValidTeamName,
  isValidLeagueSystem,
} from '../utils/validation.js';

// Service functions
export { default as fetchGames } from './games.js';
export { default as fetchStandings } from './standings.js';
export { default as fetchLeaderboard } from './leaderboard.js';
export { default as fetchTeamStats } from './team-stats.js';
export { default as fetchTeamInfo } from './team-info.js';
export { default as fetchTeamRoster } from './team-roster.js';
export { default as fetchTeamComparison } from './team-comparison.js';
