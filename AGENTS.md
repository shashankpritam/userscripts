# AGENTS.md

## Project Overview

A collection of browser userscripts (Tampermonkey/Greasemonkey-compatible). Each `.js` file is a self-contained userscript with a UserScript metadata block.

## Repository Structure

- Root-level `.js` files — each is an independent userscript
- `README.org` — brief project description (Emacs Org format)
- `LICENSE` — MIT

No build system, no dependencies, no package manager. Files are installed directly into a userscript manager extension.

## Architecture

Each userscript follows this pattern:

1. **UserScript metadata block** (`// ==UserScript==` ... `// ==/UserScript==`) — defines `@name`, `@match`, `@grant`, `@version`
2. **IIFE wrapper** — `(function() { 'use strict'; ... })();` — isolates scope
3. **Feature sections** — marked with `// ── Section Name ──` comment dividers, each modifying the DOM independently

There is no shared code between scripts. Each script is fully standalone.

## Existing Script: HN_QoL.js

Targets `https://news.ycombinator.com/*`. Features are applied via injected `<style>` element and DOM queries:

| Feature | Mechanism |
|---|---|
| Typography/sizing | Injected `<style>` overriding `table#hnmain` and `.commtext` |
| New comment highlighting | `.comtr` scan for `age` sibling containing "new", adds `.hnew` class |
| Comment collapse on header click | `.comhead` click handler delegates to HN's native `.togg` toggle |
| Direct links (skip redirect) | Rewrites `//`-prefixed and `ycombinator.com/l?` URLs to their real targets |

## Conventions

- Each script's `@match` header defines its target site(s)
- `@grant none` — scripts run in page context, no GM_* APIs
- Feature sections are independent; order within the IIFE doesn't matter since they all run after DOM load
- CSS uses `!important` overrides to win against site styles
- Error handling is minimal (e.g., `try/catch` around URL parsing silently swallows failures)

## Adding a New Script

1. Create a new `.js` file at the repo root
2. Include the standard UserScript metadata block with `@name`, `@match`, `@grant none`, `@version`
3. Wrap everything in an IIFE with `'use strict'`
4. Use the `// ── Section Name ──` comment style to separate features

## Testing

No automated tests. Scripts are tested manually in the browser by installing into Tampermonkey/Greasemonkey and visiting the target site.
