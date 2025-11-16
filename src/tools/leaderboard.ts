import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchLeaderboard, NorthScoreApiClientError } from '../services/index.js';
import { LEAGUE_SYSTEMS } from '../constants/index.js';

const getLeaderboardInputSchema = {
  league_system: z.enum(LEAGUE_SYSTEMS).describe('Combined league identifier (e.g., usports_mbb, chl_ohl)'),
  stat_type: z.string().optional().describe('Specific stat to filter (e.g., POINTS, ASSISTS)'),
  mode: z.enum(['PER_GAME', 'TOTALS']).optional().describe('Stats mode (CEBL, USports only)'),
  competition: z.enum(['REGULAR', 'FINALS']).optional().describe('Competition type (CEBL only)'),
  limit: z.number().optional().describe('Limit number of results'),
};

const getLeaderboardOutputSchema = {
  success: z.boolean(),
  leaders: z.array(z.any()).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
};

export function registerGetLeaderboardTool(server: McpServer): void {
  server.registerTool(
    'get_leaderboard',
    {
      title: 'Get Leaderboard',
      description:
        'Use this when the user wants to see player leaders, top performers, or statistics leaders',
      inputSchema: getLeaderboardInputSchema,
      outputSchema: getLeaderboardOutputSchema,
    },
    async ({ league_system, stat_type, mode, competition, limit }) => {
      try {
        const params = {
          ...(mode && { mode }),
          ...(competition && { competition }),
          ...(limit && { limit }),
        };

        const leaders = await fetchLeaderboard(league_system, params);

        const filteredLeaders = stat_type
          ? leaders.filter((leader) => leader.stat_type === stat_type)
          : leaders;

        const output = {
          success: true,
          leaders: filteredLeaders,
          count: filteredLeaders.length,
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
