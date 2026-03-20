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
  headless: false,
  viewport: { width: 1440, height: 960 }
});

const xPage = await context.newPage();
await xPage.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded" });

const threadsPage = await context.newPage();
await threadsPage.goto("https://www.threads.net/", { waitUntil: "domcontentloaded" });

console.log("Log in to X and Threads in the opened browser windows.");
console.log("Press Enter in this terminal after both sessions are fully logged in.");

await new Promise((resolve) => {
  process.stdin.resume();
  process.stdin.once("data", resolve);
});

await context.close();
console.log("Persistent browser profile saved.");

