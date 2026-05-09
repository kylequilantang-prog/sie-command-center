// SIE Command Center — init, event delegation, modals, test-day mode, service worker.

let state = loadState();

const sessionPick = { hours: null, confidence: null };
const examPick = { num: null, weakUnits: [] };

const openModal = (id) => {
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
};
const closeModal = (id) => {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
};

const openSessionLogger = () => {
  sessionPick.hours = null;
  sessionPick.confidence = null;
  const today = state.sessions.find((s) => s.date === TODAY_STR());
  if (today) {
    sessionPick.hours = today.hours;
    sessionPick.confidence = today.confidence;
    document.getElementById('sessionTopic').value = today.topic || '';
  } else {
    document.getElementById('sessionTopic').value = '';
  }
  renderHourGrid(sessionPick.hours);
  renderConfRow(sessionPick.confidence);
  openModal('sessionModal');
};

const saveSession = () => {
  if (!sessionPick.hours) { alert('Pick hours first.'); return; }
  if (!sessionPick.confidence) { alert('Rate confidence 1–5.'); return; }
  const today = TODAY_STR();
  const topic = document.getElementById('sessionTopic').value.trim();
  state.sessions = state.sessions.filter((s) => s.date !== today);
  state.sessions.push({
    date: today,
    hours: sessionPick.hours,
    confidence: sessionPick.confidence,
    topic,
    loggedAt: new Date().toISOString()
  });
  saveState(state);
  renderStats(state);
  renderSessions(state);
  closeModal('sessionModal');
};

const openExamLogger = (num) => {
  const exam = EXAMS.find((e) => e.num === num);
  const existing = state.exams.find((e) => e.num === num);
  examPick.num = num;
  examPick.weakUnits = existing?.weakUnits ? [...existing.weakUnits] : [];
  document.getElementById('examModalSubtitle').textContent = `${exam.name} · ${exam.label}`;
  document.getElementById('examScore').value = existing?.score ?? '';
  document.getElementById('examNotes').value = existing?.notes ?? '';
  renderWeakTags(examPick.weakUnits);
  openModal('examModal');
  setTimeout(() => document.getElementById('examScore').focus(), 100);
};

const saveExamScore = () => {
  const score = parseInt(document.getElementById('examScore').value, 10);
  if (isNaN(score) || score < 0 || score > 100) { alert('Score must be 0–100.'); return; }
  const notes = document.getElementById('examNotes').value.trim();
  state.exams = state.exams.filter((e) => e.num !== examPick.num);
  state.exams.push({
    num: examPick.num,
    score,
    weakUnits: [...examPick.weakUnits],
    notes,
    loggedAt: new Date().toISOString()
  });
  saveState(state);
  renderExams(state);
  closeModal('examModal');
};

const toggleWhiteboard = (week) => {
  if (state.whiteboards[week]) delete state.whiteboards[week];
  else state.whiteboards[week] = new Date().toISOString();
  saveState(state);
  renderWhiteboards(state);
};

const refreshWeekViews = () => {
  renderToday(state);
  if ($('curriculumModal').classList.contains('open')) renderCurriculumModal(state);
};

const toggleWeekItem = (week, idx) => {
  if (!state.weekItems[week]) state.weekItems[week] = [];
  state.weekItems[week][idx] = !state.weekItems[week][idx];
  saveState(state);
  refreshWeekViews();
};

const markWeekComplete = (week) => {
  state.completedWeeks[week] = new Date().toISOString();
  saveState(state);
  refreshWeekViews();
};

const unmarkWeekComplete = (week) => {
  delete state.completedWeeks[week];
  saveState(state);
  refreshWeekViews();
};

const toggleSetupTask = (idx) => {
  if (!state.setupTasks) state.setupTasks = [];
  state.setupTasks[idx] = !state.setupTasks[idx];
  saveState(state);
  renderToday(state);
};

const openCurriculum = () => {
  renderCurriculumModal(state);
  openModal('curriculumModal');
};

const openNotebookLM = () => {
  const week = getStudyWeek();
  const focus = WEEKLY_FOCUS[week] || WEEKLY_FOCUS[10];
  const url = NOTEBOOK_URLS[focus.notebook] || NOTEBOOK_URLS.default;
  window.open(url, '_blank', 'noopener');
};

const isTestDay = () => {
  const now = new Date();
  const day = now.toISOString().split('T')[0];
  return day === '2026-07-10' && now < EXAM_DATE && !sessionStorage.getItem('exitedTestDay');
};
const maybeShowTestDay = () => {
  document.getElementById('testDay').classList.toggle('show', isTestDay());
};
const exitTestDay = () => {
  sessionStorage.setItem('exitedTestDay', '1');
  maybeShowTestDay();
};

const showInstallHintIfNeeded = () => {
  if (state.installHintDismissed) return;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
  if (isStandalone) return;
  const isiOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (!isiOS) return;
  setTimeout(() => document.getElementById('installHint').classList.add('show'), 2500);
};
const dismissInstallHint = () => {
  state.installHintDismissed = true;
  saveState(state);
  document.getElementById('installHint').classList.remove('show');
};

// ===== EVENT DELEGATION =====
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  const action = t.dataset.action;

  switch (action) {
    case 'open-session': openSessionLogger(); break;
    case 'open-notebook': openNotebookLM(); break;
    case 'open-ticktick': window.open(TICKTICK_URL, '_blank', 'noopener'); break;
    case 'close-session': closeModal('sessionModal'); break;
    case 'save-session': saveSession(); break;
    case 'pick-hours':
      sessionPick.hours = parseFloat(t.dataset.h);
      renderHourGrid(sessionPick.hours);
      break;
    case 'pick-conf':
      sessionPick.confidence = parseInt(t.dataset.c, 10);
      renderConfRow(sessionPick.confidence);
      break;
    case 'open-exam': openExamLogger(parseInt(t.dataset.exam, 10)); break;
    case 'close-exam': closeModal('examModal'); break;
    case 'save-exam': saveExamScore(); break;
    case 'toggle-weak': {
      const u = t.dataset.u;
      const i = examPick.weakUnits.indexOf(u);
      if (i >= 0) examPick.weakUnits.splice(i, 1);
      else examPick.weakUnits.push(u);
      renderWeakTags(examPick.weakUnits);
      break;
    }
    case 'toggle-whiteboard': toggleWhiteboard(parseInt(t.dataset.week, 10)); break;
    case 'toggle-week-item':
      toggleWeekItem(parseInt(t.dataset.week, 10), parseInt(t.dataset.idx, 10));
      break;
    case 'mark-week': markWeekComplete(parseInt(t.dataset.week, 10)); break;
    case 'unmark-week': unmarkWeekComplete(parseInt(t.dataset.week, 10)); break;
    case 'toggle-setup': toggleSetupTask(parseInt(t.dataset.idx, 10)); break;
    case 'open-curriculum': openCurriculum(); break;
    case 'close-curriculum': closeModal('curriculumModal'); break;
    case 'toggle-curriculum-week': {
      const wkEl = t.closest('.curriculum-week');
      if (wkEl) wkEl.classList.toggle('expanded');
      break;
    }
    case 'exit-testday': exitTestDay(); break;
    case 'dismiss-install': dismissInstallHint(); break;
    case 'export': exportState(state); break;
    case 'import': importState((next) => { state = next; renderAll(state); }); break;
    case 'reset': if (resetState()) location.reload(); break;
  }
});

// Backdrop click closes modal
document.querySelectorAll('[data-dismiss="backdrop"]').forEach((bd) => {
  bd.addEventListener('click', (e) => { if (e.target === bd) bd.classList.remove('open'); });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-backdrop.open').forEach((m) => m.classList.remove('open'));
    document.body.style.overflow = '';
  }
});

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {});
  });
}

// Init
const versionEl = document.getElementById('appVersion');
if (versionEl) versionEl.textContent = APP_VERSION;
renderAll(state);
maybeShowTestDay();
showInstallHintIfNeeded();
setInterval(renderCountdown, 60000);
setInterval(() => { renderToday(state); maybeShowTestDay(); }, 60000);
