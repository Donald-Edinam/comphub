# Environment Configuration

## Setup Instructions

### Development
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the API URL in `.env.local` if needed:
   ```
   VITE_API_BASE_URL=http://localhost:5000
   ```

### Production Deployment

#### Vercel
1. In your Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variable:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: Your production backend URL (e.g., `https://your-backend.herokuapp.com`)
   - **Environment**: Production

#### Netlify
1. In your Netlify dashboard, go to Site settings > Environment variables
2. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your production backend URL

#### Other Platforms
Set the environment variable `VITE_API_BASE_URL` to your backend URL.

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5000` | Yes |

## Notes

- All environment variables for Vite must be prefixed with `VITE_`
- Environment variables are embedded at build time
- Never commit `.env.local` or `.env.production` files to version control
- Use `.env.example` as a template for required variables