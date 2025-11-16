/**
 * League system parser utilities
 * Handles parsing of combined league identifiers and building API endpoints
 */

/**
 * Parsed league system information
 */
export interface ParsedLeagueSystem {
  type: 'simple' | 'chl' | 'usports' | 'ocaa';
  baseLeague: string; // e.g., 'cebl', 'chl', 'usports', 'ocaa'
  chlLeague?: 'ohl' | 'whl' | 'qmjhl'; // For CHL only
  sport?: 'basketball' | 'football' | 'ice_hockey' | 'soccer' | 'volleyball'; // For U SPORTS/OCAA
  league?: 'mbb' | 'wbb' | 'mvb' | 'wvb' | 'mfb' | 'msoc' | 'wsoc' | 'mhky' | 'whky'; // For U SPORTS/OCAA
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
 * @param leagueSystem - Combined identifier like 'usports_mbb', 'chl_ohl', 'cebl'
 * @returns Parsed league system components
 */
export function parseLeagueSystem(leagueSystem: string): ParsedLeagueSystem {
  // Simple leagues: cebl, cfl, cpl, hoopqueens
  if (['cebl', 'cfl', 'cpl', 'hoopqueens'].includes(leagueSystem)) {
    return {
      type: 'simple',
      baseLeague: leagueSystem,
    };
  }

  // CHL leagues: chl_ohl, chl_whl, chl_qmjhl
  if (leagueSystem.startsWith('chl_')) {
    const chlLeague = leagueSystem.replace('chl_', '') as 'ohl' | 'whl' | 'qmjhl';
    return {
      type: 'chl',
      baseLeague: 'chl',
      chlLeague,
    };
  }

  // U SPORTS leagues: usports_mbb, usports_wbb, etc.
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

  // OCAA leagues: ocaa_mbb, ocaa_wbb, etc.
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
export function buildGamesEndpoint(leagueSystem: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/games`;
    case 'chl':
      return `/chl/${parsed.chlLeague}/games`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/games`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/games`;
  }
}

/**
 * Build API endpoint for standings
 */
export function buildStandingsEndpoint(leagueSystem: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/standings`;
    case 'chl':
      return `/chl/${parsed.chlLeague}/standings`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/standings`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/standings`;
  }
}

/**
 * Build API endpoint for leaderboard
 */
export function buildLeaderboardEndpoint(leagueSystem: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/leaderboard`;
    case 'chl':
      return `/chl/${parsed.chlLeague}/leaderboard`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/leaderboard`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/leaderboard`;
  }
}

/**
 * Build API endpoint for team statistics
 */
export function buildTeamStatsEndpoint(leagueSystem: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/statistics`;
    case 'chl':
      return `/chl/${parsed.chlLeague}/teams/statistics`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/statistics`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/statistics`;
  }
}

/**
 * Build API endpoint for team info
 */
export function buildTeamInfoEndpoint(leagueSystem: string, teamName: string): string {
  const parsed = parseLeagueSystem(leagueSystem);

  switch (parsed.type) {
    case 'simple':
      return `/${parsed.baseLeague}/teams/${teamName}/info`;
    case 'chl':
      return `/chl/${parsed.chlLeague}/teams/${teamName}/info`;
    case 'usports':
      return `/usports/${parsed.sport}/${parsed.league}/teams/${teamName}/info`;
    case 'ocaa':
      return `/ocaa/${parsed.sport}/${parsed.league}/teams/${teamName}/info`;
  }
}
