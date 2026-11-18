#!/usr/bin/env bash
# Moves M Square's changes onto a new Documenso release.
#
#   msquare/update.sh v2.22.0
#
# 1. Keeps the current branch as msquare/backup-<old version> (to go back).
# 2. Rebases our few commits from the old release onto the new one.
# 3. Adds the release's new strings to the Arabic catalogue (they show in English until translated).
# 4. You review, then `git push --force-with-lease origin msquare/arabic` → GitHub Actions builds the image.
set -euo pipefail

TARGET=${1:?usage: msquare/update.sh <documenso version, e.g. v2.22.0>}
cd "$(git rev-parse --show-toplevel)"
[ "$(git branch --show-current)" = "msquare/arabic" ] || { echo "Switch to msquare/arabic first."; exit 1; }
git diff --quiet && git diff --cached --quiet || { echo "Commit or stash your changes first."; exit 1; }

CURRENT=$(cat msquare/UPSTREAM_VERSION)
git remote get-url upstream >/dev/null 2>&1 || git remote add upstream https://github.com/documenso/documenso.git
git fetch --no-tags upstream "refs/tags/$CURRENT:refs/tags/$CURRENT" "refs/tags/$TARGET:refs/tags/$TARGET"

git branch -f "msquare/backup-$CURRENT" HEAD
echo "Backup: msquare/backup-$CURRENT"

if ! git rebase --onto "$TARGET" "$CURRENT"; then
  echo
  echo "Conflicts in:"; git diff --name-only --diff-filter=U
  echo "Fix them (keep upstream's code and re-add our small change), then: git add <files> && git rebase --continue"
  echo "Or give up: git rebase --abort"
  exit 1
fi

echo "$TARGET" > msquare/UPSTREAM_VERSION
# New strings into the Arabic catalogue only (other languages untouched). Needs `npm ci` once.
if [ -d node_modules ]; then npx lingui extract --locale ar; else echo "(skipped string extraction: run npm ci first)"; fi
git add msquare/UPSTREAM_VERSION packages/lib/translations/ar/web.po
git commit -m "Move M Square changes onto Documenso $TARGET"

echo
echo "Done. Untranslated Arabic strings: $(grep -c '^msgstr ""$' packages/lib/translations/ar/web.po || true)"
echo "Push to build: git push --force-with-lease origin msquare/arabic"
