'use strict';

// Applicant identity used by the auto-applier and application prep prompts.
// All values are read from environment variables. See .env.example for the full list.
// Configured for Indian job market defaults.

function envYesNo(name, fallback) {
  const raw = process.env[name];
  if (raw == null || raw === '') return fallback;
  return /^(1|true|yes|y)$/i.test(String(raw).trim()) ? 'Yes' : 'No';
}

module.exports = {
  firstName: process.env.APPLICANT_FIRST_NAME || '',
  lastName: process.env.APPLICANT_LAST_NAME || '',
  email: process.env.APPLICANT_EMAIL || '',
  phone: process.env.APPLICANT_PHONE || '',
  linkedin: process.env.APPLICANT_LINKEDIN || '',
  github: process.env.APPLICANT_GITHUB || '',
  location: process.env.APPLICANT_CITY || process.env.APPLICANT_LOCATION || '',
  pinCode: process.env.APPLICANT_PIN_CODE || '',
  country: process.env.APPLICANT_COUNTRY || 'India',
  heardAbout: process.env.APPLICANT_HEARD_ABOUT || 'LinkedIn',
  currentCompany: process.env.APPLICANT_CURRENT_COMPANY || '',
  desiredBaseSalary: process.env.APPLICANT_DESIRED_BASE_SALARY || '',
  currentCtc: process.env.APPLICANT_CURRENT_CTC || '',
  expectedCtc: process.env.APPLICANT_EXPECTED_CTC || '',
  noticePeriodDays: process.env.APPLICANT_NOTICE_PERIOD_DAYS || '30',
  school: process.env.APPLICANT_SCHOOL || '',
  fieldOfStudy: process.env.APPLICANT_FIELD_OF_STUDY || '',
  gradYear: process.env.APPLICANT_GRAD_YEAR || '',
  degree: process.env.APPLICANT_DEGREE || '',
  indiaWorkAuthorized: envYesNo('APPLICANT_INDIA_WORK_AUTHORIZED', 'Yes'),
  indianCitizen: envYesNo('APPLICANT_INDIAN_CITIZEN', ''),
  requiresSponsorship: envYesNo('APPLICANT_REQUIRES_SPONSORSHIP', 'No'),
  residesInIndia: envYesNo('APPLICANT_RESIDES_IN_INDIA', 'Yes'),
  backgroundCheckConsent: envYesNo('APPLICANT_BACKGROUND_CHECK_CONSENT', 'Yes'),
  awsExperience: envYesNo('APPLICANT_AWS_EXPERIENCE', 'Yes'),
  kubernetesExperience: envYesNo('APPLICANT_KUBERNETES_EXPERIENCE', 'Yes'),
  workedAtEmployerBefore: envYesNo('APPLICANT_WORKED_AT_EMPLOYER_BEFORE', 'No'),
  hasConflictOfInterest: envYesNo('APPLICANT_HAS_CONFLICT_OF_INTEREST', 'No'),
  aadhaarAvailable: envYesNo('APPLICANT_AADHAAR_AVAILABLE', 'Yes'),
  pan: process.env.APPLICANT_PAN || '',
  gender: process.env.APPLICANT_GENDER || 'prefer not to say',
  disabilityStatus: process.env.APPLICANT_DISABILITY_STATUS || 'prefer not to say',
  casteCategory: process.env.APPLICANT_CASTE_CATEGORY || 'prefer not to say',
};
