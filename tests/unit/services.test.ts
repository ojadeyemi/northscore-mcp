/**
 * Unit tests for service functions with mocked API calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GameStatus } from '@/types/games.js';
import type { GenericGame, GenericStandings, GenericTeamStat } from '@/types/games.js';

// Mock the API client before importing services
vi.mock('@/services/api/client.js', () => ({
  fetchData: vi.fn(),
  NorthScoreApiClientError: class NorthScoreApiClientError extends Error {
    constructor(
      message: string,
      public statusCode?: number,
      public type?: string,
    ) {
      super(message);
    }
  },
  ValidationError: class ValidationError extends Error {
    constructor(
      message: string,
      public validationErrors: unknown[],
    ) {
      super(message);
    }
  },
}));

// Import mocked fetchData
import { fetchData } from '@/services/api/client.js';
import fetchGames from '@/services/games.js';
import fetchStandings from '@/services/standings.js';
import fetchTeamStats from '@/services/team-stats.js';

// Get the mocked function
const mockFetchData = vi.mocked(fetchData);

describe('fetchGames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch CEBL games without team filter', async () => {
    const mockGames: GenericGame[] = [
      {
        id: '1',
        date: '2024-05-01T19:00:00Z',
        status: GameStatus.FINAL,
        home_team: { name: 'Calgary', score: 95 },
        away_team: { name: 'Edmonton', score: 88 },
        league_id: 'cebl',
      },
    ];

    mockFetchData.mockResolvedValueOnce(mockGames);

    const result = await fetchGames('cebl');

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/games', {});
    expect(result).toEqual(mockGames);
  });

  it('should fetch CEBL games with team filter', async () => {
    const mockGames: GenericGame[] = [
      {
        id: '1',
        date: '2024-05-01T19:00:00Z',
        status: GameStatus.FINAL,
        home_team: { name: 'calgary', score: 95 },
        away_team: { name: 'edmonton', score: 88 },
        league_id: 'cebl',
      },
    ];

    mockFetchData.mockResolvedValueOnce(mockGames);

    const result = await fetchGames('cebl', { team_name: 'Calgary' });

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/games', { team_name: 'calgary' });
    expect(result).toEqual(mockGames);
  });

  it('should fetch U SPORTS games', async () => {
    const mockGames: GenericGame[] = [];

    mockFetchData.mockResolvedValueOnce(mockGames);

    const result = await fetchGames('usports_mbb');

    expect(mockFetchData).toHaveBeenCalledWith('/usports/basketball/mbb/games', {});
    expect(result).toEqual(mockGames);
  });
});

describe('fetchStandings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and normalize array response', async () => {
    const mockStandings: GenericStandings[] = [
      {
        team_id: '1',
        team_name: 'Team A',
        wins: 10,
        losses: 5,
        rank: 1,
        league_id: 'cebl',
        additional_stats: {},
      },
    ];

    mockFetchData.mockResolvedValueOnce(mockStandings);

    const result = await fetchStandings('cebl');

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/standings');
    expect(result).toEqual(mockStandings);
  });

  it('should fetch and normalize dict response', async () => {
    const mockStandings: Record<string, GenericStandings[]> = {
      East: [
        {
          team_id: '1',
          team_name: 'Team A',
          wins: 10,
          losses: 5,
          rank: 1,
          league_id: 'cebl',
          additional_stats: {},
        },
      ],
    };

    mockFetchData.mockResolvedValueOnce(mockStandings);

    const result = await fetchStandings('cebl');

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/standings');
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(1);
  });
});

describe('fetchTeamStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should apply smart defaults for CEBL', async () => {
    const mockStats: GenericTeamStat[] = [
      {
        team_id: '1',
        team_name: 'calgary',
        league_id: 'cebl',
        stats: {},
      },
    ];

    mockFetchData.mockResolvedValueOnce(mockStats);

    await fetchTeamStats('cebl', { team_name: 'Calgary' });

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/teams/statistics', {
      mode: 'PER_GAME',
      team_name: 'calgary',
    });
  });

  it('should apply smart defaults for U SPORTS', async () => {
    const mockStats: GenericTeamStat[] = [];

    mockFetchData.mockResolvedValueOnce(mockStats);

    await fetchTeamStats('usports_mbb');

    expect(mockFetchData).toHaveBeenCalledWith('/usports/basketball/mbb/teams/statistics', {
      mode: 'PER_GAME',
    });
  });

  it('should respect explicit mode parameter', async () => {
    const mockStats: GenericTeamStat[] = [];

    mockFetchData.mockResolvedValueOnce(mockStats);

    await fetchTeamStats('cebl', { mode: 'TOTALS' });

    expect(mockFetchData).toHaveBeenCalledWith('/cebl/teams/statistics', {
      mode: 'TOTALS',
    });
  });

  // CHL test removed - league no longer supported

  it('should normalize single team response', async () => {
    const mockStats: GenericTeamStat[] = [
      {
        team_id: '1',
        team_name: 'calgary',
        league_id: 'cebl',
        stats: {},
      },
    ];

    mockFetchData.mockResolvedValueOnce(mockStats);

    const result = await fetchTeamStats('cebl', { team_name: 'Calgary' });

    expect(result).toEqual(mockStats[0]);
    expect(Array.isArray(result)).toBe(false);
  });
});
