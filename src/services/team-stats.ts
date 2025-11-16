/**
 * Team statistics service - Fetch team stats from Northscore API
 */

import type { GenericTeamStat } from '../types/games.js';
import type { TeamStatsQueryParams } from '../types/params.js';
import type { LeagueSystem, SimpleLeague } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildTeamStatsEndpoint } from './api/endpoints.js';
import { normalizeTeamStats } from './api/normalizers.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Leagues that support PER_GAME mode by default
 */
const PER_GAME_LEAGUES: readonly SimpleLeague[] = ['cebl'];

/**
 * Fetch team statistics from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param params - Query parameters (team_name required for single team)
 * @returns Single team stat or array of team stats
 */
export default async function fetchTeamStats(
  leagueSystem: LeagueSystem,
  params?: TeamStatsQueryParams,
): Promise<GenericTeamStat | GenericTeamStat[]> {
  if (params?.team_name) {
    validateTeamForLeague(leagueSystem, params.team_name);
  }
  const endpoint = buildTeamStatsEndpoint(leagueSystem);
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
  if (params?.conference) queryParams.conference = params.conference;
  if (params?.season_option) queryParams.season_option = params.season_option;

  const data = await fetchData<GenericTeamStat[] | GenericTeamStat>(endpoint, queryParams);

  // Normalize response (extract single item if team_name was provided)
  return normalizeTeamStats(data, params?.team_name);
}
