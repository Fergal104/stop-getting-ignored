import path from "node:path";
import { ensureDir, loadConfig, loadJson, saveJson, stampNow } from "./lib/runtime.mjs";

let chromium;

try {
  ({ chromium } = await import("playwright"));
} catch {
  console.error("Playwright is not installed. Run .\\scripts\\npm.ps1 install");
  process.exit(1);
}
const config = await loadConfig();
const queue = await loadJson(config.queue_file, []);
await ensureDir(config.profile_dir);
await ensureDir(config.log_dir);

function dueItems(items) {
  const now = Date.now();
  return items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => ["queued", "partial"].includes(item.status))
    .filter(({ item }) => new Date(item.scheduled_at).getTime() <= now)
    .sort((a, b) => new Date(a.item.scheduled_at) - new Date(b.item.scheduled_at));
}

const next = dueItems(queue)[0];

if (!next) {
  console.log("No queued post is due yet.");
  process.exit(0);
}

const context = await chromium.launchPersistentContext(config.profile_dir, {
  headless: false,
  viewport: { width: 1440, height: 960 }
});

async function capture(page, prefix) {
  const name = `${prefix}-${Date.now()}.png`;
  const target = path.join(process.cwd(), config.log_dir, name);
  await page.screenshot({ path: target, fullPage: true });
  return target;
}

async function fillText(locator, page, text) {
  await locator.click();
  try {
    await locator.fill(text);
  } catch {
    await page.keyboard.insertText(text);
  }
}

async function postToX(text) {
  const page = await context.newPage();
  await page.goto("https://x.com/compose/post", { waitUntil: "domcontentloaded" });

  if (page.url().includes("/login")) {
    throw new Error("X session is not logged in.");
  }

  const composer = page.locator('[data-testid="tweetTextarea_0"], div[role="textbox"][data-testid="tweetTextarea_0"]').first();
  await composer.waitFor({ timeout: 15000 });
  await fillText(composer, page, text);

  const button = page.locator('[data-testid="tweetButtonInline"], [data-testid="tweetButton"]').first();
  await button.waitFor({ timeout: 15000 });
  await button.click();
  await page.waitForTimeout(4000);
  await page.close();
}

async function postToThreads(text) {
  const page = await context.newPage();
  await page.goto("https://www.threads.net/", { waitUntil: "domcontentloaded" });

  const loginLink = await page.getByRole("link", { name: /^Log in$/ }).count();
  if (loginLink > 0) {
    throw new Error("Threads session is not logged in.");
  }

  const createButton = page.getByRole("button", { name: /^Create$/ }).first();
  await createButton.waitFor({ timeout: 15000 });
  await createButton.click();

  const composer = page.locator('textarea, div[role="textbox"], div[contenteditable="true"]').first();
  await composer.waitFor({ timeout: 15000 });
  await fillText(composer, page, text);

  const postButton = page.getByRole("button", { name: /^Post$/ }).last();
  await postButton.waitFor({ timeout: 15000 });
  await postButton.click();
  await page.waitForTimeout(4000);
  await page.close();
}

const queueItem = queue[next.index];

try {
  if (!queueItem.posted_x_at) {
    await postToX(queueItem.copy_x);
    queueItem.posted_x_at = stampNow();
  }

  if (!queueItem.posted_threads_at) {
    await postToThreads(queueItem.copy_threads);
    queueItem.posted_threads_at = stampNow();
  }

  queueItem.status = "posted";
  queueItem.last_error = null;
  await saveJson(config.queue_file, queue);
  console.log(`Posted queue item ${queueItem.id}.`);
} catch (error) {
  queueItem.last_error = String(error.message || error);
  queueItem.status = queueItem.posted_x_at || queueItem.posted_threads_at ? "partial" : "queued";

  try {
    const page = context.pages()[context.pages().length - 1];
    if (page) {
      const screenshot = await capture(page, "post-failure");
      queueItem.last_error = `${queueItem.last_error} Screenshot: ${screenshot}`;
    }
  } catch {
    // Ignore screenshot failures and preserve the original error.
  }

  await saveJson(config.queue_file, queue);
  throw error;
} finally {
  await context.close();
}
