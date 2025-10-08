# NorthScore MCP Server

MCP (Model Context Protocol) server for NorthScore.

Built with TypeScript following [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) and [OpenAI Apps SDK](https://developers.openai.com/apps-sdk) standards.

## Prerequisites

- Node.js >= 22.17.0
- pnpm >= 10.0.0 ([Installation Guide](https://pnpm.io/installation))
- TypeScript >= 5.0.0

## Quick Setup

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your NorthScore API key:
   ```env
   NORTHSCORE_STATS_API_KEY=your_api_key_here
   ```

3. **Run the server:**
   ```bash
   pnpm dev
   ```

## Available Tools

- **`get_games`** - Fetch games and schedules from Canadian sports leagues (CEBL, CHL, CFL, CPL, Hoop Queens, U SPORTS)

## Development

```bash
pnpm dev          # Run with hot reload
pnpm build        # Compile TypeScript
pnpm start        # Run compiled version
pnpm type-check   # Type checking
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
```

## TODO

Future tools to implement:
- [ ] Standings
- [ ] Leaderboards
- [ ] Team stats
- [ ] Team vs team comparisons

## References

- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [OpenAI Apps SDK](https://developers.openai.com/apps-sdk)
