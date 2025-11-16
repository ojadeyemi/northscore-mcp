/**
 * Additional response types for roster and comparison endpoints
 */

import type { PlayerProfile, GenericTeamStat } from './games.js';

/**
 * Roster player information
 */
export interface GenericRosterPlayer {
  player_id: string | number;
  player_name: string;
  jersey_number?: string | number;
  position?: string;
  height?: string;
  weight?: string;
  player_profile?: PlayerProfile;
}

/**
 * Team roster
 */
export interface GenericTeamRoster {
  team_id: string | number;
  team_name: string;
  short_team_name?: string;
  team_abbreviation?: string;
  league_id: string;
  players: GenericRosterPlayer[];
  season?: string;
}

/**
 * Team comparison result (CEBL, CFL, CPL, HoopQueens)
 */
export interface GenericTeamComparison {
  team1: GenericTeamStat;
  team2: GenericTeamStat;
}

/**
 * College-specific radar chart categories
 */
export interface CollegeRadarCategories {
  metrics: Record<string, number>;
}

/**
 * Radar metric metadata
 */
export interface RadarMetricMetadata {
  short_name: string;
  definition: string;
}

/**
 * College radar data for team comparison
 */
export interface CollegeRadarData {
  team1: CollegeRadarCategories;
  team2: CollegeRadarCategories;
  metadata: Record<string, RadarMetricMetadata>;
}

/**
 * College league averages
 */
export interface CollegeLeagueAverages {
  averages: Record<string, number>;
}

/**
 * College team comparison (U SPORTS, OCAA)
 * Includes additional radar and league average data
 */
export interface CollegeTeamComparison {
  teams: GenericTeamComparison;
  radar: CollegeRadarData;
  league_averages: CollegeLeagueAverages;
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  location: string;
  message: string;
  type: string;
}
