# 🧭 GitHub Workflow Guide

This guide defines the **standard workflow** we follow when working with GitHub issues, branches, commits, and pull requests. Adhering to this process ensures clean history, traceability, and smooth
collaboration.

<br><br>

# 🛠️ 1. Create or Pick an Issue

All development starts with an issue.

-   Report bugs, propose features, or suggest improvements via GitHub Issues.
-   Clearly describe the problem or proposal.
-   Discuss before implementation if needed. <br><br><br>

# 🌿 2. Create a Branch for the Issue

<br>

Start by pulling the latest `main` branch:

```bash
git pull origin main
git checkout -b fix/NN-description
```

#### 🔹 Naming Convention:

-   fix/ `<issue-number>-<short-desc>` → for bug fixes
-   feature/ `<issue-number>-<short-desc>` → for new features <br><br><br>

# ✍️ 3. Make Changes and Commit (Using Vim)

<br>
After editing your code, stage and commit your changes:

```bash
git add .
git commit
```

In the Vim editor that opens, follow this structure:

```bash
fix: align navbar links on mobile

- Applied flex-wrap to navbar container
- Adjusted breakpoints for responsive behavior

Fixes #42
```

### Vim Navigation Cheatsheet

-   `i` → Insert mode (start typing)
-   `Esc` → Exit insert mode
-   `:wq` → Save and exit (write & quit)
-   `:q!` → Exit without saving
-   `/word` → Search for “word”
-   `dd` → Delete current line
-   `u` → Undo last change
-   `Ctrl + d` / `Ctrl + u` → Scroll down/up <br> <br>

## 📌 Commit Message Format

**Header**: `<type>`: short summary (max ~72 characters)

**Body**: Detailed explanation, wrapped at 72 characters

**Footer**: GitHub keywords to link issues

<br>

## 🔗 🔗 Referencing and Closing Issues with Keywords

<br>

Use these when you want to **reference an issue** without closing it automatically:

| Reference       | Description                                             |
| --------------- | ------------------------------------------------------- |
| `See #n`        | Adds a link to the issue for further context            |
| `Ref #n`        | Short for "reference", links without closing            |
| `Related to #n` | Indicates contextual relevance or partial work          |
| `(#n)`          | Mentioning issue number in title or body creates a link |

---

<br>

Use these keywords in commit footers or PR descriptions to **automatically close issues**:

| Keyword       | Description                            |
| ------------- | -------------------------------------- |
| `Fixes #n`    | Closes the issue when the PR is merged |
| `Closes #n`   | Closes the issue when the PR is merged |
| `Resolves #n` | Closes the issue when the PR is merged |
| `Fixed #n`    | Closes the issue when the PR is merged |
| `Closed #n`   | Closes the issue when the PR is merged |
| `Resolved #n` | Closes the issue when the PR is merged |

<br>
<br>

# 🚀 4. Push and Open a Pull Request

<br>

Push your branch to the remote repo:

```bash
git push origin fix/NN-description
```

Then go to GitHub and open a pull request into main.

```
### 📝 Pull Request Template (Recommended)

## Summary

Fixed navbar layout on mobile screens by applying flex-wrap.

## Changes

- Updated mobile breakpoint handling
- Tweaked navbar flex properties

## Issue

Fixes #42

## Screenshots

(Add before/after images if relevant)

## Checklist

- [x] Code builds and runs locally
- [x] Functionality tested
- [x] Linked issue is resolved
```

<br>

# ✅ 5. Merge and Clean Up

<br>

Once approved, choose “Squash and merge” on GitHub (preferred for a clean, single-commit history). GitHub will auto-close the issue if `Fixes #n` is included.

After merging:

```bash
git branch -d fix/42-navbar-mobile-layout     # Delete local branch
git fetch --prune      # Remove remote branch references

```
