import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchStandings, NorthScoreApiClientError } from '../services/index.js';
import { LEAGUE_SYSTEMS } from '../constants/index.js';

const getStandingsInputSchema = {
  league_system: z.enum(LEAGUE_SYSTEMS).describe('Combined league identifier (e.g., usports_mbb, chl_ohl)'),
};

const getStandingsOutputSchema = {
  success: z.boolean(),
  standings: z.array(z.any()).optional(),
  count: z.number().optional(),
  error: z.string().optional(),
};

export function registerGetStandingsTool(server: McpServer): void {
  server.registerTool(
    'get_standings',
    {
      title: 'Get Standings',
      description:
        'Use this when the user asks about standings, rankings, win-loss records, or league positions',
      inputSchema: getStandingsInputSchema,
      outputSchema: getStandingsOutputSchema,
    },
    async ({ league_system }) => {
      try {
        const standings = await fetchStandings(league_system);

        const output = {
          success: true,
          standings,
          count: standings.length,
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
