// Environment configuration
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  NODE_ENV: import.meta.env.MODE || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Validate required environment variables
if (!config.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is required');
}

export default config;