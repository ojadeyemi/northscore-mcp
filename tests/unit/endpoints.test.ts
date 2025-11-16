/**
 * Unit tests for endpoint builders
 */

import { describe, it, expect } from 'vitest';
import {
  parseLeagueSystem,
  buildGamesEndpoint,
  buildStandingsEndpoint,
  buildLeaderboardEndpoint,
  buildTeamStatsEndpoint,
  buildTeamInfoEndpoint,
  buildTeamRosterEndpoint,
  buildTeamComparisonEndpoint,
} from '@/services/api/endpoints.js';

describe('parseLeagueSystem', () => {
  it('should parse simple league - CEBL', () => {
    const result = parseLeagueSystem('cebl');
    expect(result).toEqual({
      type: 'simple',
      baseLeague: 'cebl',
    });
  });

  it('should parse simple league - CFL', () => {
    const result = parseLeagueSystem('cfl');
    expect(result).toEqual({
      type: 'simple',
      baseLeague: 'cfl',
    });
  });

  // CHL tests removed - league no longer supported

  it('should parse U SPORTS league - MBB', () => {
    const result = parseLeagueSystem('usports_mbb');
    expect(result).toEqual({
      type: 'usports',
      baseLeague: 'usports',
      sport: 'basketball',
      league: 'mbb',
    });
  });

  it('should parse U SPORTS league - WVB', () => {
    const result = parseLeagueSystem('usports_wvb');
    expect(result).toEqual({
      type: 'usports',
      baseLeague: 'usports',
      sport: 'volleyball',
      league: 'wvb',
    });
  });

  it('should parse OCAA league - MBB', () => {
    const result = parseLeagueSystem('ocaa_mbb');
    expect(result).toEqual({
      type: 'ocaa',
      baseLeague: 'ocaa',
      sport: 'basketball',
      league: 'mbb',
    });
  });

  it('should throw error for unsupported league', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => parseLeagueSystem('invalid_league')).toThrow('Unsupported league system');
  });

  it('should throw error for unknown U SPORTS league code', () => {
    // @ts-expect-error - Testing invalid input
    expect(() => parseLeagueSystem('usports_xyz')).toThrow('Unknown U SPORTS league');
  });
});

describe('buildGamesEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildGamesEndpoint('cebl')).toBe('/cebl/games');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildGamesEndpoint('usports_mbb')).toBe('/usports/basketball/mbb/games');
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildGamesEndpoint('ocaa_wbb')).toBe('/ocaa/basketball/wbb/games');
  });
});

describe('buildStandingsEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildStandingsEndpoint('cfl')).toBe('/cfl/standings');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildStandingsEndpoint('usports_mhky')).toBe('/usports/ice_hockey/mhky/standings');
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildStandingsEndpoint('ocaa_msoc')).toBe('/ocaa/soccer/msoc/standings');
  });
});

describe('buildLeaderboardEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildLeaderboardEndpoint('cebl')).toBe('/cebl/leaderboard');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildLeaderboardEndpoint('usports_mbb')).toBe('/usports/basketball/mbb/leaderboard');
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildLeaderboardEndpoint('ocaa_wvb')).toBe('/ocaa/volleyball/wvb/leaderboard');
  });
});

describe('buildTeamStatsEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildTeamStatsEndpoint('cebl')).toBe('/cebl/teams/statistics');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildTeamStatsEndpoint('usports_mfb')).toBe('/usports/football/mfb/teams/statistics');
  });

});

describe('buildTeamInfoEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildTeamInfoEndpoint('cebl', 'calgary')).toBe('/cebl/teams/calgary/info');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildTeamInfoEndpoint('usports_mbb', 'carleton')).toBe(
      '/usports/basketball/mbb/teams/carleton/info',
    );
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildTeamInfoEndpoint('ocaa_wbb', 'humber')).toBe(
      '/ocaa/basketball/wbb/teams/humber/info',
    );
  });
});

describe('buildTeamRosterEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildTeamRosterEndpoint('cebl', 'brampton')).toBe('/cebl/teams/brampton/roster');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildTeamRosterEndpoint('usports_mbb', 'mcgill')).toBe(
      '/usports/basketball/mbb/teams/mcgill/roster',
    );
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildTeamRosterEndpoint('ocaa_mbb', 'sheridan')).toBe(
      '/ocaa/basketball/mbb/teams/sheridan/roster',
    );
  });
});

describe('buildTeamComparisonEndpoint', () => {
  it('should build endpoint for simple league', () => {
    expect(buildTeamComparisonEndpoint('cebl')).toBe('/cebl/teams/comparison');
  });

  // CHL test removed - league no longer supported

  it('should build endpoint for U SPORTS league', () => {
    expect(buildTeamComparisonEndpoint('usports_mbb')).toBe(
      '/usports/basketball/mbb/teams/comparison',
    );
  });

  it('should build endpoint for OCAA league', () => {
    expect(buildTeamComparisonEndpoint('ocaa_wsoc')).toBe('/ocaa/soccer/wsoc/teams/comparison');
  });
});
