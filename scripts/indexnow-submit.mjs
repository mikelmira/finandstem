/**
 * Submit the site's sitemap URLs to IndexNow (Bing, Yandex, et al.) so newly
 * published or changed pages get crawled quickly.
 *
 * Usage:
 *   pnpm indexnow                 # submit the live production sitemap
 *   SITE_URL=https://finandstem.com pnpm indexnow
 *
 * Run this AFTER a content deploy has gone live — it reads the live sitemap,
 * so the URLs it submits reflect what is actually deployed (running it inside
 * the build would submit the pre-deploy sitemap and miss brand-new pages).
 *
 * The IndexNow key is public by design: it is hosted openly at
 * https://finandstem.com/<key>.txt so the search engines can verify ownership.
 * It is therefore safe to keep here in source.
 */

const KEY = "b6f77d3236bb4e1bb58da0e009c11d15";
const SITE_URL = (process.env.SITE_URL ?? "https://finandstem.com").replace(/\/$/, "");
const HOST = new URL(SITE_URL).host; // e.g. finandstem.com
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

async function fetchSitemapUrls() {
  const res = await fetch(SITEMAP_URL, { headers: { "User-Agent": "FinAndStem-IndexNow/1.0" } });
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status} for ${SITEMAP_URL}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // Only submit URLs on this exact host, deduped, order preserved.
  const seen = new Set();
  const urls = [];
  for (const u of locs) {
    if (u.startsWith(SITE_URL) && !seen.has(u)) {
      seen.add(u);
      urls.push(u);
    }
  }
  return urls;
}

async function submit(urlList) {
  const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  const text = await res.text().catch(() => "");
  return { status: res.status, text };
}

async function main() {
  const urls = await fetchSitemapUrls();
  if (urls.length === 0) throw new Error(`No ${HOST} URLs found in ${SITEMAP_URL}`);
  console.log(`Submitting ${urls.length} URLs from ${SITEMAP_URL} to IndexNow…`);
  const { status, text } = await submit(urls);
  if (status === 200 || status === 202) {
    console.log(`✓ IndexNow accepted the submission (HTTP ${status}).`);
    return;
  }
  console.error(`✗ IndexNow returned HTTP ${status}${text ? `: ${text}` : ""}`);
  if (status === 403) {
    console.error(
      "  403 usually means the key file isn't verified yet, or the host doesn't\n" +
        "  match the key file's host. Confirm the site is verified in Bing Webmaster Tools.",
    );
  }
  process.exit(1);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
