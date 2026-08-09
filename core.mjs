export const DESCRIPTION_LIMIT = 6000;
export const SELECTED_TEXT_LIMIT = 2000;

export function parseGitHubUrl(rawUrl) {
  let url;
  try { url = new URL(rawUrl); } catch { return null; }
  if (url.hostname !== 'github.com') return null;
  const match = url.pathname.match(/^\/([^/]+)\/([^/]+)\/(issues|pull)\/(\d+)\/?$/);
  if (!match) return null;
  const [, owner, repo, kind, number] = match;
  return { owner, repo, repository: `${owner}/${repo}`, type: kind === 'issues' ? 'issue' : 'pull', number };
}

export function normalizeText(value) {
  return String(value ?? '')
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map((line) => line.trim().replace(/[\t \f\v]+/g, ' '))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function truncateText(value, limit) {
  const text = normalizeText(value);
  if (text.length <= limit) return text;
  const marker = '[truncated]';
  if (limit <= marker.length) return marker.slice(0, limit);
  return `${text.slice(0, limit - marker.length).trimEnd()}${marker}`;
}

function taskFor(type, action) {
  const tasks = {
    issue: {
      triage: `Triage this issue.\n\nDetermine:\n\n* whether the report is actionable\n* what important information is missing\n* likely affected areas to inspect\n* the recommended next maintainer action\n\nDo not invent repository facts that are not supported by the issue or codebase.`,
      fix: `Use this issue as the task context.\n\nInspect the repository before editing.\nVerify the reported behavior where practical.\nImplement the smallest correct fix.\nAdd or update focused tests when appropriate.\nReport changed files and verification performed.\n\nDo not assume the issue report is correct without checking the codebase.`
    },
    pull: {
      review: `Review this pull request.\n\nPrioritize concrete, actionable findings involving:\n\n* correctness\n* regressions\n* security-relevant mistakes\n* maintainability\n* missing or insufficient tests\n\nDo not invent findings unsupported by the code.`,
      fix: `Use this pull request as the task context.\n\nInspect the repository and the relevant changes before editing.\nAddress the concrete problem with the smallest correct change.\nPreserve unrelated behavior.\nAdd or update focused tests when appropriate.\nReport changed files and verification performed.\n\nDo not invent requirements not supported by the pull request or codebase.`
    }
  };
  return tasks[type]?.[action] ?? '';
}

export function buildClipboardText(context, action) {
  const label = context.type === 'issue' ? 'Issue' : 'Pull Request';
  const heading = context.type === 'issue' ? 'GitHub Issue' : 'GitHub Pull Request';
  const description = truncateText(context.description, DESCRIPTION_LIMIT);
  const selectedText = truncateText(context.selectedText, SELECTED_TEXT_LIMIT);
  const parts = [
    `# ${heading} Context`,
    `Repository: ${context.repository}`,
    `${label}: #${context.number}`,
    `Title: ${normalizeText(context.title)}`,
    `URL: ${context.url}`,
    '## Description',
    description
  ];
  if (selectedText) parts.push('## Selected text', selectedText);
  parts.push('## Task', taskFor(context.type, action));
  return parts.join('\n\n');
}
