// Supabase Edge Function: post-preview
//
// Returns a small server-rendered HTML page with per-post Open Graph /
// Twitter Card meta tags, then redirects browsers to the real article on
// the portfolio site. Social media crawlers (which don't execute JS) read
// the meta tags from this response, so shared links show the article's
// title, excerpt, and cover image instead of generic blog branding.
//
// Share links look like:
//   https://<project-ref>.supabase.co/functions/v1/post-preview?slug=my-post
//
// Deploy with: supabase functions deploy post-preview --no-verify-jwt
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SITE_URL = "https://enochakinpelu.github.io/Myport";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!
);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function render(options: {
  title: string;
  description: string;
  image?: string;
  url: string;
}): string {
  const title = escapeHtml(options.title);
  // Collapse newlines/tabs to a single space and trim to 160 chars so the
  // value never contains literal line breaks that would break the attribute.
  const rawDesc = options.description.replace(/[\r\n\t]+/g, " ").trim().slice(0, 160);
  const description = escapeHtml(rawDesc);
  const url = escapeHtml(options.url);
  const imageTag = options.image
    ? `<meta property="og:image" content="${escapeHtml(options.image)}" />\n    <meta name="twitter:image" content="${escapeHtml(options.image)}" />`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    ${imageTag}
    <meta http-equiv="refresh" content="0; url=${url}" />
    <script>window.location.replace("${url}");</script>
  </head>
  <body>
    <p>Redirecting to <a href="${url}">${title}</a>&hellip;</p>
  </body>
</html>`;
}

Deno.serve(async (req) => {
  const slug = new URL(req.url).searchParams.get("slug");

  if (!slug) {
    return new Response(render({
      title: "Blog | Akinpelu Enoch",
      description: "Articles on technical project management, digital transformation, and software delivery.",
      url: `${SITE_URL}/blog/index.html`,
    }), { headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, cover_image_url, slug")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    return new Response(render({
      title: "Article not found | Akinpelu Enoch",
      description: "This article does not exist or is no longer available.",
      url: `${SITE_URL}/blog/index.html`,
    }), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }

  return new Response(render({
    title: `${post.title} | Akinpelu Enoch`,
    description: post.excerpt || "",
    image: post.cover_image_url || undefined,
    url: `${SITE_URL}/blog/post.html?slug=${encodeURIComponent(post.slug)}`,
  }), { headers: { "Content-Type": "text/html; charset=utf-8" } });
});
