const SITE_URL = process.env.SITE_URL || 'https://enochakinpeluportfolio.vercel.app';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cgvtndympbpkslwyvrqo.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

function escapeHtml(value) {
  return String(value || '')
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHtml({ title, description, image, url }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description).slice(0, 160);
  const safeUrl = escapeHtml(url);
  const imageTag = image
    ? `<meta property="og:image" content="${escapeHtml(image)}" />\n    <meta name="twitter:image" content="${escapeHtml(image)}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    ${imageTag}
    <meta http-equiv="refresh" content="0;url=${safeUrl}" />
    <script>window.location.replace("${safeUrl}");</script>
  </head>
  <body>
    <p>Redirecting to <a href="${safeUrl}">${safeTitle}</a>…</p>
  </body>
</html>`;
}

function sendPreview(res, html, location) {
  if (typeof res.writeHead === 'function') {
    res.writeHead(302, {
      Location: location,
      'Content-Type': 'text/html; charset=utf-8',
    });
    res.end(html);
  } else {
    res.status(302);
    res.setHeader('Location', location);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  }
}

module.exports = async (req, res) => {
  if (!SUPABASE_ANON_KEY) {
    res.status(500).send('Missing Supabase anon key');
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const slug = url.searchParams.get('slug');
  const requestUrl = `${SITE_URL}${url.pathname}${url.search}`;

  if (!slug) {
    sendPreview(res, renderHtml({
      title: 'Blog | Akinpelu Enoch',
      description: 'Articles on technical project management, digital transformation, and software delivery.',
      url: requestUrl,
    }), requestUrl);
    return;
  }

  const queryUrl = `${SUPABASE_URL}/rest/v1/posts?select=title,excerpt,cover_image_url,slug&slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
  const response = await fetch(queryUrl, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    res.status(response.status).send('Failed to fetch post');
    return;
  }

  const data = await response.json();
  const post = Array.isArray(data) ? data[0] : null;

  if (!post) {
    sendPreview(res, renderHtml({
      title: 'Article not found | Akinpelu Enoch',
      description: 'This article does not exist or is no longer available.',
      url: `${SITE_URL}/blog/index.html`,
    }), `${SITE_URL}/blog/index.html`);
    return;
  }

  const pageUrl = `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(post.slug)}`;
  sendPreview(res, renderHtml({
    title: `${post.title} | Akinpelu Enoch`,
    description: post.excerpt || '',
    image: post.cover_image_url || undefined,
    url: requestUrl,
  }), pageUrl);
};
