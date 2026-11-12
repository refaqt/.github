# refaqt/.github

<!-- SPDX-FileCopyrightText: 2025-2026 Refaqt (BE 0804.145.539) and contributors -->
<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

This repository holds the rules that apply to all Refaqt repositories.

| File | What it is |
| --- | --- |
| [CONTRIBUTING.md](CONTRIBUTING.md) | The contributor manual. GitHub shows it in every Refaqt repository that has no manual of its own. |
| [CLA.md](CLA.md) | The Refaqt Contributor Licence Agreement, the one official copy. |
| [CLA-entity.md](CLA-entity.md) | The addendum that a company signs when its people contribute. |
| [.github/workflows/cla.yml](.github/workflows/cla.yml) | The shared check that asks contributors to accept the agreement. |
| [workflow-templates/contributor-agreement.yml](workflow-templates/contributor-agreement.yml) | The small file that switches the shared check on. The sync job copies it to every repository. |
| [.github/workflows/sync-files.yml](.github/workflows/sync-files.yml) | The sync job. It keeps the shared files the same in every Refaqt repository. |
| [.github/sync-files.json](.github/sync-files.json) | The list of shared files, and the repositories that the sync job skips. |

The signatures are stored on the branch `cla-signatures`, in `signatures/cla-v1.json`.
Companies that signed the addendum are listed by hand in `signatures/entities.json` on the same
branch, in this form:

```json
{
  "entities": [
    {
      "name": "Example Company NV",
      "signed_at": "2026-12-01",
      "members": [{ "login": "github-account", "id": 123456 }]
    }
  ]
}
```

Do not protect the branch `cla-signatures`. The check must be able to write to it.

## How the shared files reach every repository

GitHub only runs workflow files that sit in the repository itself. So each repository needs its
own copy of the small file in `workflow-templates/`. You do not copy it by hand. The sync job does
it:

- It runs when a file in `workflow-templates/` changes, every Monday, and when you start it by
  hand on its page in the **Actions** tab of this repository:
  https://github.com/refaqt/.github/actions/workflows/sync-files.yml
- For each repository with a missing or old copy, it opens one pull request from the branch
  `refaqt-sync`. A person merges it. The job never writes to a default branch.
- It skips archived repositories, forks, and the repositories in `skip_repos` in
  `.github/sync-files.json`.
- Line endings do not count. Only real changes start a pull request.

To share one more file, add it to `files` in `.github/sync-files.json`. Do not change a copy in
another repository: the next sync puts the original back.

## Setup that a maintainer does once

### Token for the signatures

The check needs a token that may write to this repository. It is stored as the organisation
secret `CLA_SIGNATURES_TOKEN`. Without it, the check still runs, but it cannot save new
signatures.

### GitHub App for the sync job

1. Open **Organisation settings**, **Developer settings**, **GitHub Apps**, **New GitHub App**.
2. Name: `Refaqt file sync`. Homepage URL: `https://github.com/refaqt/.github`.
3. Under **Webhook**, clear **Active**.
4. Under **Repository permissions**, set:
   - **Contents**: Read and write
   - **Pull requests**: Read and write
   - **Workflows**: Read and write (GitHub refuses changes to workflow files without it)
   - **Metadata**: Read-only (set by GitHub)
5. Under **Where can this GitHub App be installed?**, choose **Only on this account**. Create
   the App.
6. Write down the **App ID**. Choose **Generate a private key**. Your browser saves a `.pem`
   file.
7. Choose **Install App**, then the `refaqt` organisation, then **All repositories**. New
   repositories then get the files too.
8. Open **Organisation settings**, **Secrets and variables**, **Actions**:
   - On the **Variables** tab, add `SYNC_APP_ID` with the App ID.
   - On the **Secrets** tab, add `SYNC_APP_PRIVATE_KEY`. Paste the full content of the `.pem`
     file. Under **Repository access**, choose only the `.github` repository.
9. Delete the `.pem` file from your computer.
10. Open the page of the sync job in the **Actions** tab of the `refaqt/.github` repository (not
    the organisation settings):
    https://github.com/refaqt/.github/actions/workflows/sync-files.yml
    - Above the list of runs, on the right, click the grey button **Run workflow**.
    - In the box that opens, tick **Only report what would change**. Click the green
      **Run workflow** button.
    - After a few seconds, click the new run and scroll down to its summary. It lists each
      repository and what would change. Nothing is written yet.
    - Then do the same again without the tick. This opens the pull requests.

    The job also starts by itself when its files change on `main`. So the first upload may
    already have started a run. A red first run is normal if the App was not ready yet.

## Licence

Copyright © 2025–2026 Refaqt (BE 0804.145.539) and contributors.

- The agreement texts (`CLA.md`, `CLA-entity.md`): CC BY 4.0. They are based on the Harmony
  Agreements (CC BY 3.0).
- The workflow files: GPL-3.0-or-later, see [LICENSES/GPL-3.0.txt](LICENSES/GPL-3.0.txt).
- All other texts: CC BY-SA 4.0, see [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).

The Refaqt name and logo are trademarks and are not covered by these licences.
