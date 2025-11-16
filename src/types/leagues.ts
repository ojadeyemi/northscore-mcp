/**
 * League system type definitions
 * Comprehensive type-safe league identifiers
 */

/**
 * Simple league identifiers (base leagues)
 */
export type SimpleLeague = 'cebl' | 'cfl' | 'cpl' | 'hoopqueens';

/**
 * U SPORTS league identifiers (sport_league format)
 */
export type USportsLeagueSystem =
  | 'usports_mbb'
  | 'usports_wbb'
  | 'usports_mvb'
  | 'usports_wvb'
  | 'usports_mfb'
  | 'usports_msoc'
  | 'usports_wsoc'
  | 'usports_mhky'
  | 'usports_whky';

/**
 * OCAA league identifiers (sport_league format)
 * Note: OCAA only supports mbb, wbb, msoc, wsoc, and wvb
 */
export type OCAALeagueSystem = 'ocaa_mbb' | 'ocaa_wbb' | 'ocaa_msoc' | 'ocaa_wsoc' | 'ocaa_wvb';

/**
 * All supported league systems
 * Use this as the type for leagueSystem parameters
 */
export type LeagueSystem = SimpleLeague | USportsLeagueSystem | OCAALeagueSystem;
