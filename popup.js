import { buildClipboardText, normalizeText, parseGitHubUrl } from './core.mjs';

const ui = Object.fromEntries(['state', 'repository', 'title', 'signals', 'description-status', 'selection-status', 'primary', 'secondary'].map((id) => [id, document.getElementById(id)]));
let context = null;

function extractPageData() {
  const text = (element) => element ? element.innerText : '';
  const titleElement = document.querySelector('[data-testid="issue-title"], .gh-header-title .js-issue-title, h1');
  const descriptionElement = document.querySelector('[data-testid="issue-body"], .js-comment-container .comment-body, .timeline-comment-group .comment-body');
  return {
    title: text(titleElement).replace(/\s+#\d+\s*$/, ''),
    description: text(descriptionElement),
    selectedText: window.getSelection?.().toString() ?? ''
  };
}

function setCopyButtons(type) {
  const primaryAction = type === 'issue' ? 'triage' : 'review';
  ui.primary.textContent = type === 'issue' ? 'Copy for triage' : 'Copy for review';
  ui.secondary.textContent = 'Copy for fix';
  ui.primary.onclick = () => copy(primaryAction, ui.primary);
  ui.secondary.onclick = () => copy('fix', ui.secondary);
  ui.primary.disabled = false;
  ui.secondary.disabled = false;
}

async function copy(action, button) {
  try {
    await navigator.clipboard.writeText(buildClipboardText(context, action));
    const original = button.textContent;
    button.textContent = 'Copied';
    setTimeout(() => { button.textContent = original; }, 1200);
  } catch {
    ui.state.textContent = 'Clipboard write failed';
  }
}

async function initialise() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const parsed = parseGitHubUrl(tab?.url);
  if (!parsed) { ui.state.textContent = 'No supported GitHub context'; return; }
  try {
    const [{ result }] = await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: extractPageData });
    context = { ...parsed, url: tab.url, title: normalizeText(result.title), description: result.description, selectedText: result.selectedText };
    ui.state.textContent = parsed.type === 'issue' ? 'GitHub Issue' : 'Pull Request';
    ui.repository.textContent = `${parsed.repository} · #${parsed.number}`;
    ui.repository.hidden = false;
    ui.title.textContent = context.title || '(Title not detected)';
    ui.title.hidden = false;
    ui.signals.hidden = false;
    ui['description-status'].textContent = normalizeText(context.description) ? 'Detected' : 'Not detected';
    ui['selection-status'].textContent = normalizeText(context.selectedText) ? 'Detected' : 'Not detected';
    setCopyButtons(parsed.type);
  } catch {
    ui.state.textContent = 'Could not read this GitHub page';
  }
}

initialise();
