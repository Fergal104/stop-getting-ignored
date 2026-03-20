import { loadConfig, loadJson, nextPostingSlots, saveJson, slugify, trimToLimit } from "./lib/runtime.mjs";

const config = await loadConfig();
const seeds = await loadJson(config.seed_file, {});
const queue = await loadJson(config.queue_file, []);

const activeItems = queue.filter((item) => item.status !== "posted");
const remainingSlots = Math.max(config.cadence.queue_size - activeItems.length, 0);

if (remainingSlots === 0) {
  console.log("Queue already has enough pending items.");
  process.exit(0);
}

const slots = nextPostingSlots({
  days: config.cadence.post_days,
  time: config.cadence.post_time,
  count: remainingSlots
});

const startIndex = queue.length;
const newItems = slots.map((slot, offset) => {
  const index = startIndex + offset;
  const hook = seeds.hooks[index % seeds.hooks.length];
  const observation = seeds.observations[index % seeds.observations.length];
  const lesson = seeds.lessons[index % seeds.lessons.length];
  const cta = seeds.cta_lines[index % seeds.cta_lines.length];
  const expansion = seeds.threads_expansions[index % seeds.threads_expansions.length];

  const baseCopy = `${hook}: ${observation}. ${lesson}`;
  const copyX = trimToLimit(baseCopy, config.limits.x);
  const copyThreads = trimToLimit(`${baseCopy} ${expansion} ${cta}`, config.limits.threads);
  const dayTag = slot.toISOString().slice(0, 10).replace(/-/g, "");

  return {
    id: `${slugify(config.brand_name)}-${dayTag}-${String(offset + 1).padStart(2, "0")}`,
    copy_x: copyX,
    copy_threads: copyThreads,
    scheduled_at: slot.toISOString(),
    status: "queued",
    posted_x_at: null,
    posted_threads_at: null,
    last_error: null
  };
});

await saveJson(config.queue_file, [...queue, ...newItems]);

console.log(`Generated ${newItems.length} queued post(s).`);

