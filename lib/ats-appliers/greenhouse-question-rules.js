'use strict';

// Pattern-matched answers for common Greenhouse application questions.
// Identity fields (linkedin, github, location) are filled from the applicant config.
// Configured for Indian job market.
const SIMPLE_GREENHOUSE_QUESTION_RULES = [
  { pattern: /authorized to work|legally authorized|work authorization|eligible to work in india/i, answer: (applicant) => applicant.indiaWorkAuthorized || 'Yes' },
  { pattern: /visa sponsorship|require sponsorship/i, answer: (applicant) => applicant.requiresSponsorship || 'No' },
  { pattern: /pending or future government filing|dependent on a pending or future government|support any immigration or employment authorization/i, answer: (applicant) => applicant.requiresSponsorship || 'No' },
  { pattern: /indian citizen|citizen of india/i, answer: (applicant) => applicant.indianCitizen || null },
  { pattern: /country|nationality/i, answer: (applicant) => applicant.country || 'India' },
  { pattern: /current location|location/i, answer: (applicant) => applicant.location || applicant.country || 'India' },
  { pattern: /reside in india|currently reside in india|currently based in india/i, answer: (applicant) => applicant.residesInIndia || 'Yes' },
  { pattern: /linkedin/i, answer: (applicant) => applicant.linkedin || null },
  { pattern: /github/i, answer: (applicant) => applicant.github || null },
  { pattern: /portfolio|website/i, answer: (applicant) => applicant.github || applicant.linkedin || null },
  { pattern: /current company|current employer|company/i, answer: (applicant) => applicant.currentCompany || null },
  { pattern: /how did you hear/i, answer: (applicant) => applicant.heardAbout || 'LinkedIn' },
  { pattern: /background check|background verification/i, answer: (applicant) => applicant.backgroundCheckConsent || 'Yes' },
  { pattern: /experience.*aws|aws cloud infrastructure/i, answer: (applicant) => applicant.awsExperience || 'Yes' },
  { pattern: /experience.*kubernetes|working with kubernetes/i, answer: (applicant) => applicant.kubernetesExperience || 'Yes' },
  { pattern: /notice period/i, answer: (applicant) => `${applicant.noticePeriodDays || '30'} days` },
  { pattern: /current ctc|current salary|current compensation|present ctc/i, answer: (applicant) => applicant.currentCtc || null },
  { pattern: /expected ctc|expected salary|expected compensation|desired ctc/i, answer: (applicant) => applicant.expectedCtc || applicant.desiredBaseSalary || null },
  { pattern: /history with .*|ever been employed by/i, answer: (applicant) => applicant.workedAtEmployerBefore || 'No' },
  { pattern: /conflict of interest/i, answer: (applicant) => applicant.hasConflictOfInterest || 'No' },
];

function answerForGreenhouseQuestion(label, applicant) {
  const text = String(label || '').trim();
  const rule = SIMPLE_GREENHOUSE_QUESTION_RULES.find(({ pattern }) => pattern.test(text));
  if (!rule) return null;
  return typeof rule.answer === 'function' ? rule.answer(applicant) : rule.answer;
}

function resolveGreenhouseQuestionAnswer(label, applicant, draftedAnswers, fieldName) {
  if (fieldName && draftedAnswers && Object.prototype.hasOwnProperty.call(draftedAnswers, fieldName)) {
    return draftedAnswers[fieldName];
  }
  return answerForGreenhouseQuestion(label, applicant);
}

module.exports = {
  SIMPLE_GREENHOUSE_QUESTION_RULES,
  answerForGreenhouseQuestion,
  resolveGreenhouseQuestionAnswer,
};
