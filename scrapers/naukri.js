'use strict';

const { sleep, safeFetch, stripHtml } = require('../lib/utils');
const { matchesSearchTerms } = require('../lib/scraper-utils');
const { SCRAPER_DELAY_MS, MAX_DESCRIPTION_LENGTH } = require('../config/constants');

// Naukri.com scraper for Indian job market.
// Uses the public Naukri job listing pages (no auth required).
// Searches are driven by SEARCH_TERMS from the profile's companies.js.

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const BASE_URL = 'https://www.naukri.com';

const EXPERIENCE_MIN = parseInt(process.env.NAUKRI_EXPERIENCE_MIN, 10) || 4;
const EXPERIENCE_MAX = parseInt(process.env.NAUKRI_EXPERIENCE_MAX, 10) || 10;

// Search terms for Naukri — uses the same terms as other scrapers
const { SEARCH_TERMS } = require('../config/companies');

function buildSearchUrl(term) {
  const slug = term.toLowerCase().replace(/\s+/g, '-');
  return `${BASE_URL}/${slug}-jobs-${EXPERIENCE_MIN}-to-${EXPERIENCE_MAX}?k=${encodeURIComponent(term)}&experience=${EXPERIENCE_MIN}&nignbevent_src=jobsearchDeskGNB`;
}

function extractJobsFromHtml(html) {
  const jobs = [];
  // Naukri embeds job data in script tags as JSON-LD or in data attributes
  const ldMatches = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];

  for (const ldMatch of ldMatches) {
    try {
      const data = JSON.parse(ldMatch[1]);
      const items = Array.isArray(data) ? data : data['@graph'] || [data];

      for (const item of items) {
        if (item['@type'] !== 'JobPosting') continue;

        const title = item.title || '';
        if (!matchesSearchTerms(title)) continue;

        const org = item.hiringOrganization || {};
        const locations = Array.isArray(item.jobLocation) ? item.jobLocation : item.jobLocation ? [item.jobLocation] : [];
        const locationStr = locations
          .map((loc) => {
            const addr = loc.address || {};
            return [addr.addressLocality, addr.addressRegion].filter(Boolean).join(', ');
          })
          .filter(Boolean)
          .join(' | ') || '';

        const salary = item.baseSalary?.value || {};
        let salaryStr = '';
        if (salary.minValue && salary.maxValue) {
          const minLpa = Math.round(salary.minValue / 100000);
          const maxLpa = Math.round(salary.maxValue / 100000);
          if (minLpa > 0 && maxLpa > 0) {
            salaryStr = `${minLpa}-${maxLpa} LPA`;
          }
        }

        const url = item.url || '';
        const idMatch = url.match(/jd\/(\d+)/);
        const naukriId = idMatch ? idMatch[1] : Buffer.from(url).toString('base64').slice(0, 16);

        jobs.push({
          id: `naukri-${naukriId}`,
          platform: 'Naukri',
          title,
          company: org.name || '',
          url: url || '',
          postedAt: item.datePosted || new Date().toISOString(),
          description: `${salaryStr ? salaryStr + ' | ' : ''}${stripHtml(item.description || '').slice(0, MAX_DESCRIPTION_LENGTH)}`,
          location: locationStr,
        });
      }
    } catch {
      // Skip malformed JSON-LD blocks
    }
  }

  return jobs;
}

async function scrapeNaukri() {
  const jobs = [];
  const seenIds = new Set();
  const headers = {
    'User-Agent': USER_AGENT,
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en-IN,en;q=0.9',
  };

  for (const term of SEARCH_TERMS) {
    const searchUrl = buildSearchUrl(term);
    const res = await safeFetch(searchUrl, { headers }, `naukri/${term}`);
    if (!res) { await sleep(SCRAPER_DELAY_MS); continue; }

    let html;
    try { html = await res.text(); } catch { await sleep(SCRAPER_DELAY_MS); continue; }

    const found = extractJobsFromHtml(html);
    for (const job of found) {
      if (seenIds.has(job.id)) continue;
      seenIds.add(job.id);
      jobs.push(job);
    }

    await sleep(SCRAPER_DELAY_MS * 2);
  }

  return jobs;
}

module.exports = { scrapeNaukri };
