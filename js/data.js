// SIE Command Center — static data (dates, phases, focus, exams, resources)

const EXAM_DATE = new Date('2026-07-10T10:15:00-07:00');
const STUDY_START = new Date('2026-05-11T06:00:00-07:00');

const PHASES = [
  { num: 1, name: 'Foundation', start: '2026-05-11', end: '2026-05-24', gate: 'Ch 1–2 quizzes ≥70%' },
  { num: 2, name: 'Products Deep Dive', start: '2026-05-25', end: '2026-06-14', gate: 'Product unit tests ≥75%' },
  { num: 3, name: 'Trading & Accounts', start: '2026-06-15', end: '2026-06-26', gate: 'Operations tests ≥75%' },
  { num: 4, name: 'Diagnostic & Drills', start: '2026-06-27', end: '2026-07-04', gate: '3× 80%+ exams' },
  { num: 5, name: 'Final Push & Taper', start: '2026-07-05', end: '2026-07-09', gate: 'Sleep, rest, trust' }
];

const WEEKLY_FOCUS = {
  1:  { topic: 'Capital Markets',                         detail: 'Capital Advantage videos 1–4. Take notes. Build participant flow whiteboard map Saturday.', notebook: 'capital-markets' },
  2:  { topic: 'Regulatory Framework',                    detail: 'FINRA, SEC, MSRB, SIPC. Two-Teachers method. NotebookLM regulator mind map.',                notebook: 'regulators' },
  3:  { topic: 'Equity Securities',                       detail: 'Common, preferred, ADRs. Whiteboard the rights chart. SIEPracticeExam equity questions.',    notebook: 'equities' },
  4:  { topic: 'Debt Securities',                         detail: 'Corporate, muni, treasury. Yield curve mastery. CertFuel debt drills.',                      notebook: 'debt' },
  5:  { topic: 'Packaged Products',                       detail: 'Mutual funds, ETFs, VAs. ★ Lean on WFG knowledge. Confidence anchor week.',                  notebook: 'packaged' },
  6:  { topic: 'Options + Retirement',                    detail: 'Calls, puts, basic spreads. IRA types. Whiteboard strategies grid.',                         notebook: 'options' },
  7:  { topic: 'Trading & Markets',                       detail: 'Order types, settlement, margin. Order flow whiteboard map.',                                notebook: 'trading' },
  8:  { topic: 'Customer Accounts + Practice Exams',      detail: 'Suitability, prohibited practices. Practice Exam #1 Saturday.',                              notebook: 'customer-accounts' },
  9:  { topic: 'Final Push',                              detail: 'Practice Exams #2, #3. 80%+ on each. Light review only the final week.',                     notebook: 'final-push' },
  10: { topic: 'Test Week',                               detail: 'Practice Exam #4 Monday. Light flashcards Tue–Wed. Rest Thursday.',                           notebook: 'test-week' }
};

const EXAMS = [
  { num: 1, name: 'Diagnostic',                       date: '2026-06-27', label: 'Sat Jun 27' },
  { num: 2, name: 'Gate Exam #1',                     date: '2026-07-03', label: 'Fri Jul 3' },
  { num: 3, name: 'Gate Exam #2',                     date: '2026-07-04', label: 'Sat Jul 4' },
  { num: 4, name: 'Gate Exam #3 · FINRA Official',    date: '2026-07-06', label: 'Mon Jul 6' }
];

const WHITEBOARDS = [
  { week: 1, topic: 'Capital flow & participants' },
  { week: 2, topic: 'Regulators (FINRA/SEC/MSRB/SIPC)' },
  { week: 3, topic: 'Equity rights chart' },
  { week: 4, topic: 'Yield curve & bond pricing' },
  { week: 5, topic: 'VA mechanics (lean on WFG)' },
  { week: 6, topic: 'Options strategies grid' },
  { week: 7, topic: 'Order flow & T+1 settlement' }
];

const WEAK_UNITS = [
  'Equities', 'Debt', 'Options', 'Mutual Funds', 'ETFs', 'Variable Annuities',
  'Margin', 'Suitability', 'FINRA Rules', 'SEC Rules', 'MSRB', 'Settlement',
  'Order Types', 'Retirement', 'Tax', 'Prohibited Practices'
];

// NotebookLM URLs — replace per-week as Kyle creates each notebook.
// Until then, all routes fall through to the home.
const NOTEBOOK_URLS = {
  default: 'https://notebooklm.google.com'
};

const TICKTICK_URL = 'https://ticktick.com';

const TODAY_STR = () => new Date().toISOString().split('T')[0];

const getCurrentPhase = () => {
  const now = new Date();
  for (const p of PHASES) {
    if (now <= new Date(p.end + 'T23:59:59-07:00')) return p;
  }
  return PHASES[PHASES.length - 1];
};

const getStudyWeek = () => {
  const now = new Date();
  if (now < STUDY_START) return 0;
  const days = Math.floor((now - STUDY_START) / (1000 * 60 * 60 * 24));
  return Math.min(10, Math.floor(days / 7) + 1);
};
