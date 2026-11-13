# M Square – Documenso (sign.msquarebh.com)

This is M Square's fork of [Documenso](https://github.com/documenso/documenso). The rest of the repo is the upstream source; this folder holds our own deployment setup.

## What's running now

| | |
|---|---|
| URL | https://sign.msquarebh.com |
| Server | Hostinger VPS `srv788049.hstgr.cloud` |
| Project path on server | `/opt/documenso/` |
| Image | `documenso/documenso:latest` (official image — **not** built from this fork yet) |
| Database | `postgres:15` container, volume `documenso_database` |
| Reverse proxy | Traefik from `/root/docker-compose.yml` (shared with n8n) |
| Email | SMTP via Hostinger, sender `sign@msquarebh.com` |

Pushing to this repo does **not** change the live site. The server only runs what its `docker-compose.yml` says.

## Files here

- `docker-compose.yml` – copy of the compose file on the server.
- `.env.example` – every variable the server needs, **without values**. The real `.env` and `cert.p12` live only on the server; never commit them.
- `email-templates.md` – the Arabic/English email subjects and messages used in the Documenso templates (General, Invoice, Purchase Order, Quotation, Contract).

## Editing the built-in emails

The fixed email layouts (buttons, headers, footers) are React Email components:

- `packages/email/templates/` – one file per email, e.g. `document-invite.tsx`, `document-completed.tsx`, `document-reminder.tsx`.
- `packages/email/template-components/` – shared pieces used by those emails.

To ship a change:

1. Edit the files and commit.
2. Build an image from `docker/Dockerfile` (see `docker/README.md`) and push it to a registry, or build it on the VPS.
3. On the server, change `image:` in `/opt/documenso/docker-compose.yml` to the new image and run `docker compose up -d`.

Keep the fork in sync with upstream (`Sync fork` on GitHub) before building, so security fixes aren't missed.
