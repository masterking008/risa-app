import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    console.log('🔄 [Extract API] Starting extraction for:', url);
    const startTime = Date.now();

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });

    if (!response.ok) {
      console.error('❌ [Extract API] Fetch failed:', response.status, response.statusText);
      return NextResponse.json({ error: `Failed to fetch URL: ${response.statusText}` }, { status: response.status });
    }

    console.log('✅ [Extract API] Fetch successful, parsing HTML...');

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $('script, style, nav, footer, header, .advertisement, .ads').remove();

    // Extract title with multiple fallbacks
    const title = $('title').text() || 
                  $('meta[property="og:title"]').attr('content') ||
                  $('h1').first().text() || 
                  'Untitled';

    // Extract main content with better selectors
    let content = $('article, main, [role="main"], .article-content, .post-content, .content, #content')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    // Fallback to body if no content found
    if (!content || content.length < 100) {
      content = $('body').text().replace(/\s+/g, ' ').trim();
    }

    content = content.slice(0, 10000); // Limit to 10k chars

    const duration = Date.now() - startTime;
    console.log('✅ [Extract API] Extraction complete:', { 
      titleLength: title.length, 
      contentLength: content.length,
      duration: `${duration}ms`
    });

    return NextResponse.json({ 
      title: title.trim(),
      content: content || 'No content extracted'
    });

  } catch (error) {
    console.error('❌ [Extract API] Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to extract content',
      title: 'Error',
      content: 'Could not extract content from this URL'
    }, { status: 500 });
  }
}
