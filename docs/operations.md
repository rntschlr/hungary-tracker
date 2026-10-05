# Operations and data boundaries

## Current architecture

The application is a static React bundle on GitHub Pages. There is no server API,
authentication, remote storage, document upload, or automatic device sync.
Browser storage holds document IDs and completion booleans. The source catalog
controls titles and descriptions. Stored values cannot replace catalog text.

This is an organizational checklist, not an authoritative permit-requirement
service. Requirements depend on the permit and applicant. Verify them with the
Hungarian immigration authority before relying on a checklist.

## Data recovery

Download a JSON backup before clearing site data, moving domains, or changing
devices. Restore validates the application identity, schema version, document IDs,
unique records, booleans, and a 16 KiB file limit before asking to replace progress.
An invalid file does not change the current checklist. Storage failures display
an alert; the app remains usable for that session, but closing it may lose changes.

There is no server backup to recover from. Users should keep exported files in
a location they control. Multiple open tabs can overwrite local progress; use
one active tab when editing and export before switching browsers.

## Release

1. Use Node 22.13+ and `npm ci`.
2. Run `npm run check` for regression tests, build, and dependency audit.
3. Use `npm run dev` and verify checking/unchecking, reload persistence, reset
   confirmation, backup download, and restore on desktop and mobile.
4. Pull requests run checks without publishing. Only `master` can deploy to Pages.
5. After release, load `/hungary-tracker/` directly and verify assets and saved
   progress. To roll back, revert the change through a PR and redeploy a known-good
   commit. Restore a user's progress only from their own confirmed backup.

## Before offering accounts or server sync

A full-stack edition needs a chosen hosting and identity provider, a persistent
database, server-side per-user authorization, migrations, conflict resolution,
rate limits, export/deletion, and tested backups. Gate deployment on integration
tests that prove user A cannot read or overwrite user B's records. Existing local
progress must not upload without the user's deliberate import or sync action.

GitHub Pages cannot run this backend. Choose a separate application runtime or
move the app to a full-stack host, then update the privacy explanation before
collecting user data. Do not add an unauthenticated JSON endpoint as a shortcut.
