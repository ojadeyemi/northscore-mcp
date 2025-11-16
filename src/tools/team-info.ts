import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchTeamInfo, NorthScoreApiClientError } from '../services/index.js';
import { LEAGUE_SYSTEMS } from '../constants/index.js';

const getTeamInfoInputSchema = {
  league_system: z.enum(LEAGUE_SYSTEMS).describe('Combined league identifier (e.g., usports_mbb, chl_ohl)'),
  team_name: z.string().describe('Team to fetch info for'),
};

const getTeamInfoOutputSchema = {
  success: z.boolean(),
  team_info: z.any().optional(),
  error: z.string().optional(),
};

export function registerGetTeamInfoTool(server: McpServer): void {
  server.registerTool(
    'get_team_info',
    {
      title: 'Get Team Info',
      description:
        'Use this when the user wants basic team information like record, division, streak, or ticket links',
      inputSchema: getTeamInfoInputSchema,
      outputSchema: getTeamInfoOutputSchema,
    },
    async ({ league_system, team_name }) => {
      try {
        const teamInfo = await fetchTeamInfo(league_system, team_name);

        const output = {
          success: true,
          team_info: teamInfo,
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
