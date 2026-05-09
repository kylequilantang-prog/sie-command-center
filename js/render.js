// SIE Command Center — DOM rendering. All read-only against `state` and the data module.

const $ = (id) => document.getElementById(id);

const formatDateRange = (s, e) => {
  const opts = { month: 'short', day: 'numeric' };
  return `${new Date(s + 'T00:00:00').toLocaleDateString('en-US', opts)} – ${new Date(e + 'T00:00:00').toLocaleDateString('en-US', opts)}`;
};

const renderCountdown = () => {
  const now = new Date();
  const days = Math.max(0, Math.floor((EXAM_DATE - now) / (1000 * 60 * 60 * 24)));
  $('daysLeft').textContent = days;
  const t = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  $('liveTime').innerHTML = `LIVE <strong>${t} PT</strong>`;
};

const renderProgress = () => {
  const totalDays = Math.floor((EXAM_DATE - STUDY_START) / (1000 * 60 * 60 * 24));
  const elapsed = Math.max(0, Math.floor((new Date() - STUDY_START) / (1000 * 60 * 60 * 24)));
  const dayCount = Math.min(totalDays, elapsed);
  const pct = Math.round((dayCount / totalDays) * 100);
  $('progressNum').innerHTML = `${dayCount} <em>/ ${totalDays}</em>`;
  $('progressPct').textContent = `${pct}% timeline elapsed`;
  $('barFill').style.width = pct + '%';
  const current = getCurrentPhase();
  $('phaseLabel').textContent = `PHASE ${current.num} / 5`;
  const segs = $('phaseSegs').children;
  PHASES.forEach((p, i) => {
    segs[i].classList.remove('done', 'current');
    if (new Date() > new Date(p.end + 'T23:59:59-07:00')) segs[i].classList.add('done');
    else if (p.num === current.num) segs[i].classList.add('current');
  });
};

const safe = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const renderToday = (state) => {
  const now = new Date();
  const day = now.toLocaleDateString('en-US', { weekday: 'long' });
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  $('todayDay').textContent = `TODAY · ${day.toUpperCase()} ${date.toUpperCase()}`;

  // Pre-launch: setup phase.
  if (now < STUDY_START) {
    renderSetupView(state);
    return;
  }

  // Post-exam.
  if (now > EXAM_DATE) {
    $('driftRow').innerHTML = '';
    $('lessonCard').innerHTML = '';
    $('weekChecklist').innerHTML = '';
    $('todayTask').textContent = 'Exam complete';
    $('todayDetail').textContent = 'You did it. Now decompress before G26.';
    return;
  }

  renderCurriculumView(state);
};

const renderSetupView = (state) => {
  const checks = state.setupTasks || [];
  const remaining = SETUP_TASKS.length - SETUP_TASKS.filter((_, i) => checks[i]).length;
  const daysToStart = Math.max(0, Math.ceil((STUDY_START - new Date()) / (1000 * 60 * 60 * 24)));

  $('driftRow').innerHTML = `
    <span class="drift-pill">PRE-LAUNCH</span>
    <span class="drift-pill ${remaining === 0 ? 'on-track' : 'behind'}">${remaining === 0 ? 'STACK READY' : remaining + ' TO DO'}</span>
    <span class="drift-pill">${daysToStart} DAYS TO MAY 11</span>
  `;

  $('lessonCard').innerHTML = `
    <div class="lesson-meta"><span class="lesson-pill muted">SETUP PHASE</span></div>
    <div class="lesson-title">Build the resource stack before Mon May 11.</div>
    <div class="lesson-outline">Get the channels subscribed, the FINRA outline downloaded, NotebookLM ready, and the support text sent. <strong>Day 1 starts cold otherwise.</strong></div>
  `;

  $('todayTask').textContent = '';
  $('todayDetail').textContent = '';

  const itemsHtml = SETUP_TASKS.map((t, i) => {
    const done = checks[i];
    const link = t.resource
      ? `<a class="day-link" href="${safe(t.resource)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↗</a>`
      : '<span class="day-link placeholder">↗</span>';
    return `
      <div class="day-item ${done ? 'done' : ''}" data-action="toggle-setup" data-idx="${i}">
        <span class="check-box">${done ? '●' : '○'}</span>
        <span class="day-label">#${i + 1}</span>
        <span class="action-tag">${safe(t.action)}</span>
        <span class="day-title">${safe(t.title)}</span>
        <span class="day-time">${safe(t.time || '')}</span>
        ${link}
      </div>`;
  }).join('');

  $('weekChecklist').innerHTML = `
    <div class="checklist-meta">
      <span>Pre-Launch · <strong>Setup Stack</strong></span>
      <span>${SETUP_TASKS.length - remaining} / ${SETUP_TASKS.length} done</span>
    </div>
    ${itemsHtml}
  `;
};

const renderCurriculumView = (state) => {
  const progressWeek = getProgressWeek(state);
  const calendarWeek = getCalendarWeek();
  const drift = getDrift(state);

  // Drift pills.
  let driftCls, driftLabel;
  if (drift === 0) { driftCls = 'on-track'; driftLabel = 'ON TRACK'; }
  else if (drift > 0) { driftCls = 'ahead'; driftLabel = `+${drift} AHEAD`; }
  else if (drift === -1) { driftCls = 'behind'; driftLabel = '−1 BEHIND'; }
  else { driftCls = 'way-behind'; driftLabel = `${drift} BEHIND`; }
  $('driftRow').innerHTML = `
    <span class="drift-pill">PROGRESS · WK ${progressWeek}</span>
    <span class="drift-pill">CAL · WK ${calendarWeek}</span>
    <span class="drift-pill ${driftCls}">${driftLabel}</span>
  `;

  const week = CURRICULUM[progressWeek] || CURRICULUM[10];
  $('todayTask').textContent = `Week ${progressWeek} · ${week.topic}`;
  $('todayDetail').textContent = `${week.section} · ${(WEEKLY_FOCUS[progressWeek] || WEEKLY_FOCUS[10]).detail}`;

  renderLessonCard(state, progressWeek);
  renderDayList(state, progressWeek);
};

const renderLessonCard = (state, week) => {
  const card = $('lessonCard');
  const isCompleted = !!state.completedWeeks[week];
  if (isCompleted) {
    card.innerHTML = `
      <div class="lesson-meta"><span class="lesson-pill">WEEK COMPLETE</span></div>
      <div class="lesson-title">Week ${week} marked done. Advance, rest, or revisit.</div>
      <div class="lesson-done">✓ All ${getWeekDays(week).length} day-items checked</div>
    `;
    return;
  }

  const next = getNextActionableItem(state, week);
  if (!next) {
    card.innerHTML = `
      <div class="lesson-meta"><span class="lesson-pill">READY TO CLOSE</span></div>
      <div class="lesson-title">All 7 items checked. Tap "Mark Week Complete" below.</div>
    `;
    return;
  }

  const { item, catchUp } = next;
  const tagPill = catchUp
    ? `<span class="lesson-pill catchup">CATCH UP · ${item.day.toUpperCase()}</span>`
    : `<span class="lesson-pill">${item.day.toUpperCase()} · TODAY</span>`;
  const actionPill = `<span class="lesson-pill muted">${safe(item.action)}</span>`;
  const timePill = item.time ? `<span class="lesson-pill muted">${safe(item.time)}</span>` : '';
  const outline = item.outline ? `<div class="lesson-outline">FINRA: <strong>${safe(item.outline)}</strong></div>` : '';
  const link = item.resource
    ? `<a class="lesson-resource" href="${safe(item.resource)}" target="_blank" rel="noopener">▶ Open Resource</a>`
    : '';

  card.innerHTML = `
    <div class="lesson-meta">${tagPill}${actionPill}${timePill}</div>
    <div class="lesson-title">${safe(item.title)}</div>
    ${outline}
    ${link}
  `;
};

const renderDayList = (state, week) => {
  const list = $('weekChecklist');
  const days = getWeekDays(week);
  if (days.length === 0) { list.innerHTML = ''; return; }
  const checks = state.weekItems[week] || [];
  const isCompleted = !!state.completedWeeks[week];
  const todayIdx = (getCalendarWeek() === week) ? getTodayDayIdx() : -1;
  const doneCount = days.filter((_, i) => isCompleted || checks[i]).length;

  const itemsHtml = days.map((d, i) => {
    const done = isCompleted || checks[i];
    const isToday = i === todayIdx;
    const link = d.resource
      ? `<a class="day-link" href="${safe(d.resource)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↗</a>`
      : '<span class="day-link placeholder">↗</span>';
    return `
      <div class="day-item ${done ? 'done' : ''} ${isToday ? 'is-today' : ''}"
           data-action="toggle-week-item" data-week="${week}" data-idx="${i}">
        <span class="check-box">${done ? '●' : '○'}</span>
        <span class="day-label">${safe(d.day)}</span>
        <span class="action-tag">${safe(d.action)}</span>
        <span class="day-title">${safe(d.title)}</span>
        <span class="day-time">${safe(d.time || '')}</span>
        ${link}
      </div>`;
  }).join('');

  const btnLabel = isCompleted ? 'Undo Week Complete' : 'Mark Week Complete';
  const btnAction = isCompleted ? 'unmark-week' : 'mark-week';
  const btnCls = isCompleted ? 'btn' : 'btn primary';

  list.innerHTML = `
    <div class="checklist-meta">
      <span>Week ${week} · <strong>${safe((WEEKLY_FOCUS[week] || WEEKLY_FOCUS[10]).topic)}</strong></span>
      <span>${doneCount} / ${days.length} done</span>
    </div>
    ${itemsHtml}
    <div class="checklist-actions">
      <button class="${btnCls}" data-action="${btnAction}" data-week="${week}">${btnLabel}</button>
    </div>
  `;
};

// Curriculum modal — full 10-week accordion.
const renderCurriculumModal = (state) => {
  const body = $('curriculumBody');
  const progressWeek = getProgressWeek(state);
  body.innerHTML = Object.keys(CURRICULUM).sort((a, b) => Number(a) - Number(b)).map((wk) => {
    const week = CURRICULUM[wk];
    const w = Number(wk);
    const checks = state.weekItems[w] || [];
    const isCompleted = !!state.completedWeeks[w];
    const doneCount = week.days.filter((_, i) => isCompleted || checks[i]).length;
    const isCurrent = w === progressWeek;
    const expanded = isCurrent;

    const daysHtml = week.days.map((d, i) => {
      const done = isCompleted || checks[i];
      const link = d.resource
        ? `<a class="day-link" href="${safe(d.resource)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">↗</a>`
        : '<span class="day-link placeholder">↗</span>';
      return `
        <div class="day-item ${done ? 'done' : ''}"
             data-action="toggle-week-item" data-week="${w}" data-idx="${i}">
          <span class="check-box">${done ? '●' : '○'}</span>
          <span class="day-label">${safe(d.day)}</span>
          <span class="action-tag">${safe(d.action)}</span>
          <span class="day-title">${safe(d.title)}</span>
          <span class="day-time">${safe(d.time || '')}</span>
          ${link}
        </div>`;
    }).join('');

    const stateClass = [
      isCurrent ? 'is-current' : '',
      isCompleted ? 'is-complete' : '',
      expanded ? 'expanded' : ''
    ].join(' ');

    return `
      <div class="curriculum-week ${stateClass}" data-week="${w}">
        <div class="curriculum-week-header" data-action="toggle-curriculum-week" data-week="${w}">
          <span class="week-num">${String(w).padStart(2, '0')}</span>
          <div class="week-meta">
            <div class="week-topic">${safe(week.topic)}</div>
            <div class="week-section">${safe(week.section)}</div>
          </div>
          <span class="week-progress">${doneCount} / ${week.days.length}${isCompleted ? ' · DONE' : ''}</span>
          <span class="week-toggle">▾</span>
        </div>
        <div class="week-days">
          ${daysHtml}
        </div>
      </div>
    `;
  }).join('');
};

const renderPhases = () => {
  const tbody = $('phaseTable');
  const current = getCurrentPhase();
  tbody.innerHTML = PHASES.map((p) => {
    const isCurrent = p.num === current.num;
    const isPast = new Date() > new Date(p.end + 'T23:59:59-07:00');
    const gateClass = isPast ? 'met' : (isCurrent ? 'active' : '');
    return `
      <tr class="${isCurrent ? 'current-phase' : ''}">
        <td class="phase-num">${String(p.num).padStart(2, '0')}</td>
        <td class="phase-name">${p.name}</td>
        <td class="phase-dates">${formatDateRange(p.start, p.end)}</td>
        <td><span class="gate-pill ${gateClass}">${p.gate}</span></td>
      </tr>`;
  }).join('');
};

const getExam = (state, num) => state.exams.find((e) => e.num === num);

const renderExams = (state) => {
  const list = $('examList');
  const now = new Date();
  list.innerHTML = EXAMS.map((e) => {
    const examDate = new Date(e.date + 'T13:00:00-07:00');
    const rec = getExam(state, e.num);
    let scoreHtml;
    if (!rec) {
      if (now < examDate) {
        scoreHtml = '<span class="exam-score locked">—</span>';
      } else {
        scoreHtml = `<button class="btn" style="padding:4px 10px; font-size:10px; min-width:auto; min-height:auto;" data-action="open-exam" data-exam="${e.num}">Log Score</button>`;
      }
    } else {
      const cls = rec.score >= 80 ? 'pass' : (rec.score >= 70 ? 'pending' : 'fail');
      scoreHtml = `<span class="exam-score ${cls}" data-action="open-exam" data-exam="${e.num}">${rec.score}%</span>`;
    }
    return `
      <div class="exam-row">
        <span class="exam-num">${String(e.num).padStart(2, '0')}</span>
        <div class="exam-name"><strong>${e.name}</strong><span>${e.label}</span></div>
        <span class="exam-meta">75 Q · 1h45</span>
        ${scoreHtml}
      </div>`;
  }).join('');
  renderGate(state);
  renderChart(state);
  renderWeakness(state);
};

const renderGate = (state) => {
  const scores = [getExam(state, 2), getExam(state, 3), getExam(state, 4)].map((r) => r?.score);
  const allMet = scores.every((s) => s != null && s >= 80);
  const gateEl = $('gateStatus');
  const textEl = $('gateText');
  if (allMet) {
    gateEl.classList.add('met');
    textEl.textContent = 'GATE CLEARED · Test day eligible';
    return;
  }
  gateEl.classList.remove('met');
  const passed = scores.filter((s) => s != null && s >= 80).length;
  const taken = scores.filter((s) => s != null).length;
  textEl.textContent = taken === 0
    ? 'Awaiting practice exam scores'
    : `${passed} / 3 gate exams at 80%+ · ${taken} taken`;
};

const renderChart = (state) => {
  const wrap = $('chartWrap');
  const points = EXAMS.map((e) => ({ num: e.num, rec: getExam(state, e.num) })).filter((p) => p.rec);
  if (points.length === 0) {
    wrap.innerHTML = '<div class="chart-empty">No exams logged yet</div>';
    return;
  }
  const W = 600, H = 180, PAD_L = 32, PAD_R = 16, PAD_T = 16, PAD_B = 28;
  const innerW = W - PAD_L - PAD_R;
  const innerH = H - PAD_T - PAD_B;
  const yMin = 50, yMax = 100;
  const xFor = (i) => PAD_L + (EXAMS.length === 1 ? innerW / 2 : (i / (EXAMS.length - 1)) * innerW);
  const yFor = (s) => PAD_T + (1 - (Math.max(yMin, Math.min(yMax, s)) - yMin) / (yMax - yMin)) * innerH;

  const gridLines = [50, 70, 80, 100].map((v) => `
    <line x1="${PAD_L}" x2="${W - PAD_R}" y1="${yFor(v)}" y2="${yFor(v)}"
          stroke="${v === 80 ? 'var(--accent-line)' : 'var(--border)'}"
          stroke-dasharray="${v === 80 ? '4,4' : ''}" />
    <text x="${PAD_L - 8}" y="${yFor(v) + 3}" fill="var(--text-faint)"
          font-size="9" text-anchor="end" font-family="JetBrains Mono">${v}</text>
  `).join('');

  const allPts = EXAMS.map((e, i) => ({ i, x: xFor(i), rec: getExam(state, e.num) }));
  const linePts = allPts.filter((p) => p.rec);
  const pathD = linePts.map((p, idx) =>
    `${idx === 0 ? 'M' : 'L'} ${p.x} ${yFor(p.rec.score)}`
  ).join(' ');

  const dots = allPts.map((p, i) => {
    const xTick = `<text x="${p.x}" y="${H - PAD_B + 16}" fill="var(--text-faint)"
                    font-size="9" text-anchor="middle" font-family="JetBrains Mono">#${EXAMS[i].num}</text>`;
    if (!p.rec) return xTick;
    const color = p.rec.score >= 80 ? 'var(--green)' : (p.rec.score >= 70 ? 'var(--yellow)' : 'var(--red)');
    return `
      <circle cx="${p.x}" cy="${yFor(p.rec.score)}" r="5" fill="${color}" stroke="var(--bg-card)" stroke-width="2" />
      <text x="${p.x}" y="${yFor(p.rec.score) - 12}" fill="${color}"
            font-size="11" text-anchor="middle" font-family="JetBrains Mono" font-weight="600">${p.rec.score}</text>
      ${xTick}
    `;
  }).join('');

  wrap.innerHTML = `
    <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-label="Score history">
      ${gridLines}
      ${linePts.length > 1 ? `<path d="${pathD}" fill="none" stroke="var(--accent)" stroke-width="2" />` : ''}
      ${dots}
    </svg>
  `;
};

const renderWeakness = (state) => {
  const counts = {};
  state.exams.forEach((e) => (e.weakUnits || []).forEach((u) => {
    counts[u] = (counts[u] || 0) + 1;
  }));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const list = $('weaknessList');
  if (sorted.length === 0) {
    list.innerHTML = '<div class="chart-empty">Tag weak units when logging exam scores</div>';
    return;
  }
  list.innerHTML = sorted.map(([topic, count]) => `
    <div class="weakness-item">
      <div class="topic">${topic}</div>
      <div class="count">${count}</div>
    </div>
  `).join('');
};

const renderStats = (state) => {
  const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  const today = TODAY_STR();
  let cursor = new Date();
  for (let i = 0; i < 100; i++) {
    const ds = cursor.toISOString().split('T')[0];
    if (sorted.find((s) => s.date === ds)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else if (ds === today) {
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  $('streak').textContent = streak;

  const totalHrs = state.sessions.reduce((sum, s) => sum + (s.hours || 0), 0);
  $('hoursLogged').textContent = totalHrs.toFixed(1);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recent = state.sessions.filter((s) =>
    new Date(s.date + 'T00:00:00') >= sevenDaysAgo && s.confidence
  );
  if (recent.length === 0) {
    $('confValue').textContent = '—';
  } else {
    const avg = recent.reduce((sum, s) => sum + s.confidence, 0) / recent.length;
    $('confValue').innerHTML = `<em>${avg.toFixed(1)}</em>`;
  }
};

const renderSessions = (state) => {
  const list = $('sessionsList');
  $('sessionsMeta').textContent = `${state.sessions.length} LOGGED`;
  if (state.sessions.length === 0) {
    list.innerHTML = '<div class="chart-empty">No sessions logged yet · Start tomorrow</div>';
    return;
  }
  const sorted = [...state.sessions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  list.innerHTML = sorted.map((s) => {
    const d = new Date(s.date + 'T00:00:00');
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const conf = s.confidence ? `${s.confidence}/5` : '—';
    const topic = s.topic || '—';
    const safeTopic = topic.replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `
      <div class="session-row">
        <div class="date">${dateLabel}</div>
        <div class="topic" title="${safeTopic}">${safeTopic}</div>
        <div class="hours">${s.hours.toFixed(1)}h</div>
        <div class="conf">${conf}</div>
      </div>`;
  }).join('');
};

const renderWhiteboards = (state) => {
  const list = $('whiteboardList');
  list.innerHTML = WHITEBOARDS.map((w) => {
    const done = !!state.whiteboards[w.week];
    return `
      <div class="resource ${done ? 'done' : ''}" data-action="toggle-whiteboard" data-week="${w.week}">
        <span class="resource-tag">WK ${w.week}</span>
        <span class="resource-name">${w.topic}</span>
        <span class="resource-arrow">${done ? '●' : '○'}</span>
      </div>`;
  }).join('');
};

const renderHourGrid = (selected) => {
  const grid = $('hourGrid');
  const opts = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
  grid.innerHTML = opts.map((h) => `
    <button class="hour-btn ${selected === h ? 'selected' : ''}" data-action="pick-hours" data-h="${h}">${h}h</button>
  `).join('');
};

const renderConfRow = (selected) => {
  const row = $('confRow');
  row.innerHTML = [1, 2, 3, 4, 5].map((c) => `
    <button class="conf-btn ${selected === c ? 'selected' : ''}" data-action="pick-conf" data-c="${c}">${c}</button>
  `).join('');
};

const renderWeakTags = (selected) => {
  const row = $('weakTagRow');
  row.innerHTML = WEAK_UNITS.map((u) => `
    <button class="tag ${selected.includes(u) ? 'selected' : ''}" data-action="toggle-weak" data-u="${u}">${u}</button>
  `).join('');
};

const renderAll = (state) => {
  renderCountdown();
  renderProgress();
  renderToday(state);
  renderPhases();
  renderExams(state);
  renderSessions(state);
  renderWhiteboards(state);
  renderStats(state);
};
