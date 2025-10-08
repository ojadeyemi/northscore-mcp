import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerHelloTool(server: McpServer): void {
  server.registerTool(
    'hello',
    {
      title: 'Hello World Tool',
      description: 'Returns a greeting message',
      inputSchema: {
        name: z.string().optional().describe('Name to greet (optional)'),
      },
      outputSchema: {
        message: z.string(),
      },
    },
    ({ name }) => {
      const greeting = name ? `Hello, ${name}!` : 'Hello, World!';
      const output = { message: greeting };

      return {
        content: [{ type: 'text', text: JSON.stringify(output) }],
        structuredContent: output,
      };
    },
  );
}
