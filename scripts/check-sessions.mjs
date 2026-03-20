import { loadConfig, ensureDir } from "./lib/runtime.mjs";

let chromium;

try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run .\\scripts\\npm.ps1 install");
  process.exit(1);
}

const config = await loadConfig();
await ensureDir(config.profile_dir);

const context = await chromium.launchPersistentContext(config.profile_dir, {
  headless: true,
  viewport: { width: 1280, height: 900 }
});

const statuses = [];

async function checkX() {
  const page = await context.newPage();
  await page.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded" });
  const loggedIn = !page.url().includes("/login");
  statuses.push(`X: ${loggedIn ? "ready" : "login required"}`);
  await page.close();
  return loggedIn;
}

async function checkThreads() {
  const page = await context.newPage();
  await page.goto("https://www.threads.net/", { waitUntil: "domcontentloaded" });
  const loginLink = await page.getByRole("link", { name: /^Log in$/ }).count();
  const loggedIn = loginLink === 0;
  statuses.push(`Threads: ${loggedIn ? "ready" : "login required"}`);
  await page.close();
  return loggedIn;
}

const xReady = await checkX();
const threadsReady = await checkThreads();

await context.close();

for (const status of statuses) {
  console.log(status);
}

if (!xReady || !threadsReady) {
  process.exit(1);
}

