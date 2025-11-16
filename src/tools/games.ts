import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchGames, NorthScoreApiClientError } from '../services/index.js';
import type { GenericGame } from '../types/games.js';
import { LEAGUE_SYSTEMS, RECENT_DAYS_LIMIT } from '../constants/index.js';

const getGamesInputSchema = {
  league_system: z.enum(LEAGUE_SYSTEMS).describe('Combined league identifier (e.g., usports_mbb, chl_ohl)'),
  team_name: z.string().optional().describe('Filter to specific team'),
  recent: z.boolean().optional().describe('Filter to recent games (past 14 days)'),
  upcoming: z.boolean().optional().describe('Filter to upcoming games'),
};

const getGamesOutputSchema = {
  success: z.boolean(),
  games: z.array(z.any()).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
};

function filterGamesByDate(
  games: GenericGame[],
  recent?: boolean,
  upcoming?: boolean,
): GenericGame[] {
  if (!recent && !upcoming) return games;

  const now = new Date();
  const recentCutoff = new Date(now.getTime() - RECENT_DAYS_LIMIT * 24 * 60 * 60 * 1000);

  return games.filter((game) => {
    if (!game.date) return false;
    const gameDate = new Date(game.date);

    if (recent && gameDate < now && gameDate >= recentCutoff) return true;
    if (upcoming && gameDate >= now) return true;

    return false;
  });
}

export function registerGetGamesTool(server: McpServer): void {
  server.registerTool(
    'get_games',
    {
      title: 'Get Games',
      description:
        'Use this when the user wants to see games, schedules, scores, or matchups for a league or specific team',
      inputSchema: getGamesInputSchema,
      outputSchema: getGamesOutputSchema,
    },
    async ({ league_system, team_name, recent, upcoming }) => {
      try {
        const params = team_name ? { team_name } : undefined;
        const games = await fetchGames(league_system, params);

        const filteredGames = filterGamesByDate(games, recent, upcoming);

        const output = {
          success: true,
          games: filteredGames,
          count: filteredGames.length,
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(output, null, 2) }],
          structuredContent: output,
        };
      } catch (error) {
        const errorOutput = {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          ...(error instanceof NorthScoreApiClientError && { statusCode: error.statusCode }),
        };

        return {
          content: [{ type: 'text', text: JSON.stringify(errorOutput, null, 2) }],
          structuredContent: errorOutput,
        };
      }
    },
  );
}
