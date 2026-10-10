const { pageSize, tickerIntervalMs, tickerVisibleRows, storageKey } = window.APP_CONFIG;

const grid = document.getElementById('agents');
const searchInput = document.getElementById('search');
const resultsList = document.getElementById('results');
const resultsCount = document.getElementById('results-count');
const topbar = document.querySelector('.topbar');
const backToTop = document.getElementById('back-to-top');
const progress = document.getElementById('read-progress');
const tickerToggle = document.getElementById('ticker-toggle');
const preview = document.getElementById('row-preview');
const scrollContext = document.getElementById('scroll-context');

function newestFirst(a, b) {
  if (a.timestamp === b.timestamp) return 0;
  return a.timestamp < b.timestamp ? 1 : -1;
}

window.ACTIVITY.sort(newestFirst);

const callsPerMinute = new Map();
window.ACTIVITY.forEach((event) => {
  event.searchText = (event.timestamp + ' ' + event.agent + ' ' + event.tool + ' ' + event.status + ' ' + event.summary).toLowerCase();
  const minute = event.timestamp.slice(11, 16);
  callsPerMinute.set(minute, (callsPerMinute.get(minute) || 0) + 1);
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-GB', { hour12: false, timeZone: 'UTC' });
}

function countByAgent(events) {
  const counts = {};
  events.forEach((event) => {
    counts[event.agent] = (counts[event.agent] || 0) + 1;
  });
  return counts;
}

function renderAgents() {
  const counts = countByAgent(window.ACTIVITY);
  grid.innerHTML = window.AGENTS.map((agent, index) => {
    const image = 'assets/agents/agent-' + String((index % 12) + 1).padStart(2, '0') + '.png';
    return (
      '<article class="agent-card">' +
      '<img class="agent-avatar" src="' + image + '" width="48" height="48" alt="">' +
      '<h3>' + escapeHtml(agent.name) + '</h3>' +
      '<p class="agent-owner">' + escapeHtml(agent.owner) + '</p>' +
      '<p class="agent-description">' + escapeHtml(agent.description) + '</p>' +
      '<p class="agent-count">' + (counts[agent.name] || 0).toLocaleString() + ' calls today</p>' +
      '</article>'
    );
  }).join('');
}

function loadViewed() {
  return JSON.parse(localStorage.getItem(storageKey) || '[]');
}

function rememberViewed(items) {
  const viewed = loadViewed();
  for (const item of items) {
    if (!viewed.includes(item.id)) {
      viewed.push(item.id);
    }
  }
  localStorage.setItem(storageKey, JSON.stringify(viewed));
}

function search(query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return window.ACTIVITY;
  return window.ACTIVITY.filter((event) => event.searchText.includes(needle));
}

function renderResults(query) {
  const matches = search(query);
  const page = matches.slice(0, pageSize);
  const viewed = loadViewed();
  resultsCount.textContent = matches.length.toLocaleString() + ' matching tool calls';
  resultsList.innerHTML = page.map((event) => {
    const isNew = !viewed.includes(event.id);
    return (
      '<li class="result-row status-' + event.status + '" data-id="' + event.id + '" data-minute="' + event.timestamp.slice(11, 16) + '">' +
      '<span class="result-time">' + formatTime(event.timestamp) + '</span>' +
      '<span class="result-agent">' + escapeHtml(event.agent) + '</span>' +
      '<span class="result-tool">' + escapeHtml(event.tool) + '</span>' +
      '<span class="result-status">' + event.status + '</span>' +
      '<span class="result-latency">' + event.latencyMs + ' ms</span>' +
      '<span class="result-summary">' + escapeHtml(event.summary) + '</span>' +
      (isNew ? '<span class="badge-new">New</span>' : '') +
      '</li>'
    );
  }).join('');
  rememberViewed(page);
}

let focusedRow = null;

function updateScrollContext() {
  const hit = document.elementFromPoint(window.innerWidth / 2, window.innerHeight * 0.45);
  const row = hit ? hit.closest('.result-row') : null;
  if (row === focusedRow) return;
  if (focusedRow) focusedRow.classList.remove('in-focus');
  focusedRow = row;
  if (!row) {
    scrollContext.textContent = '';
    return;
  }
  row.classList.add('in-focus');
  const minute = row.dataset.minute;
  scrollContext.textContent = minute + ' UTC · ' + callsPerMinute.get(minute) + ' calls that minute';
}

function onScroll() {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  updateScrollContext();
  progress.style.width = (max > 0 ? (scrolled / max) * 100 : 0) + '%';
  topbar.classList.toggle('topbar-raised', scrolled > 8);
  backToTop.classList.toggle('visible', scrolled > window.innerHeight);
}

function hidePreview() {
  preview.hidden = true;
}

function showPreview(event) {
  const row = event.target.closest('.result-row');
  if (!row) return;
  const item = window.ACTIVITY.find((candidate) => candidate.id === row.dataset.id);
  if (!item) return;
  preview.textContent = item.summary;
  preview.style.top = event.clientY + 12 + 'px';
  preview.style.left = event.clientX + 12 + 'px';
  preview.hidden = false;
}

let tickerPanel = null;
let tickerTimer = null;

function tickerRow(event) {
  const row = document.createElement('li');
  row.className = 'ticker-row status-' + event.status;
  row.innerHTML =
    '<span class="ticker-time">' + formatTime(event.timestamp) + '</span>' +
    '<span class="ticker-agent">' + escapeHtml(event.agent) + '</span>' +
    '<span class="ticker-tool">' + escapeHtml(event.tool) + '</span>';
  return row;
}

function onTickerKeydown(event) {
  if (event.key === 'Escape') closeTicker();
}

function openTicker() {
  const panel = document.createElement('aside');
  panel.className = 'ticker';
  panel.innerHTML = '<header class="ticker-header">Live tool calls</header><ul class="ticker-list"></ul>';
  document.body.appendChild(panel);
  tickerPanel = panel;
  const list = panel.querySelector('.ticker-list');

  tickerTimer = setInterval(() => {
    const event = window.ACTIVITY[Math.floor(Math.random() * window.ACTIVITY.length)];
    list.prepend(tickerRow(event));
    while (list.children.length > tickerVisibleRows) {
      list.lastElementChild.remove();
    }
  }, tickerIntervalMs);

  window.addEventListener('keydown', onTickerKeydown);
  tickerToggle.setAttribute('aria-pressed', 'true');
  tickerToggle.textContent = 'Hide live calls';
}

function closeTicker() {
  if (!tickerPanel) return;
  clearInterval(tickerTimer);
  window.removeEventListener('keydown', onTickerKeydown);
  tickerPanel.remove();
  tickerPanel = null;
  tickerToggle.setAttribute('aria-pressed', 'false');
  tickerToggle.textContent = 'Show live calls';
}

searchInput.addEventListener('input', () => renderResults(searchInput.value));
window.addEventListener('scroll', onScroll);
resultsList.addEventListener('mousemove', showPreview);
resultsList.addEventListener('mouseleave', hidePreview);
resultsList.addEventListener('wheel', hidePreview);
resultsList.addEventListener('touchstart', hidePreview);
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
tickerToggle.addEventListener('click', () => (tickerPanel ? closeTicker() : openTicker()));

renderAgents();
renderResults('');
