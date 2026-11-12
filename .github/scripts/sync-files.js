// SPDX-FileCopyrightText: 2025-2026 Refaqt (BE 0804.145.539) and contributors
// SPDX-License-Identifier: GPL-3.0-or-later
//
// Keeps shared files the same in every Refaqt repository.
//
// The list of files is in .github/sync-files.json. For each repository that the GitHub App
// "Refaqt file sync" can reach, this script:
//   1. reads each target file on the default branch;
//   2. if a file is missing or different, puts the right version on the branch `refaqt-sync`
//      and opens (or updates) one pull request;
//   3. if all files are already right, closes an old sync pull request, if there is one.
//
// It never writes to a default branch. A person reviews and merges each pull request.
// Line endings do not count as a difference: the script compares and writes with LF only.

const fs = require('fs');
const path = require('path');

const BRANCH = 'refaqt-sync';
const TITLE = 'Keep the shared Refaqt workflow files up to date';

function normalise(text) {
  return text.replace(/\r\n/g, '\n');
}

function prBody(changed, sourceRepo) {
  const list = changed.map((f) => `- \`${f.target}\` (${f.state})`).join('\n');
  return [
    '## What changed',
    '',
    'This pull request makes the shared Refaqt files in this repository the same as the',
    `originals in [${sourceRepo}](https://github.com/${sourceRepo}).`,
    '',
    '## Why it matters',
    '',
    'These files switch on checks that every Refaqt repository must run, such as the',
    'contributor agreement check. A missing or old copy means the check does not run, or runs',
    'in an old way.',
    '',
    '## What you need to do',
    '',
    'Merge this pull request. Do not change these files in this repository: change the original',
    `in ${sourceRepo}, and a new pull request comes here by itself.`,
    '',
    '## How it was checked',
    '',
    'A sync job compared each file with the original, without looking at line endings.',
    '',
    '<details>',
    '<summary>Notes for reviewers</summary>',
    '',
    list,
    '',
    `The sync job lives in ${sourceRepo}: \`.github/workflows/sync-files.yml\`. It reuses the`,
    `branch \`${BRANCH}\` and keeps one pull request open at a time.`,
    '',
    '</details>',
  ].join('\n');
}

async function readFile(github, owner, repo, filePath, ref) {
  try {
    const { data } = await github.rest.repos.getContent({ owner, repo, path: filePath, ref });
    if (Array.isArray(data) || data.type !== 'file') return { exists: true, text: null };
    return { exists: true, text: normalise(Buffer.from(data.content, 'base64').toString('utf8')) };
  } catch (e) {
    if (e.status === 404) return { exists: false, text: null };
    throw e;
  }
}

async function getBranchSha(github, owner, repo, branch) {
  try {
    const { data } = await github.rest.git.getRef({ owner, repo, ref: `heads/${branch}` });
    return data.object.sha;
  } catch (e) {
    if (e.status === 404) return null;
    throw e;
  }
}

async function findOpenPr(github, owner, repo) {
  const { data } = await github.rest.pulls.list({
    owner, repo, state: 'open', head: `${owner}:${BRANCH}`, per_page: 10 });
  return data[0] || null;
}

async function syncRepo({ github, owner, repo, files, sourceRepo, dryRun }) {
  const { data: info } = await github.rest.repos.get({ owner, repo });
  const base = info.default_branch;

  const changed = [];
  for (const f of files) {
    const current = await readFile(github, owner, repo, f.target, base);
    if (current.text === f.content) continue;
    changed.push({ ...f, state: current.exists ? 'changed' : 'added' });
  }

  const openPr = await findOpenPr(github, owner, repo);

  if (changed.length === 0) {
    if (openPr && !dryRun) {
      await github.rest.issues.createComment({ owner, repo, issue_number: openPr.number,
        body: 'The files on the default branch are already up to date. This pull request is no longer needed.' });
      await github.rest.pulls.update({ owner, repo, pull_number: openPr.number, state: 'closed' });
      await github.rest.git.deleteRef({ owner, repo, ref: `heads/${BRANCH}` }).catch(() => {});
      return 'up to date, closed old pull request';
    }
    return 'up to date';
  }

  const names = changed.map((f) => `${f.target} (${f.state})`).join(', ');
  if (dryRun) return `would update: ${names}`;

  const baseSha = await getBranchSha(github, owner, repo, base);
  const { data: baseCommit } = await github.rest.git.getCommit({ owner, repo, commit_sha: baseSha });
  const { data: tree } = await github.rest.git.createTree({
    owner, repo, base_tree: baseCommit.tree.sha,
    tree: changed.map((f) => ({ path: f.target, mode: '100644', type: 'blob', content: f.content })),
  });

  // Do not push again when the sync branch already holds exactly this result.
  const branchSha = await getBranchSha(github, owner, repo, BRANCH);
  let same = false;
  if (branchSha) {
    const { data: branchCommit } = await github.rest.git.getCommit({ owner, repo, commit_sha: branchSha });
    same = branchCommit.tree.sha === tree.sha &&
      branchCommit.parents.length === 1 && branchCommit.parents[0].sha === baseSha;
  }

  if (!same) {
    const { data: commit } = await github.rest.git.createCommit({
      owner, repo, tree: tree.sha, parents: [baseSha],
      message: `Update shared Refaqt files from ${sourceRepo}\n\n${changed.map((f) => `- ${f.target}`).join('\n')}`,
    });
    if (branchSha) {
      await github.rest.git.updateRef({ owner, repo, ref: `heads/${BRANCH}`, sha: commit.sha, force: true });
    } else {
      await github.rest.git.createRef({ owner, repo, ref: `refs/heads/${BRANCH}`, sha: commit.sha });
    }
  }

  const body = prBody(changed, sourceRepo);
  if (openPr) {
    await github.rest.pulls.update({ owner, repo, pull_number: openPr.number, title: TITLE, body });
    return `${same ? 'pull request already current' : 'updated pull request'} #${openPr.number}: ${names}`;
  }
  const { data: pr } = await github.rest.pulls.create({
    owner, repo, head: BRANCH, base, title: TITLE, body });
  return `opened pull request #${pr.number}: ${names}`;
}

module.exports = async ({ github, context, core, root, dryRun }) => {
  root = root || process.cwd();
  const config = JSON.parse(fs.readFileSync(path.join(root, '.github/sync-files.json'), 'utf8'));
  const files = config.files.map((f) => ({
    ...f, content: normalise(fs.readFileSync(path.join(root, f.source), 'utf8')) }));
  const skip = new Set(config.skip_repos || []);
  const owner = context.repo.owner;
  const sourceRepo = `${owner}/${context.repo.repo}`;
  skip.add(context.repo.repo);

  const repos = await github.paginate(github.rest.apps.listReposAccessibleToInstallation, { per_page: 100 });
  const rows = [];
  let failures = 0;
  for (const r of repos) {
    if (r.owner.login !== owner) continue;
    let result;
    if (skip.has(r.name)) result = 'skipped (in skip_repos)';
    else if (r.archived) result = 'skipped (archived)';
    else if (r.fork) result = 'skipped (fork)';
    else {
      try {
        result = await syncRepo({ github, owner, repo: r.name, files, sourceRepo, dryRun });
      } catch (e) {
        failures += 1;
        result = `FAILED: ${e.status || ''} ${e.message}`;
        core.warning(`${r.name}: ${e.message}`);
      }
    }
    core.info(`${r.name}: ${result}`);
    rows.push([r.name, result]);
  }

  await core.summary
    .addHeading(dryRun ? 'Shared file sync (dry run, nothing written)' : 'Shared file sync')
    .addTable([[{ data: 'Repository', header: true }, { data: 'Result', header: true }], ...rows])
    .write();

  if (failures > 0) core.setFailed(`${failures} repositories failed. See the warnings above.`);
};
