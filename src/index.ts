import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { validateConfig } from './config/env.js';
import { registerGetGamesTool } from './tools/games.js';
import { registerGetStandingsTool } from './tools/standings.js';
import { registerGetLeaderboardTool } from './tools/leaderboard.js';
import { registerGetTeamStatsTool } from './tools/team-stats.js';
import { registerGetTeamInfoTool } from './tools/team-info.js';

try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}

const server = new McpServer({
  name: 'northscore-mcp',
  version: '1.0.0',
  description: 'Canadian sports statistics from the Northscore API',
  vendor: {
    name: 'OJ Adeyemi',
    url: 'https://github.com/ojadeyemi/northscore-mcp',
  },
  capabilities: {
    tools: {
      supportsProgress: false,
    },
  },
});

registerGetGamesTool(server);
registerGetStandingsTool(server);
registerGetLeaderboardTool(server);
registerGetTeamStatsTool(server);
registerGetTeamInfoTool(server);

const transport = new StdioServerTransport();
await server.connect(transport);
