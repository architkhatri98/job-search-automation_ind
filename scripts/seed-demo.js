'use strict';
// Seed demo data for dashboard screenshots.
const { loadDashboardEnv } = require('../lib/env');
loadDashboardEnv(require('path').join(__dirname, '..'));
const { getDb } = require('../lib/db');

const db = getDb();

const COMPANIES = [
  ['Razorpay', 'greenhouse', 'Senior Platform Engineer', 'Bangalore, KA', 9],
  ['Stripe India', 'greenhouse', 'Staff SRE', 'Bangalore, KA', 8],
  ['Zerodha', 'ashby', 'Infrastructure Engineer', 'Bangalore, KA', 8],
  ['CRED', 'greenhouse', 'Senior DevOps Engineer', 'Bangalore, KA', 8],
  ['Postman', 'greenhouse', 'Platform Engineer', 'Hyderabad, TG', 7],
  ['Flipkart', 'greenhouse', 'Cloud Engineer', 'Bangalore, KA', 7],
  ['PhonePe', 'greenhouse', 'Senior Backend Engineer', 'Bangalore, KA', 7],
  ['Meesho', 'greenhouse', 'Site Reliability Engineer', 'Bangalore, KA', 6],
  ['Swiggy', 'greenhouse', 'Infrastructure Engineer II', 'Bangalore, KA', 6],
  ['Atlassian', 'lever', 'Platform Engineer', 'Bangalore, KA', 6],
  ['BrowserStack', 'lever', 'DevOps Engineer', 'Mumbai, MH', 5],
  ['Groww', 'ashby', 'Senior Cloud Infrastructure', 'Bangalore, KA', 5],
  ['Coinbase India', 'greenhouse', 'SRE, Payments', 'Hyderabad, TG', 5],
  ['Hasura', 'workable', 'Senior Platform Engineer', 'Bangalore, KA', 7],
  ['Freshworks', 'greenhouse', 'Infrastructure Engineer', 'Chennai, TN', 6],
  ['Zomato', 'greenhouse', 'Senior SRE', 'Gurugram, HR', 7],
  ['Datadog India', 'greenhouse', 'Systems Engineer', 'Hyderabad, TG', 8],
  ['Anthropic', 'greenhouse', 'Platform Engineer', 'Remote', 7],
  ['Google India', 'workday', 'Senior Infrastructure', 'Bangalore, KA', 8],
  ['GitLab', 'greenhouse', 'Staff Backend Engineer', 'Remote', 7],
];

const STAGES = [null, null, null, 'applied', 'applied', 'phone-screen', 'interview', 'rejected'];
const insert = db.prepare(`
  INSERT OR REPLACE INTO jobs (id, title, company, url, platform, location, posted_at, description, score, reasoning, status, stage, applied_at, created_at)
  VALUES (@id, @title, @company, @url, @platform, @location, @posted_at, @description, @score, @reasoning, @status, @stage, @applied_at, @created_at)
`);

const now = new Date();
COMPANIES.forEach(([company, platform, title, location, score], i) => {
  const daysAgo = i % 14;
  const posted = new Date(now - daysAgo * 86400000).toISOString();
  const stage = STAGES[i % STAGES.length];
  const status = stage ? 'applied' : 'pending';
  insert.run({
    id: `demo-${platform}-${company.toLowerCase().replace(/\s+/g, '-')}-${i}`,
    title,
    company,
    url: `https://example.com/${company.toLowerCase()}/jobs/${i}`,
    platform,
    location,
    posted_at: posted,
    description: `${title} at ${company}. Work on distributed systems, Kubernetes, Terraform, and observability. ${score >= 7 ? 'Strong match for backend/platform background.' : 'Decent overlap, some seniority mismatch.'}`,
    score,
    reasoning: `Score ${score}/10. Stack matches (Go, K8s, AWS). Seniority: ${score >= 7 ? 'aligned' : 'slight stretch'}. Comp: competitive.`,
    status,
    stage,
    applied_at: stage ? new Date(now - (daysAgo - 1) * 86400000).toISOString() : null,
    created_at: posted,
  });
});

// Seed events so activity log has content
try {
  const evt = db.prepare(`INSERT INTO events (job_id, event_type, created_at, details) VALUES (?, ?, ?, ?)`);
  COMPANIES.slice(0, 8).forEach(([company], i) => {
    const id = `demo-${COMPANIES[i][1]}-${company.toLowerCase().replace(/\s+/g, '-')}-${i}`;
    evt.run(id, 'scraped', new Date(now - i * 3600000).toISOString(), null);
    if (STAGES[i % STAGES.length]) {
      evt.run(id, 'applied', new Date(now - i * 3600000 + 1800000).toISOString(), null);
    }
  });
} catch (e) { /* events schema may differ */ }

// Seed market research cache
const fs = require('fs');
const path = require('path');
const mrPath = path.join(process.env.JOB_PROFILE_DIR || path.join(__dirname, '..', 'profiles', 'example'), 'market-research-cache.json');
const mrData = {
  summary: "The 2026 platform/SRE market is shifting toward builder-leaning roles that blend IDP development with operational ownership. Go and Kubernetes remain table stakes; Terraform and observability tooling (OpenTelemetry, Datadog) appear in >60% of JDs. Your resume leads with reliability and incident response, which aligns with ~45% of the market — pivoting emphasis toward IDP/developer-experience framing would broaden fit.",
  gap_analysis: [
    { skill: "OpenTelemetry", count: 14, pct: 70, note: "Standard observability stack in 2026 postings" },
    { skill: "Backstage / IDP", count: 11, pct: 55, note: "Developer portals increasingly required" },
    { skill: "eBPF", count: 6, pct: 30, note: "Emerging in high-scale infra roles" },
    { skill: "Pulumi", count: 5, pct: 25, note: "Typed IaC alternative to Terraform" },
  ],
  trending: ["Platform-as-a-Product", "Developer Experience (DevEx)", "FinOps", "Policy-as-Code (OPA)", "AI-assisted incident response", "eBPF observability"],
  strategy_score: { idp_pct: 58, ops_pct: 42, pivot_direction: "builder", pivot_note: "Market leans 58/42 builder — lead with IDP/tooling work on resume." },
  top_skills: [
    { skill: "Kubernetes", count: 19, pct: 95 },
    { skill: "Terraform", count: 16, pct: 80 },
    { skill: "Go", count: 14, pct: 70 },
    { skill: "AWS", count: 18, pct: 90 },
    { skill: "Python", count: 12, pct: 60 },
    { skill: "CI/CD", count: 15, pct: 75 },
  ],
};
const mr = { data: mrData, generatedAt: Date.now(), jobCount: COMPANIES.length };
fs.writeFileSync(mrPath, JSON.stringify(mr, null, 2));

console.log(`Seeded ${COMPANIES.length} jobs and market research cache.`);
