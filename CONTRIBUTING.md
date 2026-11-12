# Contributing to Refaqt

<!-- SPDX-FileCopyrightText: 2025-2026 Refaqt (BE 0804.145.539) and contributors -->
<!-- SPDX-License-Identifier: CC-BY-SA-4.0 -->

Thank you for helping. This manual applies to every repository of Refaqt, public and private.
A repository can add its own `CONTRIBUTING.md` with technical steps, such as how to run its
checks. The rules on this page still apply.

## 1. The short version

1. Make a branch or a fork, and open a pull request.
2. On your first pull request, a check asks you to accept the
   [Refaqt Contributor Licence Agreement](CLA.md). You post one sentence as a comment. You do
   this once, and it covers all Refaqt repositories.
3. If you work for a company that may own your work, the company signs the
   [company addendum](CLA-entity.md) once.
4. Mark anything that you did not make yourself, such as supplier CAD files or datasheets.
5. A maintainer reviews and merges your pull request.

## 2. The contributor agreement in plain words

The full text is in [CLA.md](CLA.md). That text is what counts. In short:

- **You keep your copyright.** You also keep your other rights, such as design rights and
  patents.
- **You give Refaqt a licence.** It is free, worldwide, and permanent. Refaqt may use, change,
  manufacture, and sell your work, and license it to others under any licence. That includes
  open licences (CERN-OHL-S, GPL, CC BY-SA) and paid licences (the Refaqt OEM licence). Refaqt
  needs this so it can defend the open licences and keep the projects financially healthy.
- **Your work stays open in public repositories.** For a contribution to a public repository,
  Refaqt promises that it also stays available under the open licence that the repository used
  on that day.
- **Private repositories are confidential.** Do not share what you see there.
- **You promise that the work is yours to give**, and you tell us about anything from someone
  else.
- **Belgian law applies.**

### How to accept

When you open your first pull request, the check "Contributor agreement" posts a comment. Post
this exact sentence as a new comment on the pull request:

```
I have read the Refaqt Contributor Licence Agreement version 1.0 and I agree to it.
```

The check runs again and turns green. If it does not, post `recheck` as a comment.

Every commit must be linked to your GitHub account. If the check says that a commit is "not
linked", add that commit's email address to your GitHub account (Settings, Emails), or change
the author of the commit.

If someone else helped you with a commit, for example a co-author, that person must also accept
the agreement.

### Companies

If you contribute as an employee, a freelancer for a client, or a partner company's staff
member, your employer or client may own rights in your work. Then the company signs the
[company addendum](CLA-entity.md) and lists who may contribute. Send the signed addendum to
Refaqt at the email address in the agreement. Each person still posts the sentence above.

## 3. Copyright notices

Refaqt owns the copyright in its own work, and contributors keep the copyright in theirs. Every
repository shows this notice:

```
Copyright © 2025–2026 Refaqt (BE 0804.145.539) and contributors.
```

### In new files

When you add a new file that we made ourselves, put these two lines at the top, as a comment, if
the file format allows comments:

```
SPDX-FileCopyrightText: 2025-2026 Refaqt (BE 0804.145.539) and contributors
SPDX-License-Identifier: <the licence of the folder>
```

Use the licence of the folder in which the file lives. The `LICENSE` file in that folder tells
you which one it is. The usual values are `CERN-OHL-S-2.0` (hardware), `GPL-3.0-or-later`
(software and firmware), and `CC-BY-SA-4.0` (documentation and media).

Examples of formats with comments: Python, shell scripts, JavaScript, TypeScript, CSS, HTML,
Markdown, TOML, YAML, OpenSCAD, and FreeCAD macros. Files without comments, such as FreeCAD
`.FCStd`, STEP, STL, images, and PDF, do not get these lines. The `LICENSE` file in their folder
covers them.

### Material from others

Never put the Refaqt notice on material that someone else made. Keep their own notice and licence.
Put it in the folder that the repository uses for it (for example `vendor/` or
`docs/datasheets/`), and add a `LICENSE` file there with its source and licence.

## 4. Licences

Each public repository says in its `LICENSE` file which licence applies to which folder. The
usual mix is:

| Kind of work | Licence |
| --- | --- |
| Hardware: CAD, drawings, schematics, board files, bills of materials | CERN-OHL-S v2.0 |
| Software, firmware, scripts, simulation | GPL-3.0 |
| Documentation, images, website text | CC BY-SA 4.0 |

Private repositories have no open licence. Their content is confidential, and all rights are
reserved.

The Refaqt names and logos are trademarks. The licences do not cover them. See the
`TRADEMARKS.md` file in each repository.

## 5. Working together

- Write in clear, simple English.
- Keep each pull request small and about one thing.
- Run the checks of the repository before you push. The repository's own `CONTRIBUTING.md` or
  `README.md` says how.
- Be kind and patient with each other.

## 6. Questions

Open an issue in the repository, or write to Refaqt at the email address in the
[agreement](CLA.md).
