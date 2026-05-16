'use strict';

// Example target-company config for the example profile (Indian market).
// Each array lists company slugs on a specific ATS platform. The scraper fetches
// job boards for each slug and filters by SEARCH_TERMS.
//
// The slugs below are a small demo set targeting companies hiring in India.
// To target real companies, replace these with the actual slugs visible in
// each platform's public job-board URL.
// For example, a Greenhouse board at boards.greenhouse.io/razorpay has slug 'razorpay'.

const MAX_AGE_DAYS = 20;

const SEARCH_TERMS = [
  'backend',
  'platform engineer',
  'infrastructure engineer',
  'site reliability',
  'sre',
  'cloud engineer',
  'devops',
  'software engineer',
  'full stack',
];

// Greenhouse boards: https://boards.greenhouse.io/<slug>
// Companies with significant India engineering presence
const GREENHOUSE_COMPANIES = [
  'razorpay',
  'cred',
  'zomato',
  'meesho',
  'coinbase',   // India engineering center
  'stripe',     // India engineering center
  'anthropic',
  'datadog',    // India hiring
  'postman',
];

// Lever boards: https://jobs.lever.co/<slug>
const LEVER_COMPANIES = [
  'atlassian',
  'browserstack',
];

// Workable boards: https://apply.workable.com/<slug>
const WORKABLE_COMPANIES = [
  'hasura',
  'remote',
];

// Ashby boards: https://jobs.ashbyhq.com/<slug>
const ASHBY_COMPANIES = [
  'zerodha',
  'linear',
];

// Workday boards: https://<slug>.wd1.myworkdayjobs.com
// Many large Indian IT companies and MNCs use Workday
const WORKDAY_COMPANIES = [
  // Add workday-hosted company slugs here. MNCs like Google, Microsoft,
  // Amazon use Workday for India roles. They often look like 'acme.wd5'.
];

// Wellfound (AngelList) is searched by role name, not company slug.
// Good for Indian startups.
const WELLFOUND_ROLES = [
  'platform-engineer',
  'site-reliability-engineer',
  'backend-engineer',
  'software-engineer',
];

// Rippling-hosted public boards.
const RIPPLING_COMPANIES = [
  // Add rippling-hosted company slugs here.
];

// Naukri scraper uses SEARCH_TERMS and experience filters from .env.
// Jobicy, Arbeitnow, RemoteOK, WeWorkRemotely don't take per-company slugs.
// They're global listings filtered by SEARCH_TERMS.

module.exports = {
  MAX_AGE_DAYS,
  SEARCH_TERMS,
  GREENHOUSE_COMPANIES,
  LEVER_COMPANIES,
  WORKABLE_COMPANIES,
  ASHBY_COMPANIES,
  WORKDAY_COMPANIES,
  WELLFOUND_ROLES,
  RIPPLING_COMPANIES,
};
