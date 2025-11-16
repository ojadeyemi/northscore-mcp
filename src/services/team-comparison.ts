/**
 * Team comparison service - Fetch team comparisons from Northscore API
 */

import type { GenericTeamComparison, CollegeTeamComparison } from '../types/responses.js';
import type { TeamComparisonQueryParams } from '../types/params.js';
import type { LeagueSystem, SimpleLeague } from '../types/leagues.js';
import { fetchData } from './api/client.js';
import { buildTeamComparisonEndpoint } from './api/endpoints.js';
import { validateTeamForLeague, normalizeTeamName } from '../utils/validation.js';

/**
 * Leagues that support PER_GAME mode by default
 */
const PER_GAME_LEAGUES: readonly SimpleLeague[] = ['cebl'];

/**
 * Fetch team comparison from Northscore API
 * @param leagueSystem - Combined league identifier (e.g., 'cebl', 'usports_mbb')
 * @param params - Query parameters (team1 and team2 required)
 * @returns Team comparison data (college leagues include radar and league averages)
 */
export default async function fetchTeamComparison(
  leagueSystem: LeagueSystem,
  params: TeamComparisonQueryParams,
): Promise<GenericTeamComparison | CollegeTeamComparison> {
  validateTeamForLeague(leagueSystem, params.team1);
  validateTeamForLeague(leagueSystem, params.team2);
  const endpoint = buildTeamComparisonEndpoint(leagueSystem);
  const queryParams: Record<string, string> = {
    team1: normalizeTeamName(leagueSystem, params.team1),
    team2: normalizeTeamName(leagueSystem, params.team2),
  };

  // Apply smart defaults for mode
  if (params.mode) {
    queryParams.mode = params.mode;
  } else if (
    PER_GAME_LEAGUES.includes(leagueSystem as SimpleLeague) ||
    leagueSystem.startsWith('usports_')
  ) {
    // Default to PER_GAME for CEBL and USports
    queryParams.mode = 'PER_GAME';
  }

  // Add other optional parameters
  if (params.competition) queryParams.competition = params.competition;
  if (params.segment) queryParams.segment = params.segment;
  if (params.season_option) queryParams.season_option = params.season_option;

  // U SPORTS and OCAA return CollegeTeamComparison, others return GenericTeamComparison
  const isCollegeLeague = leagueSystem.startsWith('usports_') || leagueSystem.startsWith('ocaa_');

  if (isCollegeLeague) {
    const data = await fetchData<CollegeTeamComparison>(endpoint, queryParams);
    return data;
  } else {
    const data = await fetchData<GenericTeamComparison>(endpoint, queryParams);
    return data;
  }
}
