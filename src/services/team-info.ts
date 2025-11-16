/**
 * Team info service - Fetch team information from Northscore API
 */

import type { GenericTeamInfo } from '../types/games.js';
import type { LeagueSystem } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildTeamInfoEndpoint } from './api/endpoints.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Fetch team information from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param teamName - Team name (required, path parameter)
 * @returns Team information
 */
export default async function fetchTeamInfo(
  leagueSystem: LeagueSystem,
  teamName: string,
): Promise<GenericTeamInfo> {
  validateTeamForLeague(leagueSystem, teamName);
  const normalizedTeamName = normalizeTeamName(leagueSystem, teamName);
  const endpoint = buildTeamInfoEndpoint(leagueSystem, normalizedTeamName);
  const data = await fetchData<GenericTeamInfo>(endpoint);
  return data;
}
