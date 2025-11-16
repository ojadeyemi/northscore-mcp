/**
 * Response normalizers for Northscore API
 * Handles different response structures across leagues
 */

import type {
  GenericStandings,
  GenericPlayerLeaderboard,
  GenericTeamStat,
} from '../../types/games.js';

/**
 * Normalize standings response
 * Some leagues return arrays, some return dicts - normalize to array
 */
export function normalizeStandings(
  data: GenericStandings[] | Record<string, GenericStandings[]>,
): GenericStandings[] {
  // Already an array
  if (Array.isArray(data)) {
    return data;
  }

  // Flatten dict to array
  const standings: GenericStandings[] = [];
  for (const group of Object.values(data)) {
    if (Array.isArray(group)) {
      for (const item of group) {
        standings.push(item);
      }
    }
  }

  return standings;
}

/**
 * Normalize leaderboard response
 * API returns dict with stat names as keys - flatten to array or filter by stat
 */
export function normalizeLeaderboard(
  data:
    | Record<string, GenericPlayerLeaderboard[]>
    | Record<string, Record<string, GenericPlayerLeaderboard[]>>,
  statType?: string,
): GenericPlayerLeaderboard[] {
  const flatData: Record<string, GenericPlayerLeaderboard[]> = {};
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      flatData[key] = value as GenericPlayerLeaderboard[];
    } else if (typeof value === 'object') {
      for (const [nestedKey, nestedValue] of Object.entries(
        value as Record<string, GenericPlayerLeaderboard[]>,
      )) {
        if (Array.isArray(nestedValue)) {
          flatData[`${key}_${nestedKey}`] = nestedValue;
        }
      }
    }
  }

  // If stat type specified, return only that stat
  if (statType && flatData[statType]) {
    return flatData[statType] ?? [];
  }

  // Otherwise, flatten all stats into single array
  const leaders: GenericPlayerLeaderboard[] = [];
  for (const statLeaders of Object.values(flatData)) {
    if (Array.isArray(statLeaders)) {
      for (const leader of statLeaders) {
        leaders.push(leader);
      }
    }
  }

  return leaders;
}

/**
 * Normalize team stats response
 * When team_name query param provided, API returns list with single item - extract it
 */
export function normalizeTeamStats(
  data: GenericTeamStat[] | GenericTeamStat,
  teamName?: string,
): GenericTeamStat | GenericTeamStat[] {
  // If team_name was provided and we got an array, extract single item
  if (teamName && Array.isArray(data) && data.length > 0) {
    return data[0]!;
  }

  // Return as-is
  return data;
}
