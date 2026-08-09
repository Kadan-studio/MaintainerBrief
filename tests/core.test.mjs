import assert from 'node:assert/strict';
import test from 'node:test';
import { DESCRIPTION_LIMIT, SELECTED_TEXT_LIMIT, buildClipboardText, parseGitHubUrl, truncateText } from '../core.mjs';

const issue = { type: 'issue', repository: 'octo/widgets', number: '42', title: 'Broken export', url: 'https://github.com/octo/widgets/issues/42', description: 'Steps to reproduce.', selectedText: 'Relevant line.' };
const pull = { ...issue, type: 'pull', number: '99', url: 'https://github.com/octo/widgets/pull/99', title: 'Fix export' };

test('parses a GitHub Issue URL', () => {
  assert.deepEqual(parseGitHubUrl(issue.url), { owner: 'octo', repo: 'widgets', repository: 'octo/widgets', type: 'issue', number: '42' });
});

test('parses a GitHub Pull Request URL', () => {
  assert.equal(parseGitHubUrl(pull.url).type, 'pull');
});

test('rejects unsupported GitHub URLs', () => {
  assert.equal(parseGitHubUrl('https://github.com/octo/widgets/issues'), null);
  assert.equal(parseGitHubUrl('https://github.com/octo/widgets/pull/1/files'), null);
});

test('rejects non-GitHub URLs', () => {
  assert.equal(parseGitHubUrl('https://example.com/octo/widgets/issues/42'), null);
});

test('builds Issue triage output', () => {
  const output = buildClipboardText(issue, 'triage');
  assert.match(output, /# GitHub Issue Context/);
  assert.match(output, /Triage this issue\./);
  assert.match(output, /## Selected text\n\nRelevant line\./);
});

test('builds Issue fix output', () => {
  assert.match(buildClipboardText(issue, 'fix'), /Do not assume the issue report is correct/);
});

test('builds PR review output', () => {
  assert.match(buildClipboardText(pull, 'review'), /Review this pull request\./);
});

test('builds PR fix output', () => {
  assert.match(buildClipboardText(pull, 'fix'), /Preserve unrelated behavior\./);
});

test('truncates descriptions within their maximum including marker', () => {
  const value = truncateText('a'.repeat(DESCRIPTION_LIMIT + 4), DESCRIPTION_LIMIT);
  assert.equal(value.length, DESCRIPTION_LIMIT);
  assert.match(value, /\[truncated\]$/);
});

test('truncates selected text within its maximum including marker', () => {
  const value = truncateText('b'.repeat(SELECTED_TEXT_LIMIT + 4), SELECTED_TEXT_LIMIT);
  assert.equal(value.length, SELECTED_TEXT_LIMIT);
  assert.match(value, /\[truncated\]$/);
});
