const SUPPORTED_LANGUAGES = ["en", "hi", "kn"];
const FINANCIAL_STATUSES = ["low", "middle", "high"];
const EDUCATION_LEVELS = [
  "primary",
  "secondary",
  "higher-secondary",
  "diploma",
  "graduate",
  "postgraduate",
  "other",
];
const DOCUMENT_OPTIONS = [
  "Aadhaar",
  "PAN",
  "Voter ID",
  "Driving License",
  "Passport",
  "Ration Card",
];

const GOVERNMENT_LINKS = [
  { keywords: ["aadhaar", "aadhar", "uidai"], label: "UIDAI", url: "https://uidai.gov.in/" },
  { keywords: ["pan", "income tax", "itr"], label: "Income Tax e-Filing", url: "https://www.incometax.gov.in/" },
  { keywords: ["passport"], label: "Passport Seva", url: "https://www.passportindia.gov.in/" },
  { keywords: ["voter", "election", "epic"], label: "Voter Services Portal", url: "https://voters.eci.gov.in/" },
  { keywords: ["ration", "food security"], label: "NFSA / State Food Portals", url: "https://nfsa.gov.in/" },
  { keywords: ["driving license", "vehicle", "rc", "transport"], label: "Parivahan", url: "https://parivahan.gov.in/" },
  { keywords: ["scheme", "yojana", "benefit", "subsidy"], label: "National Government Services Portal", url: "https://www.india.gov.in/" },
  { keywords: ["complaint", "grievance"], label: "CPGRAMS", url: "https://pgportal.gov.in/" },
  { keywords: ["legal", "court", "case", "advocate"], label: "eCourts", url: "https://ecourts.gov.in/" },
];

module.exports = {
  SUPPORTED_LANGUAGES,
  FINANCIAL_STATUSES,
  EDUCATION_LEVELS,
  DOCUMENT_OPTIONS,
  GOVERNMENT_LINKS,
};
