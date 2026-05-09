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

// Pre-launch setup checklist — visible while now < STUDY_START.
const SETUP_TASKS = [
  { action: 'Subscribe', title: 'Capital Advantage YouTube channel (Ken Finnen)', resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '2 min' },
  { action: 'Subscribe', title: 'Series 7 Guru YouTube channel (Dean Tinney)',     resource: 'https://www.youtube.com/@series7guru',                  time: '2 min' },
  { action: 'Read',      title: 'Skim FINRA SIE Content Outline (the source of truth)', resource: 'https://www.finra.org/registration-exams-ce/qualification-exams/sie/content-outline', time: '20 min' },
  { action: 'Set up',    title: 'NotebookLM workspace · upload SIE outline PDF',   resource: 'https://notebooklm.google.com',                         time: '15 min' },
  { action: 'Bookmark',  title: 'SIEPracticeExam.com & Knopman free tests',        resource: 'https://siepracticeexam.com',                           time: '5 min' },
  { action: 'Send',      title: 'Support message to Jyselle (the why is shared)',  time: '10 min' }
];

// Full curriculum: 10 weeks × 7 days. Each day-item has an action verb,
// concrete title, the FINRA outline section it covers, a resource link,
// and an estimated time. Days are ordered Mon → Sun (index 0..6).
//
// FINRA SIE Content Outline (the source these map back to):
//   Sec 1 — Knowledge of Capital Markets (~16% / 12 questions)
//   Sec 2 — Understanding Products and Their Risks (~44% / 33 questions)
//   Sec 3 — Understanding Trading, Customer Accounts, and Prohibited Activities (~31% / 23 questions)
//   Sec 4 — Overview of the Regulatory Framework (~9% / 7 questions)
const CURRICULUM = {
  1: {
    topic: 'Capital Markets',
    section: 'Sec 1 · 16% of exam',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Capital Markets Overview',          outline: 'Sec 1 · Markets & Participants',    resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Issuers & Primary Market',          outline: 'Sec 1 · Offerings & Underwriting',  resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · Secondary Market & Exchanges',      outline: 'Sec 1 · Secondary Markets',         resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Economic Factors (GDP, rates, inflation)', outline: 'Sec 1 · Economic Factors', resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Fri', action: 'Notes',     title: 'Chapter notes → upload to NotebookLM',      outline: 'Sec 1 review',                       resource: 'https://notebooklm.google.com',                       time: '40 min' },
      { day: 'Sat', action: 'Whiteboard', title: 'Capital flow & participants map',          outline: 'Sec 1 synthesis',                                                                                    time: '90 min' },
      { day: 'Sun', action: 'Quiz',      title: 'Ch 1–2 quiz ≥ 70%',                          outline: 'Sec 1 gate',                         resource: 'https://siepracticeexam.com',                         time: '60 min' }
    ]
  },
  2: {
    topic: 'Regulatory Framework',
    section: 'Sec 4 · 9% of exam',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · SEC structure & authority',         outline: 'Sec 4 · SEC',                        resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · FINRA & SROs',                      outline: 'Sec 4 · SROs',                       resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · MSRB & SIPC',                       outline: 'Sec 4 · Other regulators',           resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Thu', action: 'Watch',     title: 'Series 7 Guru · regulators (Two-Teachers cross-check)', outline: 'Sec 4 · cross-check', resource: 'https://www.youtube.com/@series7guru',                  time: '45 min' },
      { day: 'Fri', action: 'Notes',     title: 'NotebookLM regulator mind map',             outline: 'Sec 4 synthesis',                    resource: 'https://notebooklm.google.com',                       time: '30 min' },
      { day: 'Sat', action: 'Whiteboard', title: 'Regulators chart (FINRA / SEC / MSRB / SIPC)', outline: 'Sec 4 synthesis',                                                                                time: '90 min' },
      { day: 'Sun', action: 'Drill',     title: '25-question regulators set',                outline: 'Sec 4 drill',                        resource: 'https://siepracticeexam.com',                         time: '45 min' }
    ]
  },
  3: {
    topic: 'Equity Securities',
    section: 'Sec 2 · part 1 of 4',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Common stock & shareholder rights', outline: 'Sec 2 · Equity',                     resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Preferred stock variants',          outline: 'Sec 2 · Preferred',                  resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · ADRs, rights, warrants',            outline: 'Sec 2 · ADRs',                       resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Stock splits & dividends',          outline: 'Sec 2 · Dividends',                  resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'Equity rights chart',                       outline: 'Sec 2 · Equity synthesis',                                                                            time: '60 min' },
      { day: 'Sat', action: 'Drill',     title: 'SIEPracticeExam equity set · 50 questions', outline: 'Sec 2 drill',                        resource: 'https://siepracticeexam.com',                         time: '90 min' },
      { day: 'Sun', action: 'Cards',     title: '50 Quizlet equity cards',                   outline: 'Sec 2 reinforcement',                resource: 'https://quizlet.com/subject/sie/',                    time: '30 min' }
    ]
  },
  4: {
    topic: 'Debt Securities',
    section: 'Sec 2 · part 2 of 4',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Treasury securities',               outline: 'Sec 2 · Treasuries',                 resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Corporate bonds',                   outline: 'Sec 2 · Corporates',                 resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · Municipal bonds (GO vs Revenue)',   outline: 'Sec 2 · Munis',                      resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Yield curve & bond pricing',        outline: 'Sec 2 · Pricing',                    resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'Yield curve & bond price/yield chart',      outline: 'Sec 2 · Debt synthesis',                                                                              time: '60 min' },
      { day: 'Sat', action: 'Drill',     title: 'Debt question set · 50+ questions',         outline: 'Sec 2 drill',                        resource: 'https://siepracticeexam.com',                         time: '90 min' },
      { day: 'Sun', action: 'Cards',     title: '50 Quizlet debt cards',                     outline: 'Sec 2 reinforcement',                resource: 'https://quizlet.com/subject/sie/',                    time: '30 min' }
    ]
  },
  5: {
    topic: 'Packaged Products',
    section: 'Sec 2 · part 3 of 4 · ★ WFG strength',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Mutual fund basics',                outline: 'Sec 2 · Mutual Funds',               resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · ETFs vs mutual funds',              outline: 'Sec 2 · ETFs',                       resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · Variable annuities ★ WFG',          outline: 'Sec 2 · VAs',                        resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '60 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · REITs & DPPs',                      outline: 'Sec 2 · REITs/DPPs',                 resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'VA mechanics (the WFG diagram)',            outline: 'Sec 2 · VA synthesis',                                                                                time: '60 min' },
      { day: 'Sat', action: 'Drill',     title: 'Knopman packaged products test',            outline: 'Sec 2 drill',                        resource: 'https://www.knopman.com/sie-exam-prep/',              time: '90 min' },
      { day: 'Sun', action: 'Cards',     title: 'Quizlet packaged products',                 outline: 'Sec 2 reinforcement',                resource: 'https://quizlet.com/subject/sie/',                    time: '30 min' }
    ]
  },
  6: {
    topic: 'Options + Retirement',
    section: 'Sec 2 · part 4 of 4',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Options basics (calls & puts)',     outline: 'Sec 2 · Options',                    resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Options strategies (covered, protective, spreads)', outline: 'Sec 2 · Strategies', resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · IRA types (Traditional, Roth, SEP, SIMPLE)', outline: 'Sec 2 · IRAs',              resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Qualified vs non-qualified plans',  outline: 'Sec 2 · Retirement',                 resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'Options strategies grid',                   outline: 'Sec 2 · Options synthesis',                                                                            time: '60 min' },
      { day: 'Sat', action: 'Drill',     title: 'Options + retirement question set',         outline: 'Sec 2 drill',                        resource: 'https://siepracticeexam.com',                         time: '90 min' },
      { day: 'Sun', action: 'Review',    title: 'Weak spots from this week',                 outline: 'Sec 2 reinforcement',                                                                                  time: '45 min' }
    ]
  },
  7: {
    topic: 'Trading & Markets',
    section: 'Sec 3 · part 1 of 2',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Order types (market, limit, stop)', outline: 'Sec 3 · Orders',                     resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Settlement (T+1) & clearing',       outline: 'Sec 3 · Settlement',                 resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · Margin accounts',                   outline: 'Sec 3 · Margin',                     resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Short selling & margin maintenance', outline: 'Sec 3 · Margin maintenance',        resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'Order flow & T+1 settlement diagram',       outline: 'Sec 3 · Trading synthesis',                                                                            time: '60 min' },
      { day: 'Sat', action: 'Drill',     title: 'Operations practice test ≥ 75%',            outline: 'Sec 3 gate',                         resource: 'https://siepracticeexam.com',                         time: '90 min' },
      { day: 'Sun', action: 'Cards',     title: 'Quizlet · margin & order types',            outline: 'Sec 3 reinforcement',                resource: 'https://quizlet.com/subject/sie/',                    time: '30 min' }
    ]
  },
  8: {
    topic: 'Customer Accounts + Diagnostic',
    section: 'Sec 3 · part 2 of 2',
    days: [
      { day: 'Mon', action: 'Watch',     title: 'CapAd · Account types & registration',      outline: 'Sec 3 · Accounts',                   resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Tue', action: 'Watch',     title: 'CapAd · Suitability rules (Reg BI)',        outline: 'Sec 3 · Suitability',                resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Wed', action: 'Watch',     title: 'CapAd · AML / KYC',                         outline: 'Sec 3 · AML',                        resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '30 min' },
      { day: 'Thu', action: 'Watch',     title: 'CapAd · Prohibited practices & FINRA conduct rules', outline: 'Sec 3 · Conduct',          resource: 'https://www.youtube.com/@CapitalAdvantageTutoring', time: '45 min' },
      { day: 'Fri', action: 'Whiteboard', title: 'AML / KYC flow diagram',                    outline: 'Sec 3 · synthesis',                                                                                  time: '60 min' },
      { day: 'Sat', action: 'Exam',      title: 'Practice Exam #1 · Diagnostic · 75 Q · 1h45', outline: 'Full coverage',                    resource: 'https://siepracticeexam.com',                         time: '105 min' },
      { day: 'Sun', action: 'Review',    title: 'Diagnostic review · tag weak units',        outline: 'Weak unit identification',                                                                              time: '60 min' }
    ]
  },
  9: {
    topic: 'Final Push',
    section: 'Phase 4 · 3-exam gate',
    days: [
      { day: 'Mon', action: 'Review',    title: 'Drill weak unit #1 (top from diagnostic)',   outline: 'Targeted review',                                                                                    time: '60 min' },
      { day: 'Tue', action: 'Review',    title: 'Drill weak unit #2',                         outline: 'Targeted review',                                                                                    time: '60 min' },
      { day: 'Wed', action: 'Review',    title: 'Drill weak unit #3',                         outline: 'Targeted review',                                                                                    time: '60 min' },
      { day: 'Thu', action: 'Cards',     title: 'Light Quizlet across weak topics',          outline: 'Reinforcement',                      resource: 'https://quizlet.com/subject/sie/',                    time: '45 min' },
      { day: 'Fri', action: 'Exam',      title: 'Gate Exam #1 · target 80%+',                outline: 'Gate',                               resource: 'https://siepracticeexam.com',                         time: '105 min' },
      { day: 'Sat', action: 'Exam',      title: 'Gate Exam #2 · target 80%+',                outline: 'Gate',                               resource: 'https://siepracticeexam.com',                         time: '105 min' },
      { day: 'Sun', action: 'Rest',      title: 'Decompress · no studying',                   outline: 'Recovery',                                                                                            time: '—' }
    ]
  },
  10: {
    topic: 'Test Week',
    section: 'Phase 5 · taper',
    days: [
      { day: 'Mon', action: 'Exam',      title: 'Gate Exam #3 · FINRA Official · target 80%+', outline: 'Final gate',                       resource: 'https://www.finra.org/registration-exams-ce/qualification-exams/sie',  time: '105 min' },
      { day: 'Tue', action: 'Cards',     title: 'Light flashcards · weak spots only',        outline: 'Light reinforcement',                resource: 'https://quizlet.com/subject/sie/',                    time: '30 min' },
      { day: 'Wed', action: 'Review',    title: 'Key formulas & rules · 1 page recap',       outline: 'Light review',                                                                                       time: '30 min' },
      { day: 'Thu', action: 'Rest',      title: 'NO STUDYING · early sleep',                 outline: 'Taper',                                                                                              time: '—' },
      { day: 'Fri', action: 'Exam',      title: '🎯 EXAM DAY · 10:15 AM Camarillo',          outline: 'Test',                                                                                               time: '1h45' },
      { day: 'Sat', action: 'Rest',      title: 'Decompress',                                 outline: 'Recovery',                                                                                            time: '—' },
      { day: 'Sun', action: 'Rest',      title: 'Decompress',                                 outline: 'Recovery',                                                                                            time: '—' }
    ]
  }
};

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

// Calendar clock — what's true on the wall.
const getCalendarWeek = () => {
  const now = new Date();
  if (now < STUDY_START) return 0;
  const days = Math.floor((now - STUDY_START) / (1000 * 60 * 60 * 24));
  return Math.min(10, Math.floor(days / 7) + 1);
};

// Progress clock — what the user has actually finished.
// First uncompleted week, capped at 10. Skipping ahead is allowed:
// mark earlier weeks complete to advance.
const getProgressWeek = (state) => {
  for (let w = 1; w <= 10; w++) {
    if (!state.completedWeeks[w]) return w;
  }
  return 10;
};

const getDrift = (state) => {
  const cal = getCalendarWeek();
  if (cal === 0) return 0; // pre-start, no drift
  return getProgressWeek(state) - cal;
};

const getWeekDays = (week) => (CURRICULUM[week] && CURRICULUM[week].days) || [];

const getRemainingItems = (state, week) => {
  const items = getWeekDays(week);
  const checks = state.weekItems[week] || [];
  return items.length - items.filter((_, i) => checks[i]).length;
};

// Mon=0, Tue=1, ..., Sun=6 — matches the curriculum day index.
const getTodayDayIdx = () => (new Date().getDay() + 6) % 7;

// Item to feature in "Today's Lesson":
//   1. Today's day-item if not yet checked.
//   2. Otherwise the first earlier-in-the-week unchecked item (catch-up).
//   3. Otherwise null (week is fully checked — prompt to mark complete).
const getNextActionableItem = (state, week) => {
  const days = getWeekDays(week);
  if (days.length === 0) return null;
  const checks = state.weekItems[week] || [];
  const todayIdx = getTodayDayIdx();
  if (todayIdx < days.length && !checks[todayIdx]) {
    return { idx: todayIdx, item: days[todayIdx], catchUp: false };
  }
  for (let i = 0; i < Math.min(todayIdx, days.length); i++) {
    if (!checks[i]) return { idx: i, item: days[i], catchUp: true };
  }
  for (let i = todayIdx + 1; i < days.length; i++) {
    if (!checks[i]) return { idx: i, item: days[i], catchUp: false };
  }
  return null;
};

// Kept for back-compat with any caller still using the old name.
const getStudyWeek = getCalendarWeek;
