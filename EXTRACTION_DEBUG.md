# Extraction Status Debugging Guide

## What Changed

### 1. Added Status Tracking
- Items now have `extractionStatus` field: `'pending' | 'extracting' | 'success' | 'failed'`
- Items now have `extractionError` field to show specific error messages

### 2. Visual Status Indicators
Each item card now shows:
- 🔄 **Blue spinner** - "Extracting..." (in progress)
- ✅ **Green checkmark** - "Extracted" (success)
- ❌ **Red X** - "Failed: [error message]" (failed)
- ⚠️ **Yellow alert** - "Pending" (queued)

### 3. Enhanced Logging
Console logs now show:
- 🔄 Starting extraction
- ✅ Successful extraction with content length
- ❌ Failed extraction with error details
- Duration in milliseconds

## How to Debug

### Step 1: Open Browser Console
1. Start dev server: `npm run dev`
2. Open browser to `http://localhost:3000`
3. Open DevTools (F12 or Cmd+Option+I)
4. Go to Console tab

### Step 2: Check Terminal Logs
The API runs server-side, so check your terminal where `npm run dev` is running.

### Step 3: Add a URL
1. Create or open a workspace
2. Click "Add Link / PDF"
3. Paste a URL (try these):
   - ✅ Simple site: `https://example.com`
   - ✅ Blog: `https://blog.google/`
   - ❌ Protected: `https://www.nature.com/articles/s41571-025-01105-y`

### Step 4: Watch the Logs

**Browser Console (Client-side):**
```
🔄 Starting extraction for: https://example.com
✅ Extraction successful: {titleLength: 13, contentLength: 1256}
```

**Terminal (Server-side):**
```
🔄 [Extract API] Starting extraction for: https://example.com
✅ [Extract API] Fetch successful, parsing HTML...
✅ [Extract API] Extraction complete: {titleLength: 13, contentLength: 1256, duration: '234ms'}
```

### Step 5: Check Item Card
The item card will show the status below the domain name.

## Common Issues

### Issue: "Failed: Failed to fetch URL: 403"
**Cause:** Website blocks scrapers
**Solution:** Site has anti-bot protection (like Nature.com)

### Issue: "Failed: Network error"
**Cause:** CORS or network issue
**Solution:** Check if URL is accessible

### Issue: "Extracted" but content is empty
**Cause:** Content selectors didn't match the page structure
**Solution:** The site might use JavaScript to load content (needs headless browser)

### Issue: No status showing
**Cause:** Old items in localStorage don't have status field
**Solution:** Clear localStorage or add new items

## Testing URLs

### ✅ Should Work:
- `https://example.com` - Simple HTML
- `https://en.wikipedia.org/wiki/Web_scraping` - Wikipedia
- `https://httpbin.org/html` - Test HTML page

### ❌ Likely to Fail:
- `https://www.nature.com/articles/*` - Paywall + anti-bot
- `https://twitter.com/*` - Requires JavaScript
- `https://www.linkedin.com/*` - Login required

## Next Steps

If extraction is failing for important sites, consider:
1. **Jina AI Reader API** - Free service that handles JavaScript and paywalls
2. **Puppeteer** - Headless browser for JavaScript-heavy sites
3. **Manual paste** - Let users paste content directly
