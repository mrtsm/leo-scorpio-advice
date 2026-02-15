#!/usr/bin/env node
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.url.replace("file://", ""), "..", "..");

const log = (label, message) => {
  process.stdout.write(`\n[${label}] ${message}\n`);
};

const run = (cmd) => {
  log("cmd", cmd);
  try {
    const output = execSync(cmd, { cwd: projectRoot, stdio: "pipe" }).toString();
    log("ok", output.trim() || "(no output)");
  } catch (error) {
    log("error", error.stdout?.toString() || error.message);
    process.exitCode = 1;
  }
};

log("QA", "Running lint + semantic checks");
run("npm run lint");

const html = readFileSync(resolve(projectRoot, "index.html"), "utf8");
if (/TODO|FIXME/i.test(html)) {
  log("warn", "Found TODO/FIXME markers in HTML");
  process.exitCode = 1;
} else {
  log("QA", "No TODO/FIXME markers detected");
}

log("QA", "done");
