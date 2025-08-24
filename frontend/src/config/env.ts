// Environment configuration
export const config = {
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    NODE_ENV: import.meta.env.MODE || 'development',
    IS_PRODUCTION: import.meta.env.PROD,
    IS_DEVELOPMENT: import.meta.env.DEV,
} as const;

// Debug logging (remove in production)
console.log('Environment Debug:', {
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    Final_API_URL: config.API_BASE_URL
});

// Validate required environment variables
if (!config.API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL environment variable is required');
}

export default config;