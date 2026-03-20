import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig } from "./lib/runtime.mjs";

const ROOT = process.cwd();

const TARGETS = [
  "README.md",
  "EXECUTION_BOARD.md",
  "content/email-sequence.md",
  "ops/automation-logic.md",
  "ops/brand-kit.md",
  "ops/launch-checklist.md",
  "ops/prompts.md",
  "product/client-reply-kit.md",
  "product/gumroad-product-page.md",
  "site/index.html",
  "site/free/21-first-lines.txt"
];

const config = await loadConfig();

const replacements = [
  {
    pattern: /https:\/\/gumroad\.com\/l\/replyfoundry-client-reply-kit/g,
    value: config.gumroad_url
  },
  {
    pattern: /\[insert Gumroad link\]/g,
    value: config.gumroad_url
  },
  {
    pattern: /ReplyFoundry Client Reply Kit/g,
    value: config.brand_name
  },
  {
    pattern: /Client Reply Kit/g,
    value: config.brand_name
  },
  {
    pattern: /ReplyFoundry/g,
    value: config.brand_name
  }
];

for (const target of TARGETS) {
  const absolutePath = path.join(ROOT, target);
  let content = await fs.readFile(absolutePath, "utf8");

  for (const replacement of replacements) {
    content = content.replace(replacement.pattern, replacement.value);
  }

  await fs.writeFile(absolutePath, content, "utf8");
}

console.log(`Applied brand config to ${TARGETS.length} files.`);

