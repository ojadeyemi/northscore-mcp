import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchTeamStats, NorthScoreApiClientError } from '../services/index.js';
import { LEAGUE_SYSTEMS } from '../constants/index.js';

const getTeamStatsInputSchema = {
  league_system: z.enum(LEAGUE_SYSTEMS).describe('Combined league identifier (e.g., usports_mbb, chl_ohl)'),
  team_name: z.string().describe('Team to fetch stats for'),
  mode: z.enum(['PER_GAME', 'TOTALS']).optional().describe('Stats mode (CEBL, USports only)'),
  competition: z.enum(['REGULAR', 'FINALS']).optional().describe('Competition type (CEBL only)'),
};

const getTeamStatsOutputSchema = {
  success: z.boolean(),
  team_stats: z.any().optional(),
  error: z.string().optional(),
};

export function registerGetTeamStatsTool(server: McpServer): void {
  server.registerTool(
    'get_team_stats',
    {
      title: 'Get Team Stats',
      description:
        'Use this when the user asks for team statistics, performance metrics, or team-level stats',
      inputSchema: getTeamStatsInputSchema,
      outputSchema: getTeamStatsOutputSchema,
    },
    async ({ league_system, team_name, mode, competition }) => {
      try {
        const params = {
          team_name,
          ...(mode && { mode }),
          ...(competition && { competition }),
        };

        const teamStats = await fetchTeamStats(league_system, params);

        const output = {
          success: true,
          team_stats: teamStats,
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
