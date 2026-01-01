# Quick Setup: Vercel API Service for Google Reviews

Your main website is hosted on GitHub Pages, but GitHub Pages can't run serverless functions. This guide shows you how to deploy a separate API service to Vercel (free) that will fetch Google Reviews for your site.

## Quick Start

1. **Deploy the API service to Vercel:**
   - Go to the `api-service` folder
   - Follow the instructions in `api-service/README.md`
   - You'll get a URL like: `https://your-api.vercel.app`

2. **Update your website:**
   - Open `homeScript.js`
   - Find line 14: `apiEndpoint: 'https://your-api-service.vercel.app/api/google-reviews'`
   - Replace `your-api-service` with your actual Vercel project name
   - Save and commit to GitHub

3. **That's it!** Your reviews should now load automatically.

## What Was Changed

- ✅ Created standalone `api-service` folder with Vercel deployment files
- ✅ Updated `homeScript.js` to use external Vercel API endpoint
- ✅ Improved error handling for better debugging
- ✅ Enhanced API function to request more fields from Google

## Files Created

- `api-service/` - Standalone Vercel project
  - `api/google-reviews.js` - The API function
  - `package.json` - Node.js configuration
  - `vercel.json` - Vercel configuration
  - `README.md` - Detailed deployment instructions
  - `.gitignore` - Git ignore file

## Next Steps

1. Read `api-service/README.md` for detailed deployment instructions
2. Deploy to Vercel (takes ~5 minutes)
3. Update the `apiEndpoint` in `homeScript.js` with your Vercel URL
4. Test your website - reviews should load automatically!

## Need Help?

- Check `api-service/README.md` for troubleshooting
- Verify your Google Places API key is set in Vercel
- Test the API endpoint directly in your browser
- Check browser console for error messages

