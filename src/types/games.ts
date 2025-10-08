/**
 * Game status enumeration
 */
export enum GameStatus {
  SCHEDULED = 'SCHEDULED',
  LIVE = 'LIVE',
  FINAL = 'FINAL',
  FINAL_OT = 'FINAL - OT',
  FINAL_2OT = 'FINAL - 2OT',
  FINAL_3OT = 'FINAL - 3OT',
  POSTPONED = 'POSTPONED',
  CANCELLED = 'CANCELLED',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Game competition type
 */
export enum GameCompetition {
  REGULAR = 'REGULAR',
  PLAYOFFS = 'PLAYOFFS',
  CHAMPIONSHIP = 'CHAMPIONSHIP',
  ALL_STAR = 'ALL_STAR',
}

/**
 * Supported league systems
 */
export enum LeagueSystem {
  CEBL = 'cebl', // Canadian Elite Basketball League
  CHL = 'chl', // Canadian Hockey League
  USPORTS = 'usports', // U SPORTS
  HOOPQUEENS = 'hoopqueens', // Hoop Queens Basketball League
  CPL = 'cpl', // Canadian Premier League (Soccer)
  CFL = 'cfl', // Canadian Football League
}

/**
 * U SPORTS sport types
 */
export enum USportsSport {
  BASKETBALL = 'basketball',
  FOOTBALL = 'football',
  ICE_HOCKEY = 'ice_hockey',
  SOCCER = 'soccer',
  VOLLEYBALL = 'volleyball',
}

/**
 * U SPORTS league identifiers
 */
export enum USportsLeague {
  MBB = 'mbb', // Men's Basketball
  WBB = 'wbb', // Women's Basketball
  MVB = 'mvb', // Men's Volleyball
  WVB = 'wvb', // Women's Volleyball
  MFB = 'mfb', // Men's Football
  MSOC = 'msoc', // Men's Soccer
  WSOC = 'wsoc', // Women's Soccer
  MHKY = 'mhky', // Men's Hockey
  WHKY = 'whky', // Women's Hockey
}

/**
 * Team identity and score in a game
 */
export interface TeamScore {
  id?: string | number | null;
  name: string;
  short_team_name?: string | null;
  abbreviation?: string | null;
  score?: string | number | null;
}

/**
 * Schedule or result for a single game
 */
export interface GenericGame {
  /** Unique game identifier */
  id: string | number;
  /** ISO 8601 date/time of the game */
  date: string | null;
  /** Current status of the game */
  status: GameStatus;
  /** Home team details and score */
  home_team: TeamScore;
  /** Away team details and score */
  away_team: TeamScore;
  /** Identifier for the league */
  league_id: string;
  /** Competition type */
  competition?: GameCompetition | null;
  /** Venue name */
  venue?: string | null;
  /** List of broadcasters */
  broadcast?: string[] | null;
}

/**
 * API error response structure
 */
export interface NorthScoreApiError {
  error: {
    code: number;
    message: string;
    timestamp: string;
    details: {
      detail: string;
    };
  };
}

/**
 * Type guard for API error responses
 */
export function isApiError(response: unknown): response is NorthScoreApiError {
  return (
    typeof response === 'object' &&
    response !== null &&
    'error' in response &&
    typeof (response as NorthScoreApiError).error === 'object'
  );
}
