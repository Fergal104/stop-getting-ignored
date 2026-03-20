import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DAY_INDEX = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6
};

export async function loadConfig() {
  const configPath = path.join(ROOT, "config", "app.json");
  return JSON.parse(await fs.readFile(configPath, "utf8"));
}

export async function loadJson(filePath, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(path.join(ROOT, filePath), "utf8"));
  } catch (error) {
    if (error.code === "ENOENT" && fallback !== null) {
      return fallback;
    }
    throw error;
  }
}

export async function saveJson(filePath, value) {
  const absolutePath = path.join(ROOT, filePath);
  await fs.mkdir(path.dirname(absolutePath), { recursive: true });
  await fs.writeFile(absolutePath, JSON.stringify(value, null, 2) + "\n", "utf8");
}

export async function ensureDir(dirPath) {
  await fs.mkdir(path.join(ROOT, dirPath), { recursive: true });
}

export function nextPostingSlots({ days, time, count }) {
  const [hours, minutes] = time.split(":").map(Number);
  const allowedDays = new Set(days.map((day) => DAY_INDEX[day]));
  const slots = [];
  let cursor = new Date();
  cursor.setSeconds(0, 0);

  while (slots.length < count) {
    cursor.setDate(cursor.getDate() + 1);
    cursor.setHours(hours, minutes, 0, 0);

    if (!allowedDays.has(cursor.getDay())) {
      continue;
    }

    slots.push(new Date(cursor));
  }

  return slots;
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function trimToLimit(value, limit) {
  if (value.length <= limit) {
    return value;
  }

  return value.slice(0, limit - 1).trimEnd() + "…";
}

export function stampNow() {
  return new Date().toISOString();
}
