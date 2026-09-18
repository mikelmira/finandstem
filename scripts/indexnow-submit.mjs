/**
 * Submit changed URLs to IndexNow (Bing, Yandex, et al.) so newly published or
 * updated pages get crawled quickly, without re-submitting the whole site.
 *
 * By default this reads the live sitemap, compares each URL's <lastmod> against
 * the last submission (stored in scripts/.indexnow-state.json), and submits
 * only the URLs that are new or whose lastmod changed. Submitting only what
 * changed avoids inviting crawlers to re-fetch the entire site on every deploy,
 * which drives up Vercel ISR read costs.
 *
 * Usage:
 *   pnpm indexnow                 # submit only URLs changed since last run
 *   pnpm indexnow --all           # submit every URL in the sitemap
 *   pnpm indexnow <url> [url...]  # submit specific URLs (must be on this host)
 *   SITE_URL=https://finandstem.com pnpm indexnow
 *
 * Run this AFTER a content deploy is live, so the sitemap reflects what is
 * actually deployed. The IndexNow key is public by design (hosted openly at
 * /<key>.txt for ownership verification), so it is safe in source.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const KEY = "b6f77d3236bb4e1bb58da0e009c11d15";
const SITE_URL = (process.env.SITE_URL ?? "https://finandstem.com").replace(/\/$/, "");
const HOST = new URL(SITE_URL).host;
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
const STATE_FILE = join(dirname(fileURLToPath(import.meta.url)), ".indexnow-state.json");
const MAX_PER_REQUEST = 10000; // IndexNow's per-request URL cap

/** Fetch the sitemap and return a map of url -> lastmod (lastmod may be ""). */
async function fetchSitemap() {
  const res = await fetch(SITEMAP_URL, { headers: { "User-Agent": "FinAndStem-IndexNow/1.0" } });
  if (!res.ok) throw new Error(`Sitemap fetch failed: HTTP ${res.status} for ${SITEMAP_URL}`);
  const xml = await res.text();
  const map = {};
  for (const block of xml.match(/<url>[\s\S]*?<\/url>/g) ?? []) {
    const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1]?.trim();
    if (!loc || !loc.startsWith(SITE_URL)) continue;
    const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1]?.trim() ?? "";
    map[loc] = lastmod;
  }
  return map;
}

function loadState() {
  try {
    return JSON.parse(readFileSync(STATE_FILE, "utf8"));
  } catch {
    return null;
  }
}

function saveState(map) {
  writeFileSync(STATE_FILE, JSON.stringify(map, null, 2) + "\n");
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

async function submitAll(urls) {
  for (let i = 0; i < urls.length; i += MAX_PER_REQUEST) {
    const batch = urls.slice(i, i + MAX_PER_REQUEST);
    const { status, text } = await submit(batch);
    if (status !== 200 && status !== 202) {
      console.error(`✗ IndexNow returned HTTP ${status}${text ? `: ${text}` : ""}`);
      if (status === 403) {
        console.error(
          "  403 usually means the key file isn't verified yet, or the host\n" +
            "  doesn't match the key file. Confirm ownership in Bing Webmaster Tools.",
        );
      }
      process.exit(1);
    }
    console.log(`✓ IndexNow accepted ${batch.length} URLs (HTTP ${status}).`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const explicitUrls = args.filter((a) => a.startsWith("http"));

  // Explicit URLs: submit exactly those, don't touch the state file.
  if (explicitUrls.length > 0) {
    const onHost = explicitUrls.filter((u) => u.startsWith(SITE_URL));
    if (onHost.length === 0) throw new Error(`No URLs on ${HOST} in the arguments.`);
    console.log(`Submitting ${onHost.length} explicit URL(s) to IndexNow…`);
    await submitAll(onHost);
    return;
  }

  const current = await fetchSitemap();
  const currentUrls = Object.keys(current);
  if (currentUrls.length === 0) throw new Error(`No ${HOST} URLs found in ${SITEMAP_URL}`);

  // Seed mode: record the current sitemap as the baseline without submitting,
  // so a later default run only submits what changes after this point.
  if (args.includes("--seed")) {
    saveState(current);
    console.log(`Seeded baseline with ${currentUrls.length} URLs, nothing submitted.`);
    return;
  }

  const forceAll = args.includes("--all");
  const state = forceAll ? null : loadState();

  let toSubmit;
  if (!state) {
    toSubmit = currentUrls;
    console.log(
      forceAll
        ? `Submitting all ${toSubmit.length} URLs (--all)…`
        : `No previous state, submitting all ${toSubmit.length} URLs (first run)…`,
    );
  } else {
    toSubmit = currentUrls.filter((u) => state[u] !== current[u]); // new or changed lastmod
    if (toSubmit.length === 0) {
      console.log("Nothing changed since the last submission. Skipping.");
      saveState(current); // keep state in sync with any URL removals
      return;
    }
    console.log(`Submitting ${toSubmit.length} changed URL(s) of ${currentUrls.length} total…`);
  }

  await submitAll(toSubmit);
  saveState(current);
  console.log(`State saved to ${STATE_FILE.replace(process.cwd() + "/", "")}.`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});
