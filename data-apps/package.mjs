#!/usr/bin/env node
// Package a data app workspace in this folder into a .twbx for publishing to Tableau.
//
//   node data-apps/package.mjs superstore-customer-loyalty
//   -> data-apps/dist/Superstore Customer Loyalty.twbx
//
// The archive must hold the .twb, Packages/ and Resources/.agents/ at its ROOT (never nested
// under the app folder) or Tableau rejects it with "Package directory contains no extension
// .trex files under extensions/". Hidden files are skipped. Uses the system `zip` command.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const die = (msg) => { console.error(`✗ ${msg}`); process.exit(1); };

const app = process.argv[2];
if (!app) die('Usage: node data-apps/package.mjs <app-folder>');
const workspace = resolve(here, app);
if (!existsSync(workspace) || !statSync(workspace).isDirectory()) die(`No such app folder: ${workspace}`);

const twbs = readdirSync(workspace).filter((f) => f.endsWith('.twb'));
if (twbs.length !== 1) die(`Expected exactly one .twb in ${app}, found ${twbs.length}`);
const twb = twbs[0];

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  if (e.name.startsWith('.') && e.name !== '.agents') return [];
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : [p];
});

const packages = join(workspace, 'Packages');
if (!existsSync(packages)) die(`Missing Packages/ in ${app}`);
const files = walk(packages);
if (!files.some((f) => /\/extensions\/[^/]+\.trex$/.test(f))) die('No .trex under Packages/*/extensions/');
const agents = join(workspace, 'Resources', '.agents');
if (existsSync(agents)) files.push(...walk(agents));

const outDir = join(here, 'dist');
mkdirSync(outDir, { recursive: true });
const out = join(outDir, twb.replace(/\.twb$/, '.twbx'));
rmSync(out, { force: true });

// .twb first, then everything else, all paths relative to the workspace root.
const entries = [twb, ...files.map((f) => relative(workspace, f))];
execFileSync('zip', ['-q', '-X', out, ...entries], { cwd: workspace, stdio: 'inherit' });
console.log(`✓ Packaged ${entries.length} files into ${relative(process.cwd(), out)}`);
