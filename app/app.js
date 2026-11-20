// GTA VI trophy guide + tracker: a saved checklist (localStorage) with grade/kind/search filters,
// a spoiler setting that hides story trophies until they are earned, and JSON export/import.
// Own code for this entry; the trophy data (official names, descriptions, grades and our own guides)
// lives in data/trophies.json. Works fully offline: it fetches nothing but that local JSON file.
const KEY = 'gta6-trophy-checklist';
const SPOILER_KEY = 'gta6-trophy-hide-spoilers';

const listEl = document.getElementById('trophy-list');
const emptyEl = document.getElementById('empty');
const resultCountEl = document.getElementById('result-count');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('grade');
const kindEl = document.getElementById('kind');
const spoilersEl = document.getElementById('hide-spoilers');
const earnedOnlyEl = document.getElementById('earned-only');
const statusEl = document.getElementById('status');

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const byName = new Map(trophies.map((t) => [t.name, t]));

// Earned set stores trophy ids. Older exports stored names; import accepts both.
let earned = new Set();
try {
  const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
  for (const v of raw) {
    if (typeof v === 'number' && byId.has(v)) earned.add(v);
    else if (typeof v === 'string' && byName.has(v)) earned.add(byName.get(v).id);
  }
} catch { earned = new Set(); }

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

function flash(message) {
  statusEl.textContent = message;
  window.clearTimeout(flash.timer);
  flash.timer = window.setTimeout(() => { statusEl.textContent = ''; }, 4000);
}

// Deep-linkable initial state, so a view can be shared or screenshotted: ?grade=silver&kind=story&spoilers=show
const params = new URLSearchParams(location.search);
if (params.has('grade') && [...gradeEl.options].some((o) => o.value === params.get('grade'))) gradeEl.value = params.get('grade');
if (params.has('kind') && [...kindEl.options].some((o) => o.value === params.get('kind'))) kindEl.value = params.get('kind');
if (params.has('search')) searchEl.value = params.get('search');
if (params.get('spoilers') === 'show') spoilersEl.checked = false;
else if (params.get('spoilers') === 'hide') spoilersEl.checked = true;
else spoilersEl.checked = localStorage.getItem(SPOILER_KEY) !== 'false';
if (params.get('earned') === 'only') earnedOnlyEl.checked = true;

function hideSpoilers() { return spoilersEl.checked; }

function gradeLabel(grade) {
  return grade === 'platinum' ? 'Platinum' : grade === 'gold' ? 'Gold' : grade === 'silver' ? 'Silver' : 'Bronze';
}

function kindLabel(kind) {
  return { story: 'Story', missable: 'Missable', collectible: 'Collectible', activity: 'Activity', other: 'Other' }[kind] ?? kind;
}

function matches(t) {
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindEl.value === 'missable') { if (!t.missable) return false; }
  else if (kindEl.value !== 'all' && t.kind !== kindEl.value) return false;
  if (earnedOnlyEl.checked && !earned.has(t.id)) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !t.name.toLowerCase().includes(q) && !t.description.toLowerCase().includes(q)) return false;
  return true;
}

function trophyCard(t) {
  const isEarned = earned.has(t.id);
  const hidden = t.spoiler && hideSpoilers() && !isEarned;
  const card = document.createElement('article');
  card.className = 'trophy' + (isEarned ? ' earned' : '');
  card.dataset.id = String(t.id);

  const head = document.createElement('div');
  head.className = 'trophy-head';
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${t.name} as earned`);
  box.addEventListener('change', () => {
    if (box.checked) earned.add(t.id); else earned.delete(t.id);
    save();
    render();
  });
  const titleWrap = document.createElement('div');
  titleWrap.className = 'trophy-title';
  const title = document.createElement('h3');
  title.textContent = hidden ? 'Story trophy — hidden until earned' : t.name;
  if (isEarned) {
    const mark = document.createElement('span');
    mark.className = 'earned-mark';
    mark.textContent = ' ✓ earned';
    title.append(mark);
  }
  const desc = document.createElement('p');
  desc.className = 'official-desc';
  desc.textContent = hidden ? 'Hidden by the spoiler setting. Earn this trophy (or turn the setting off) to reveal it.' : t.description;
  titleWrap.append(title, desc);
  head.append(box, titleWrap);
  card.append(head);

  const badges = document.createElement('div');
  badges.className = 'badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge ${t.grade}`;
  gradeBadge.textContent = gradeLabel(t.grade);
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = kindLabel(t.kind);
  badges.append(kindBadge);
  if (t.missable) {
    const miss = document.createElement('span');
    miss.className = 'badge missable';
    miss.textContent = '⚠ Missable';
    badges.append(miss);
  }
  card.append(badges);

  const guide = document.createElement('p');
  guide.className = 'guide';
  if (hidden) {
    const label = document.createElement('span');
    label.className = 'guide-label';
    label.textContent = 'Guide — ';
    const hiddenText = document.createElement('span');
    hiddenText.className = 'hidden-spoiler';
    hiddenText.textContent = 'hidden until earned.';
    guide.append(label, hiddenText);
  } else {
    const label = document.createElement('span');
    label.className = 'guide-label';
    label.textContent = 'Guide — ';
    guide.append(label, document.createTextNode(t.guide));
  }
  card.append(guide);

  const sources = document.createElement('p');
  sources.className = 'sources';
  const strong = document.createElement('strong');
  strong.textContent = 'Sources: ';
  sources.append(strong, document.createTextNode(t.sources.join(' · ')));
  card.append(sources);
  return card;
}

function renderMissable() {
  const list = document.getElementById('missable-list');
  list.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = t.name + ' — ';
    li.append(strong, document.createTextNode(t.description));
    list.append(li);
  }
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  const pct = total ? Math.round((n / total) * 100) : 0;
  document.getElementById('progress-text').textContent = `${n} of ${total} earned`;
  document.getElementById('progress-pct').textContent = `${pct}%`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  const counts = document.getElementById('grade-counts');
  counts.replaceChildren();
  for (const g of ['platinum', 'gold', 'silver', 'bronze']) {
    const span = document.createElement('span');
    const got = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
    const all = trophies.filter((t) => t.grade === g).length;
    span.textContent = `${gradeLabel(g)} ${got}/${all}`;
    counts.append(span);
  }
}

function render() {
  renderProgress();
  const shown = trophies.filter(matches);
  listEl.replaceChildren(...shown.map(trophyCard));
  emptyEl.hidden = shown.length !== 0;
  resultCountEl.textContent = `Showing ${shown.length} of ${trophies.length} trophies` +
    (earned.size ? ` · ${earned.size} earned` : '');
}

document.getElementById('export').addEventListener('click', () => {
  const payload = {
    game: 'Grand Theft Auto VI',
    exported_at: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  flash(`Exported ${earned.size} earned trophies.`);
});

document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const raw = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(raw)) throw new Error('no earned list');
    const next = new Set();
    for (const v of raw) {
      if (typeof v === 'number' && byId.has(v)) next.add(v);
      else if (typeof v === 'string' && byName.has(v)) next.add(byName.get(v).id);
    }
    earned = next;
    save();
    render();
    flash(`Imported ${earned.size} earned trophies.`);
  } catch {
    flash('Import failed: that file is not a trophy-progress export.');
  }
  e.target.value = '';
});

document.getElementById('reset').addEventListener('click', () => {
  if (!window.confirm('Clear all earned trophies? This cannot be undone (export first if you want a backup).')) return;
  earned = new Set();
  save();
  render();
  flash('Progress reset.');
});

spoilersEl.addEventListener('change', () => {
  localStorage.setItem(SPOILER_KEY, String(spoilersEl.checked));
  render();
});
for (const el of [searchEl, gradeEl, kindEl, earnedOnlyEl]) el.addEventListener('input', render);

renderMissable();
render();
