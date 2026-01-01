# Google Reviews Widget Setup Guide

This guide will help you set up Google Reviews to display on your website.

## Prerequisites

1. A Google Cloud Platform account
2. A Google Business Profile with reviews
3. A hosting platform that supports serverless functions (Vercel, Netlify, etc.)

## Step 1: Get Your Google Place ID

1. Go to [Google Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)
2. Search for your business name
3. Copy the Place ID (it looks like: `ChIJ...`)

Alternatively:
1. Open your Google Business Profile: https://g.co/kgs/Rza8aix
2. The Place ID can be found in the URL or by using Google's Place ID finder tool

## Step 2: Get Your Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click "Enable"
4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key
5. Restrict your API key (recommended):
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API"
   - Under "Website restrictions", add your domain

## Step 3: Configure the Code

### Update homeScript.js

Open `homeScript.js` and update the `GOOGLE_CONFIG` object:

```javascript
const GOOGLE_CONFIG = {
    placeId: 'YOUR_PLACE_ID_HERE', // Replace with your Place ID
    maxReviews: 5,
    apiEndpoint: '/api/google-reviews' // Update if using different hosting
};
```

## Step 4: Deploy Serverless Function

### Option A: Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy your project: `vercel`
3. Set environment variable:
   - Go to your Vercel dashboard
   - Navigate to your project > Settings > Environment Variables
   - Add: `GOOGLE_PLACES_API_KEY` with your API key value
4. Redeploy: `vercel --prod`

The function is already set up in `/api/google-reviews.js`

### Option B: Deploy to Netlify

1. Create a `netlify.toml` file in your project root:
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. Move the function:
   - Create `netlify/functions/` directory
   - Copy `api/google-reviews.js` to `netlify/functions/google-reviews.js`
   - Update the function to use Netlify's handler format (see below)

3. Set environment variable in Netlify dashboard:
   - Go to Site settings > Environment variables
   - Add: `GOOGLE_PLACES_API_KEY` with your API key

4. Update `homeScript.js`:
```javascript
apiEndpoint: '/.netlify/functions/google-reviews'
```

### Option C: Use Your Own Backend

If you have your own backend server, create an endpoint that:
- Accepts `placeId` as a query parameter
- Uses your Google Places API key (stored securely on the server)
- Returns the reviews data

Update `homeScript.js`:
```javascript
apiEndpoint: 'https://your-backend.com/api/google-reviews'
```

## Step 5: Test

1. Open your website
2. Navigate to the testimonials section
3. You should see your Google reviews loading automatically

## Troubleshooting

### Reviews not loading?

1. **Check browser console** for error messages
2. **Verify Place ID**: Make sure it's correct and your business has reviews
3. **Check API key**: Ensure it's enabled and has Places API access
4. **Verify serverless function**: Test the endpoint directly:
   ```
   https://your-domain.com/api/google-reviews?placeId=YOUR_PLACE_ID
   ```
5. **Check CORS**: If using a custom backend, ensure CORS headers are set

### Common Errors

- **"Missing placeId or API key"**: Environment variable not set correctly
- **"REQUEST_DENIED"**: API key restrictions or Places API not enabled
- **"INVALID_REQUEST"**: Place ID is incorrect
- **CORS errors**: Serverless function not deployed or endpoint URL incorrect

## Alternative: Using Third-Party Widgets

If you prefer not to set up a serverless function, you can use third-party widgets:

1. **Elfsight** (https://elfsight.com/google-reviews-widget/)
2. **Featurable** (https://featurable.com/)
3. **Shapo** (https://shapo.io/)

These services handle the API calls for you but may have usage limits on free plans.

## Security Notes

- Never expose your Google Places API key in client-side code
- Always use environment variables for API keys
- Restrict your API key to specific domains and APIs
- Monitor your API usage in Google Cloud Console

## Support

For issues with:
- **Google Places API**: Check [Google's documentation](https://developers.google.com/maps/documentation/places/web-service)
- **Serverless functions**: Check your hosting platform's documentation
- **Code issues**: Review browser console for specific error messages

