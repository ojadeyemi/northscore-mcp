/**
 * Leaderboard service - Fetch player leaderboards from Northscore API
 */

import type { GenericPlayerLeaderboard } from '../types/games.js';
import type { LeaderboardQueryParams } from '../types/params.js';
import type { LeagueSystem, SimpleLeague } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildLeaderboardEndpoint } from './api/endpoints.js';
import { normalizeLeaderboard } from './api/normalizers.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Leagues that support PER_GAME mode by default
 */
const PER_GAME_LEAGUES: readonly SimpleLeague[] = ['cebl'];

/**
 * Fetch player leaderboard from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param params - Optional query parameters
 * @returns Array of player leaderboard entries (normalized from dict)
 */
export default async function fetchLeaderboard(
  leagueSystem: LeagueSystem,
  params?: LeaderboardQueryParams,
): Promise<GenericPlayerLeaderboard[]> {
  if (params?.team_name) {
    validateTeamForLeague(leagueSystem, params.team_name);
  }
  const endpoint = buildLeaderboardEndpoint(leagueSystem);
  const queryParams: Record<string, string | number> = {};

  // Apply smart defaults for mode
  if (params?.mode) {
    queryParams.mode = params.mode;
  } else if (
    PER_GAME_LEAGUES.includes(leagueSystem as SimpleLeague) ||
    leagueSystem.startsWith('usports_')
  ) {
    // Default to PER_GAME for CEBL and USports
    queryParams.mode = 'PER_GAME';
  }

  // Add other optional parameters
  if (params?.team_name) queryParams.team_name = normalizeTeamName(leagueSystem, params.team_name);
  if (params?.competition) queryParams.competition = params.competition;
  if (params?.segment) queryParams.segment = params.segment;
  if (params?.limit) queryParams.limit = params.limit;
  if (params?.team_id) queryParams.team_id = String(params.team_id);
  if (params?.conference) queryParams.conference = params.conference;
  if (params?.season_option) queryParams.season_option = params.season_option;

  const data = await fetchData<
    | Record<string, GenericPlayerLeaderboard[]>
    | Record<string, Record<string, GenericPlayerLeaderboard[]>>
  >(endpoint, queryParams);

  // Normalize response and optionally filter by stat type
  // Note: stat_type is not a query param, but used for client-side filtering
  return normalizeLeaderboard(data, undefined);
}
