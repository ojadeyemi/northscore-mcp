/**
 * Environment configuration for Northscore MCP Server
 */

interface Config {
  northScoreApiKey: string;
  port: number;
  nodeEnv: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value ?? defaultValue!;
}

export const config: Config = {
  northScoreApiKey: getEnvVar('NORTHSCORE_STATS_API_KEY'),
  port: parseInt(getEnvVar('PORT', '3002'), 10),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
};

/**
 * Validate that all required environment variables are present
 */
export function validateConfig(): void {
  if (!config.northScoreApiKey) {
    throw new Error('NORTHSCORE_STATS_API_KEY environment variable is required');
  }
}
