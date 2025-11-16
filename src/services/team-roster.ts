/**
 * Team roster service - Fetch team rosters from Northscore API
 */

import type { GenericTeamRoster } from '../types/responses.js';
import type { TeamRosterQueryParams } from '../types/params.js';
import type { LeagueSystem, SimpleLeague } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildTeamRosterEndpoint } from './api/endpoints.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Leagues that support PER_GAME mode by default
 */
const PER_GAME_LEAGUES: readonly SimpleLeague[] = ['cebl'];

/**
 * Fetch team roster from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param teamName - Team name (required, path parameter)
 * @param params - Optional query parameters
 * @returns Team roster with player list
 */
export default async function fetchTeamRoster(
  leagueSystem: LeagueSystem,
  teamName: string,
  params?: TeamRosterQueryParams,
): Promise<GenericTeamRoster> {
  validateTeamForLeague(leagueSystem, teamName);
  const normalizedTeamName = normalizeTeamName(leagueSystem, teamName);
  const endpoint = buildTeamRosterEndpoint(leagueSystem, normalizedTeamName);
  const queryParams: Record<string, string> = {};

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
  if (params?.season_option) {
    queryParams.season_option = params.season_option;
  }

  const data = await fetchData<GenericTeamRoster>(endpoint, queryParams);
  return data;
}
