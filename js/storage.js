// SIE Command Center — localStorage persistence with v1 → v2 migration.
// Schema is JSON-stable. Adding fields with defaults via Object.assign is safe.

const STORAGE_KEY = 'sie-state-v2';
const LEGACY_KEY = 'sie-state';

const emptyState = () => ({
  sessions: [],          // [{ date, hours, confidence, topic, loggedAt }]
  exams: [],             // [{ num, score, weakUnits, notes, loggedAt }]
  whiteboards: {},       // { [week]: ISOString }
  weekItems: {},         // { [week]: [bool, bool, bool, bool] }
  completedWeeks: {},    // { [week]: ISOString }
  installHintDismissed: false
});

const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return Object.assign(emptyState(), JSON.parse(raw));
    // One-time migration from v1.
    const v1raw = localStorage.getItem(LEGACY_KEY);
    if (v1raw) {
      const v1 = JSON.parse(v1raw);
      const migrated = Object.assign(emptyState(), {
        sessions: v1.sessions || [],
        exams: Object.entries(v1.examScores || {}).map(([num, score]) => ({
          num: Number(num),
          score,
          weakUnits: [],
          notes: '',
          loggedAt: new Date().toISOString()
        }))
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
  } catch (e) {
    // fall through to fresh state
  }
  return emptyState();
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const exportState = (state) => {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sie-state-${TODAY_STR()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importState = (onLoaded) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!confirm('Replace current data with imported file?')) return;
        const merged = Object.assign(emptyState(), data);
        saveState(merged);
        onLoaded(merged);
      } catch (err) {
        alert('Invalid file');
      }
    };
    reader.readAsText(file);
  };
  input.click();
};

const resetState = () => {
  if (!confirm('Reset all logged data? This cannot be undone.')) return false;
  if (!confirm('Are you absolutely sure?')) return false;
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(LEGACY_KEY);
  return true;
};
