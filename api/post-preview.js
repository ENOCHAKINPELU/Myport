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

function renderHtml({ title, description, image, pageUrl, requestUrl }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description).slice(0, 160);
  const safePageUrl = escapeHtml(pageUrl);
  const safeRequestUrl = escapeHtml(requestUrl);
  const imageTag = image
    ? `<meta property="og:image" content="${escapeHtml(image)}" />\n    <meta name="twitter:image" content="${escapeHtml(image)}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}" />
    <link rel="canonical" href="${safeRequestUrl}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDescription}" />
    <meta property="og:url" content="${safeRequestUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDescription}" />
    ${imageTag}
    <meta http-equiv="refresh" content="0;url=${safePageUrl}" />
    <script>window.location.replace("${safePageUrl}");</script>
  </head>
  <body>
    <p>Redirecting to <a href="${safePageUrl}">${safeTitle}</a>…</p>
  </body>
</html>`;
}

module.exports = async (req, res) => {
  if (!SUPABASE_ANON_KEY) {
    res.status(500).send('Missing Supabase anon key');
    return;
  }

  const requestHost = req.headers.host ? `https://${req.headers.host}` : SITE_URL;
  const origin = process.env.SITE_URL || requestHost;
  const url = new URL(req.url, origin);
  const slug = url.searchParams.get('slug');
  const requestUrl = `${origin}${url.pathname}${url.search}`;

  if (!slug) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderHtml({
      title: 'Blog | Akinpelu Enoch',
      description: 'Articles on technical project management, digital transformation, and software delivery.',
      requestUrl,
      pageUrl: requestUrl,
    }));
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
    res.status(404).setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderHtml({
      title: 'Article not found | Akinpelu Enoch',
      description: 'This article does not exist or is no longer available.',
      requestUrl: `${SITE_URL}/blog/index.html`,
      pageUrl: `${SITE_URL}/blog/index.html`,
    }));
    return;
  }

  const pageUrl = `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(post.slug)}`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(renderHtml({
    title: `${post.title} | Akinpelu Enoch`,
    description: post.excerpt || '',
    image: post.cover_image_url || undefined,
    requestUrl,
    pageUrl,
  }));
};
