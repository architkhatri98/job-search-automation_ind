'use strict';

// Location filter. Configure allowed cities via LOCATION_FILTER (comma-separated).
// LOCATION_BLOCKLIST always drops. Remote/unknown always pass.
// Configured for Indian job market.
// Example .env entry:
//   LOCATION_FILTER=bangalore,hyderabad,pune,mumbai

const parseList = (value) => (value || '')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

const ALLOW = parseList(process.env.LOCATION_FILTER);
const BLOCK = parseList(process.env.LOCATION_BLOCKLIST);

// Matches locations that are clearly remote/flexible.
// "India" alone (no city) means distributed/nationwide, keep.
const REMOTE = /\bremote\b|work from home|\bwfh\b|\banywhere\b|distributed|india[- ]only|pan[- ]india/i;

// "India" only when the location isn't also naming a specific city
// (e.g. "India" alone = keep; "Bangalore, Karnataka, India" = drop if not in allow list)
function looksNationwide(loc) {
  if (!/india|nationwide|pan[- ]india/i.test(loc)) return false;
  return !/,/.test(loc);
}

function matchesAny(loc, list) {
  const lower = loc.toLowerCase();
  return list.some((term) => lower.includes(term));
}

/**
 * Returns true if the job location passes the filter.
 * Blank/unknown locations pass through (scorer handles ambiguity).
 */
function isLocationAllowed(location) {
  const loc = (location || '').trim();
  if (!loc) return true;

  if (ALLOW.length && matchesAny(loc, ALLOW)) return true;
  if (REMOTE.test(loc)) return true;
  if (looksNationwide(loc)) return true;
  if (/^(hybrid|in-office)$/i.test(loc)) return true;

  if (BLOCK.length && matchesAny(loc, BLOCK)) return false;

  // No allow list configured, pass everything through.
  if (!ALLOW.length) return true;

  return false;
}

module.exports = { isLocationAllowed };
