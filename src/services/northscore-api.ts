import { config } from '../config/env.js';
import type {
  GenericGame,
  NorthScoreApiError,
  LeagueSystem,
  USportsSport,
  USportsLeague,
} from '../types/games.js';
import { isApiError } from '../types/games.js';

const BASE_URL = 'https://api.northscore.ca/api/v1';

/**
 * Custom error class for NorthScore API errors
 */
export class NorthScoreApiClientError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public apiError?: NorthScoreApiError,
  ) {
    super(message);
    this.name = 'NorthScoreApiClientError';
  }
}

/**
 * Build the appropriate endpoint based on league system
 */
function buildEndpoint(
  leagueSystem: LeagueSystem,
  sport?: USportsSport,
  league?: USportsLeague,
): string {
  switch (leagueSystem) {
    case LeagueSystem.CEBL:
      return '/cebl/games';
    case LeagueSystem.CHL:
      return '/chl/games';
    case LeagueSystem.HOOPQUEENS:
      return '/hoopqueens/games';
    case LeagueSystem.CPL:
      return '/cpl/games';
    case LeagueSystem.CFL:
      return '/cfl/games';
    case LeagueSystem.USPORTS:
      if (!sport || !league) {
        throw new Error('sport and league are required for U SPORTS');
      }
      return `/usports/${sport}/${league}/games`;
    default:
      throw new Error(`Unsupported league system: ${leagueSystem}`);
  }
}

/**
 * Fetch games from NorthScore API
 */
export async function fetchGames(
  leagueSystem: LeagueSystem,
  sport?: USportsSport,
  league?: USportsLeague,
): Promise<GenericGame[]> {
  const endpoint = buildEndpoint(leagueSystem, sport, league);
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-KEY': config.northScoreApiKey,
        'Content-Type': 'application/json',
      },
    });

    // Handle error responses
    if (!response.ok) {
      const errorData = (await response.json()) as unknown;

      if (isApiError(errorData)) {
        const { code, message, details } = errorData.error;

        switch (code) {
          case 403:
            throw new NorthScoreApiClientError(
              `Permission denied: ${details.detail}`,
              403,
              errorData,
            );
          case 404:
            throw new NorthScoreApiClientError(`Resource not found: ${message}`, 404, errorData);
          case 500:
            throw new NorthScoreApiClientError(`Server error: ${message}`, 500, errorData);
          default:
            throw new NorthScoreApiClientError(`API error: ${message}`, code, errorData);
        }
      }

      // Fallback for non-standard error responses
      throw new NorthScoreApiClientError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
      );
    }

    const games = (await response.json()) as GenericGame[];
    return games;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof NorthScoreApiClientError) {
      throw error;
    }

    // Wrap unknown errors
    throw new NorthScoreApiClientError(
      `Failed to fetch games: ${error instanceof Error ? error.message : 'Unknown error'}`,
      500,
    );
  }
}
