import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchGames, NorthScoreApiClientError } from '../services/northscore-api.js';
import { LeagueSystem, USportsSport, USportsLeague, type GenericGame } from '../types/games.js';

/**
 * Zod schema for get_games tool input
 */
const getGamesInputSchema = {
  league_system: z
    .enum(['cebl', 'chl', 'usports', 'hoopqueens', 'cpl', 'cfl'])
    .describe('The league system to fetch games from'),
  sport: z
    .enum(['basketball', 'football', 'ice_hockey', 'soccer', 'volleyball'])
    .optional()
    .describe('Sport type (required only for U SPORTS)'),
  league: z
    .enum(['mbb', 'wbb', 'mvb', 'wvb', 'mfb', 'msoc', 'wsoc', 'mhky', 'whky'])
    .optional()
    .describe('League identifier (required only for U SPORTS)'),
};

/**
 * Zod schema for get_games tool output
 */
const getGamesOutputSchema = {
  success: z.boolean(),
  games: z.array(z.any()).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
};

/**
 * Register the get_games tool with the MCP server
 */
export function registerGetGamesTool(server: McpServer): void {
  server.registerTool(
    'get_games',
    {
      title: 'Get Games',
      description:
        'Use this to fetch games and schedules from Canadian sports leagues. Supports CEBL (basketball), CHL (hockey), U SPORTS (various), Hoop Queens (basketball), CPL (soccer), and CFL (football). For U SPORTS, you must provide both sport and league parameters.',
      inputSchema: getGamesInputSchema,
      outputSchema: getGamesOutputSchema,
    },
    async ({ league_system, sport, league }) => {
      try {
        // Validate U SPORTS requires sport and league
        if (league_system === 'usports' && (!sport || !league)) {
          const errorMessage = 'U SPORTS requires both "sport" and "league" parameters';
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({ success: false, error: errorMessage }),
              },
            ],
            structuredContent: {
              success: false,
              error: errorMessage,
            },
          };
        }

        // Fetch games from API
        const games: GenericGame[] = await fetchGames(
          league_system as LeagueSystem,
          sport as USportsSport | undefined,
          league as USportsLeague | undefined,
        );

        const output = {
          success: true,
          games,
          count: games.length,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(output, null, 2),
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        // Handle NorthScore API errors
        if (error instanceof NorthScoreApiClientError) {
          const errorOutput = {
            success: false,
            error: error.message,
            statusCode: error.statusCode,
          };

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(errorOutput, null, 2),
              },
            ],
            structuredContent: errorOutput,
          };
        }

        // Handle unexpected errors
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        const errorOutput = {
          success: false,
          error: errorMessage,
        };

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(errorOutput, null, 2),
            },
          ],
          structuredContent: errorOutput,
        };
      }
    },
  );
}
