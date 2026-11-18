# M Square – Documenso (sign.msquarebh.com)

This is M Square's fork of [Documenso](https://github.com/documenso/documenso). Our work lives on the branch
**`msquare/arabic`**: the official Documenso release named in [`UPSTREAM_VERSION`](UPSTREAM_VERSION) plus a few small
commits on top. Everything else is upstream's code.

## What's running now

| | |
|---|---|
| URL | https://sign.msquarebh.com |
| Server | AWS EC2 `more` (`i-0064a64b10bec40bc`, ap-south-1), same server as Track |
| Project path on server | `/opt/documenso/` |
| Image | pinned in `/opt/documenso/docker-compose.yml` (official `documenso/documenso` v2.21.1 until the Arabic image is switched on) |
| Database | `postgres:15` container, volume `documenso_database` |
| Reverse proxy | Caddy (`supabase-caddy`) on the `studio_edge` network |
| Email | SMTP via Hostinger, sender `sign@msquarebh.com` |

Pushing to this repo does **not** change the live site. The server only runs the image its `docker-compose.yml` names.

## Our changes (keep this list short)

| Change | Files |
|---|---|
| Arabic language | `packages/lib/translations/ar/web.po` (new), `packages/lib/constants/locales.ts` (adds `'ar'`), `packages/lib/constants/i18n.ts` (adds the `ar` entry) |
| Right-to-left layout for Arabic | `apps/remix/app/root.tsx` (`dir` on `<html>`) |
| "M Square Design" under the header logo | `apps/remix/app/components/general/app-header.tsx` |
| Emails: long file names wrap inside the border | `packages/email/msquare-text.tsx` (new), `packages/email/components.ts` (exports it as `Text`) |
| Emails: website link in the brand colour | `packages/email/template-components/template-footer.tsx` (`className` on the link) |

Not code (Documenso settings, stored in the database; old values saved in `/opt/documenso/migration/branding-before-20261118.txt`):
brand colours (background `#EFEAE5`, text `#0D213F`, muted `#5F5750`, border `#8A8078`, button `#0D213F`), website
`https://www.msquare.sa`, and the "sent using Documenso" line hidden (`hidePoweredBy` in the organisation's claim).
| Our build and setup | `.github/workflows/msquare-image.yml`, `msquare/` |

Rule: change upstream files as little as possible (a line or two), and put anything bigger in new files. That's what
keeps updates painless.

## How Arabic is chosen

- **Screens, including the signing page:** the viewer's language. It comes from the language picker (stored in the
  `lang` cookie), or else from the browser's language. Arabic switches the page to right-to-left.
- **Emails:** the document's language (document settings → Language, or the team/organisation default under
  Settings → Document preferences). Track can send `meta.language: "ar"` when it creates a document.

## Building the image

Every push to `msquare/arabic` runs **Actions → M Square image**. The workflow builds `docker/Dockerfile` and pushes:

- `ghcr.io/msquare-design/documenso:<version>-ar-<commit>`: pin this one on the server.
- `ghcr.io/msquare-design/documenso:<version>-ar`: the latest build for that version.

To deploy, on the server:
1. In `/opt/documenso/docker-compose.yml`, set `image:` to the new tag.
2. Run `docker compose up -d documenso`.

To go back, put the previous `image:` line back and run the same command.

## Updating to a new Documenso release

```sh
git switch msquare/arabic
msquare/update.sh v2.22.0          # rebases our commits onto that release, keeps msquare/backup-<old>
git push --force-with-lease origin msquare/arabic
```

- **Conflicts:** they can only happen in the few upstream files listed above. Keep upstream's version and re-add our
  one-line change.
- **New strings:** strings added in the release show in English until they're translated in `ar/web.po`. The build also
  picks them up automatically, so nothing breaks.
- **Database:** Documenso runs its database migrations itself when the new image starts. Take a database backup first:
  `/opt/documenso/backup.sh`.

## Files here

- `docker-compose.yml`: copy of the compose file on the server (when it was on Hostinger; the live one is on AWS).
- `.env.example`: every variable the server needs, **without values**. The real `.env` and `cert.p12` live only on
  the server. Never commit them.
- `email-templates.md`: the Arabic/English email subjects and messages used in the Documenso templates (General,
  Invoice, Purchase Order, Quotation, Contract).
- `UPSTREAM_VERSION`: the Documenso release our branch sits on.
- `update.sh`: moves our changes onto a new release.

## Editing the built-in emails

The fixed email layouts (buttons, headers, footers) are React Email components:

- `packages/email/templates/`: one file per email, e.g. `document-invite.tsx`, `document-completed.tsx`,
  `document-reminder.tsx`.
- `packages/email/template-components/`: shared pieces used by those emails.

Their text is translated through `ar/web.po` like the rest of the app, so prefer editing the Arabic wording there.
