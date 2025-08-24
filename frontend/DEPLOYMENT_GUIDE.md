# Frontend Deployment Guide

## Environment Variables Setup

Your frontend is configured to use environment variables for the backend URL. Here's how to set it up for different platforms:

### Vercel Deployment

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com`
   - Set environment to "Production" or "All"

2. **Or update `.env.production`:**
   ```bash
   VITE_API_BASE_URL=https://your-backend-url.com
   ```

### Netlify Deployment

1. **In Netlify Dashboard:**
   - Go to Site settings → Environment variables
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.com`

### Local Development

Already configured in `.env`:
```bash
VITE_API_BASE_URL=http://localhost:5000
```

## Common Backend URLs

- **Railway**: `https://your-app-name.up.railway.app`
- **Render**: `https://your-app-name.onrender.com`
- **Heroku**: `https://your-app-name.herokuapp.com`
- **Custom Domain**: `https://api.yourdomain.com`

## Troubleshooting

If deployment fails:
1. Check that `VITE_API_BASE_URL` is set in your deployment platform
2. Ensure the backend URL is accessible and includes `https://`
3. Verify the backend is deployed and running
4. Check browser console for CORS errors

## Testing

After deployment, check the browser console to see what URL the frontend is trying to connect to:
```javascript
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
```