/**
 * Validation utilities for league and team names
 */

import type { LeagueSystem } from '../types/leagues.js';
import type { AnyTeamName } from '../types/teams.js';
import {
  CEBL_TEAM_NAMES,
  CFL_TEAM_NAMES,
  CPL_TEAM_NAMES,
  HOOPQUEENS_TEAM_NAMES,
  USPORTS_TEAM_NAMES,
  OCAA_TEAM_NAMES,
} from '../constants/teams.js';

/**
 * Get the team names array for a given league system
 */
function getTeamNamesForLeague(leagueSystem: LeagueSystem): readonly string[] {
  // Simple leagues
  if (leagueSystem === 'cebl') return CEBL_TEAM_NAMES;
  if (leagueSystem === 'cfl') return CFL_TEAM_NAMES;
  if (leagueSystem === 'cpl') return CPL_TEAM_NAMES;
  if (leagueSystem === 'hoopqueens') return HOOPQUEENS_TEAM_NAMES;

  // U SPORTS leagues (all share same team names)
  if (leagueSystem.startsWith('usports_')) return USPORTS_TEAM_NAMES;

  // OCAA leagues (all share same team names)
  if (leagueSystem.startsWith('ocaa_')) return OCAA_TEAM_NAMES;

  throw new Error(`Unsupported league system: ${leagueSystem}`);
}

/**
 * Leagues that use lowercase team names
 */
const LOWERCASE_LEAGUES: readonly LeagueSystem[] = ['cebl', 'cfl', 'cpl', 'hoopqueens'];

/**
 * Check if a league uses lowercase team names
 */
function usesLowercaseTeamNames(leagueSystem: LeagueSystem): boolean {
  return LOWERCASE_LEAGUES.includes(leagueSystem);
}

/**
 * Normalize team name to the correct case for the league system
 * @param leagueSystem - The league system identifier
 * @param teamName - The team name to normalize
 * @returns Normalized team name (lowercase for simple leagues, proper case for college)
 */
export function normalizeTeamName(leagueSystem: LeagueSystem, teamName: string): string {
  if (usesLowercaseTeamNames(leagueSystem)) {
    return teamName.toLowerCase();
  }
  return teamName;
}

/**
 * Validate that a team name belongs to the specified league system
 * @param leagueSystem - The league system identifier
 * @param teamName - The team name to validate (will be normalized to correct case)
 * @throws Error if team name is invalid for the league
 */
export function validateTeamForLeague(leagueSystem: LeagueSystem, teamName: string): void {
  const validTeams = getTeamNamesForLeague(leagueSystem);
  const normalizedTeamName = normalizeTeamName(leagueSystem, teamName);

  // Check if team exists in the league
  if (!validTeams.includes(normalizedTeamName)) {
    const caseNote = usesLowercaseTeamNames(leagueSystem)
      ? ' (use lowercase)'
      : ' (use proper case)';
    throw new Error(
      `Invalid team name "${teamName}" for league "${leagueSystem}"${caseNote}. Valid teams: ${validTeams.join(', ')}`,
    );
  }
}

/**
 * Type guard to check if a string is a valid team name
 */
export function isValidTeamName(teamName: string): teamName is AnyTeamName {
  const allTeams: readonly string[] = [
    ...CEBL_TEAM_NAMES,
    ...CFL_TEAM_NAMES,
    ...CPL_TEAM_NAMES,
    ...HOOPQUEENS_TEAM_NAMES,
    ...USPORTS_TEAM_NAMES,
    ...OCAA_TEAM_NAMES,
  ];
  return allTeams.includes(teamName);
}

/**
 * Type guard to check if a string is a valid league system
 */
export function isValidLeagueSystem(value: string): value is LeagueSystem {
  const validLeagues: readonly string[] = [
    'cebl',
    'cfl',
    'cpl',
    'hoopqueens',
    'usports_mbb',
    'usports_wbb',
    'usports_mvb',
    'usports_wvb',
    'usports_mfb',
    'usports_msoc',
    'usports_wsoc',
    'usports_mhky',
    'usports_whky',
    'ocaa_mbb',
    'ocaa_wbb',
    'ocaa_msoc',
    'ocaa_wsoc',
    'ocaa_wvb',
  ];
  return validLeagues.includes(value);
}
