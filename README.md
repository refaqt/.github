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
| [workflow-templates/contributor-agreement.yml](workflow-templates/contributor-agreement.yml) | The small file that each repository copies to run the shared check. |

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

## Setup that a maintainer does once

The check needs a token that may write to this repository. It is stored as the organisation
secret `CLA_SIGNATURES_TOKEN`. Without it, the check still runs, but it cannot save new
signatures.

## Licence

Copyright © 2025–2026 Refaqt (BE 0804.145.539) and contributors.

- The agreement texts (`CLA.md`, `CLA-entity.md`): CC BY 4.0. They are based on the Harmony
  Agreements (CC BY 3.0).
- The workflow files: GPL-3.0-or-later, see [LICENSES/GPL-3.0.txt](LICENSES/GPL-3.0.txt).
- All other texts: CC BY-SA 4.0, see [LICENSES/CC-BY-SA-4.0.txt](LICENSES/CC-BY-SA-4.0.txt).

The Refaqt name and logo are trademarks and are not covered by these licences.
