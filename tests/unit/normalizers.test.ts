/**
 * Unit tests for response normalizers
 */

import { describe, it, expect } from 'vitest';
import {
  normalizeStandings,
  normalizeLeaderboard,
  normalizeTeamStats,
} from '@/services/api/normalizers.js';
import type { GenericStandings, GenericPlayerLeaderboard, GenericTeamStat } from '@/types/games.js';

describe('normalizeStandings', () => {
  it('should return array as-is when already an array', () => {
    const input: GenericStandings[] = [
      {
        team_id: '1',
        team_name: 'Team A',
        wins: 10,
        losses: 5,
        rank: 1,
        league_id: 'cebl',
        additional_stats: {},
      },
      {
        team_id: '2',
        team_name: 'Team B',
        wins: 8,
        losses: 7,
        rank: 2,
        league_id: 'cebl',
        additional_stats: {},
      },
    ];

    const result = normalizeStandings(input);
    expect(result).toEqual(input);
    expect(result).toHaveLength(2);
  });

  it('should flatten dict with single group to array', () => {
    const input: Record<string, GenericStandings[]> = {
      'East Conference': [
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

    const result = normalizeStandings(input);
    expect(result).toHaveLength(1);
    expect(result[0]?.team_name).toBe('Team A');
  });

  it('should flatten dict with multiple groups to array', () => {
    const input: Record<string, GenericStandings[]> = {
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
      West: [
        {
          team_id: '2',
          team_name: 'Team B',
          wins: 8,
          losses: 7,
          rank: 2,
          league_id: 'cebl',
          additional_stats: {},
        },
        {
          team_id: '3',
          team_name: 'Team C',
          wins: 6,
          losses: 9,
          rank: 3,
          league_id: 'cebl',
          additional_stats: {},
        },
      ],
    };

    const result = normalizeStandings(input);
    expect(result).toHaveLength(3);
    expect(result.map((s) => s.team_name)).toEqual(['Team A', 'Team B', 'Team C']);
  });
});

describe('normalizeLeaderboard', () => {
  it('should flatten simple dict to array', () => {
    const input: Record<string, GenericPlayerLeaderboard[]> = {
      POINTS: [
        {
          player_id: '1',
          player_name: 'Player A',
          value: '25.5',
          rank: 1,
          league_id: 'cebl',
          stat_type: 'POINTS',
          player_profile: {
            photo_url: '',
            date_of_birth: '',
            height: '',
            weight: '',
            position: '',
            jersey_number: '',
          },
        },
      ],
      ASSISTS: [
        {
          player_id: '2',
          player_name: 'Player B',
          value: '8.2',
          rank: 1,
          league_id: 'cebl',
          stat_type: 'ASSISTS',
          player_profile: {
            photo_url: '',
            date_of_birth: '',
            height: '',
            weight: '',
            position: '',
            jersey_number: '',
          },
        },
      ],
    };

    const result = normalizeLeaderboard(input);
    expect(result).toHaveLength(2);
    expect(result.map((l) => l.stat_type)).toEqual(['POINTS', 'ASSISTS']);
  });

  it('should filter by stat type when provided', () => {
    const input: Record<string, GenericPlayerLeaderboard[]> = {
      POINTS: [
        {
          player_id: '1',
          player_name: 'Player A',
          value: '25.5',
          rank: 1,
          league_id: 'cebl',
          stat_type: 'POINTS',
          player_profile: {
            photo_url: '',
            date_of_birth: '',
            height: '',
            weight: '',
            position: '',
            jersey_number: '',
          },
        },
      ],
      ASSISTS: [
        {
          player_id: '2',
          player_name: 'Player B',
          value: '8.2',
          rank: 1,
          league_id: 'cebl',
          stat_type: 'ASSISTS',
          player_profile: {
            photo_url: '',
            date_of_birth: '',
            height: '',
            weight: '',
            position: '',
            jersey_number: '',
          },
        },
      ],
    };

    const result = normalizeLeaderboard(input, 'POINTS');
    expect(result).toHaveLength(1);
    expect(result[0]?.stat_type).toBe('POINTS');
  });

  it('should handle nested dict structure', () => {
    const input: Record<string, Record<string, GenericPlayerLeaderboard[]>> = {
      OFFENSE: {
        POINTS: [
          {
            player_id: '1',
            player_name: 'Player A',
            value: '25.5',
            rank: 1,
            league_id: 'cfl',
            stat_type: 'POINTS',
            player_profile: {
              photo_url: '',
              date_of_birth: '',
              height: '',
              weight: '',
              position: '',
              jersey_number: '',
            },
          },
        ],
      },
    };

    const result = normalizeLeaderboard(input);
    expect(result).toHaveLength(1);
    expect(result[0]?.player_name).toBe('Player A');
  });
});

describe('normalizeTeamStats', () => {
  const singleTeamStat: GenericTeamStat = {
    team_id: '1',
    team_name: 'Team A',
    league_id: 'cebl',
    games_played: 20,
    stats: { points: 2000 },
    rankings: { points: 1 },
  };

  it('should extract single item from array when team_name provided', () => {
    const input: GenericTeamStat[] = [singleTeamStat];

    const result = normalizeTeamStats(input, 'Team A');
    expect(result).toEqual(singleTeamStat);
    expect(Array.isArray(result)).toBe(false);
  });

  it('should return array as-is when team_name not provided', () => {
    const input: GenericTeamStat[] = [
      singleTeamStat,
      {
        team_id: '2',
        team_name: 'Team B',
        league_id: 'cebl',
        stats: {},
      },
    ];

    const result = normalizeTeamStats(input);
    expect(result).toEqual(input);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should return single object as-is', () => {
    const result = normalizeTeamStats(singleTeamStat);
    expect(result).toEqual(singleTeamStat);
  });

  it('should return array as-is when empty', () => {
    const input: GenericTeamStat[] = [];

    const result = normalizeTeamStats(input, 'Team A');
    expect(result).toEqual([]);
    expect(Array.isArray(result)).toBe(true);
  });
});
