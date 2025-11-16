/**
 * Team name type definitions for all supported leagues
 * Derived from constants to ensure single source of truth
 */

import type {
  CEBL_TEAM_NAMES,
  CFL_TEAM_NAMES,
  CPL_TEAM_NAMES,
  HOOPQUEENS_TEAM_NAMES,
  USPORTS_TEAM_NAMES,
  OCAA_TEAM_NAMES,
} from '../constants/teams.js';

/**
 * CEBL (Canadian Elite Basketball League) team names
 */
export type CEBLTeamName = (typeof CEBL_TEAM_NAMES)[number];

/**
 * CFL (Canadian Football League) team names
 */
export type CFLTeamName = (typeof CFL_TEAM_NAMES)[number];

/**
 * CPL (Canadian Premier League - Soccer) team names
 */
export type CPLTeamName = (typeof CPL_TEAM_NAMES)[number];

/**
 * Hoop Queens Basketball League team names
 */
export type HoopQueensTeamName = (typeof HOOPQUEENS_TEAM_NAMES)[number];

/**
 * U SPORTS school names (applies to all U SPORTS leagues)
 * Note: Not all schools participate in all sports
 */
export type USportsSchoolName = (typeof USPORTS_TEAM_NAMES)[number];

/**
 * OCAA school names (applies to all OCAA leagues)
 * Note: Not all schools participate in all sports
 */
export type OCAASchoolName = (typeof OCAA_TEAM_NAMES)[number];

/**
 * Union of all team names across all supported leagues
 */
export type AnyTeamName =
  | CEBLTeamName
  | CFLTeamName
  | CPLTeamName
  | HoopQueensTeamName
  | USportsSchoolName
  | OCAASchoolName;
