import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express, { type Request, type Response } from 'express';
import { config, validateConfig } from './config/env.js';
import { registerGetGamesTool } from './tools/games.js';

// Validate environment configuration on startup
try {
  validateConfig();
} catch (error) {
  console.error('Configuration error:', error instanceof Error ? error.message : 'Unknown error');
  process.exit(1);
}

// Create an MCP server
const server = new McpServer({
  name: 'northscore-mcp',
  version: '1.0.0',
});

// Register NorthScore tools
registerGetGamesTool(server);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req: Request, res: Response) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close();
  });

  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app
  .listen(config.port, () => {
    console.info(`NorthScore MCP Server running on http://localhost:${config.port}/mcp`);
    console.info(`Environment: ${config.nodeEnv}`);
  })
  .on('error', (error: Error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
