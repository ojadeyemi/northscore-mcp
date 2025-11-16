/**
 * Games service - Fetch games from Northscore API
 */

import type { GenericGame } from '../types/games.js';
import type { GamesQueryParams } from '../types/params.js';
import type { LeagueSystem } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildGamesEndpoint } from './api/endpoints.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Fetch games from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param params - Optional query parameters
 * @returns Array of games
 */
export default async function fetchGames(
  leagueSystem: LeagueSystem,
  params?: GamesQueryParams,
): Promise<GenericGame[]> {
  if (params?.team_name) {
    validateTeamForLeague(leagueSystem, params.team_name);
  }
  const endpoint = buildGamesEndpoint(leagueSystem);
  const queryParams: Record<string, string> = {};

  if (params?.team_name) {
    queryParams.team_name = normalizeTeamName(leagueSystem, params.team_name);
  }

  const games = await fetchData<GenericGame[]>(endpoint, queryParams);
  return games;
}
