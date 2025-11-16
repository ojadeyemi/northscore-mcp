/**
 * Standings service - Fetch standings from Northscore API
 */

import type { GenericStandings } from '../types/games.js';
import type { LeagueSystem } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildStandingsEndpoint } from './api/endpoints.js';
import { normalizeStandings } from './api/normalizers.js';

/**
 * Fetch standings from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @returns Array of standings (normalized from dict if needed)
 */
export default async function fetchStandings(
  leagueSystem: LeagueSystem,
): Promise<GenericStandings[]> {
  const endpoint = buildStandingsEndpoint(leagueSystem);

  const data = await fetchData<GenericStandings[] | Record<string, GenericStandings[]>>(endpoint);

  // Normalize response (some leagues return dict, some return array)
  return normalizeStandings(data);
}
