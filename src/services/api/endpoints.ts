/**
 * API endpoint builders for Northscore API
 * Moved from utils/league-parser.ts for better modularity
 */

import type { LeagueSystem } from '../../types/leagues.js';

/**
 * Parsed league system information
 */
export interface ParsedLeagueSystem {
  type: 'simple' | 'usports' | 'ocaa';
  baseLeague: string;
  sport?: 'basketball' | 'football' | 'ice_hockey' | 'soccer' | 'volleyball';
  league?: 'mbb' | 'wbb' | 'mvb' | 'wvb' | 'mfb' | 'msoc' | 'wsoc' | 'mhky' | 'whky';
}

/**
 * Map U SPORTS/OCAA league codes to sport types
 */
const LEAGUE_TO_SPORT_MAP: Record<
  string,
  'basketball' | 'football' | 'ice_hockey' | 'soccer' | 'volleyball'
> = {
  mbb: 'basketball',
  wbb: 'basketball',
  mvb: 'volleyball',
  wvb: 'volleyball',
  mfb: 'football',
  msoc: 'soccer',
  wsoc: 'soccer',
  mhky: 'ice_hockey',
  whky: 'ice_hockey',
};

/**
 * Parse combined league system identifier into components
 */
export function parseLeagueSystem(leagueSystem: LeagueSystem): ParsedLeagueSystem {
  // Simple leagues
  if (['cebl', 'cfl', 'cpl', 'hoopqueens'].includes(leagueSystem)) {
    return {
      type: 'simple',
      baseLeague: leagueSystem,
    };
  }

  // U SPORTS leagues
  if (leagueSystem.startsWith('usports_')) {
    const league = leagueSystem.replace('usports_', '') as
      | 'mbb'
      | 'wbb'
      | 'mvb'
      | 'wvb'
      | 'mfb'
      | 'msoc'
      | 'wsoc'
      | 'mhky'
      | 'whky';
    const sport = LEAGUE_TO_SPORT_MAP[league];

    if (!sport) {
      throw new Error(`Unknown U SPORTS league: ${league}`);
    }

    return {
      type: 'usports',
      baseLeague: 'usports',
      sport,
      league,
    };
  }

  // OCAA leagues
  if (leagueSystem.startsWith('ocaa_')) {
    const league = leagueSystem.replace('ocaa_', '') as
      | 'mbb'
      | 'wbb'
      | 'mvb'
      | 'wvb'
      | 'mfb'
      | 'msoc'
      | 'wsoc'
      | 'mhky'
      | 'whky';
    const sport = LEAGUE_TO_SPORT_MAP[league];

    if (!sport) {
      throw new Error(`Unknown OCAA league: ${league}`);
    }

    return {
      type: 'ocaa',
      baseLeague: 'ocaa',
      sport,
      league,
    };
  }

  throw new Error(`Unsupported league system: ${leagueSystem}`);
}

/**
 * Build API endpoint for games
 */
export function buildGamesEndpoint(leagueSystem: LeagueSystem): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/games`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/games`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/games`;
  }
}

/**
 * Build API endpoint for standings
 */
export function buildStandingsEndpoint(leagueSystem: LeagueSystem): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/standings`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/standings`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/standings`;
  }
}

/**
 * Build API endpoint for leaderboard
 */
export function buildLeaderboardEndpoint(leagueSystem: LeagueSystem): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/leaderboard`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/leaderboard`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/leaderboard`;
  }
}

/**
 * Build API endpoint for team statistics
 */
export function buildTeamStatsEndpoint(leagueSystem: LeagueSystem): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/statistics`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/statistics`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/statistics`;
  }
}

/**
 * Build API endpoint for team info
 */
export function buildTeamInfoEndpoint(leagueSystem: LeagueSystem, teamName: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/${teamName}/info`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/${teamName}/info`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/${teamName}/info`;
  }
}

/**
 * Build API endpoint for team roster
 */
export function buildTeamRosterEndpoint(leagueSystem: LeagueSystem, teamName: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/${teamName}/roster`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/${teamName}/roster`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/${teamName}/roster`;
  }
}

/**
 * Build API endpoint for team comparison
 */
export function buildTeamComparisonEndpoint(leagueSystem: LeagueSystem): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/comparison`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/comparison`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/comparison`;
  }
}
