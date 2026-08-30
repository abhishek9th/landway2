# CTA Backend — Google Apps Script (free)

The lead form (`name`, `phone`, `project`, `page`) writes into your Google Sheet
**and** emails the details to the sales inbox, using a script that lives inside
the sheet. No server, no hosting, ₹0/year.

```
CTA form ──POST { name, phone, project, page }──► Apps Script web app ──┬──► Google Sheet (Date, Name, Phone, Project, Page)
                                                                        └──► Email to shubham.singh@landwayinnovation.com
```

The project name is **detected automatically** by each site — every project app
sends its own `BRAND.project` value (Sharda Enclave, Kalp Residency, …) and the
main website sends the page it was submitted from. Nobody types it in.

## 1. Prepare the sheet

1. Open your Google Sheet.
2. Headers in row 1: `Date`, `Name`, `Phone`, `Project`, `Page`.
   (Old sheets only have the first three — just add `Project` and `Page` in
   D1 and E1. Existing rows are untouched.)
3. Note the tab name at the bottom (default `Sheet1`). If it differs, change
   `SHEET_NAME` at the top of `Code.gs`.

## 2. Add / update the script

1. In the sheet: **Extensions → Apps Script**.
2. Select all the existing code and replace it with everything from
   [`Code.gs`](./Code.gs), then **Save**.
3. Check `NOTIFY_EMAIL` at the top — it's set to
   `shubham.singh@landwayinnovation.com`.

## 3. Deploy

**First time:** Deploy → New deployment → gear ⚙ → Web app.

- **Execute as:** **Me**
- **Who has access:** **Anyone** ← required so the website can post
- **Deploy** → authorize (your account → *Advanced* → *Go to project (unsafe)*
  → *Allow*). The first authorization now also asks for permission to send
  email as you — that's the notification.
- Copy the **Web app URL** (ends in `/exec`).

**Updating an existing deployment (this is the case here):**
Deploy → **Manage deployments** → edit ✏ → **Version: New version** → Deploy.
The `/exec` URL stays the same, so nothing on the website needs changing.
You will be asked to re-authorize once, because sending email is a new permission.

## 4. Connect the website

Already done — every site posts to the URL in its `.env`:

```
VITE_API_URL=https://script.google.com/macros/s/XXXXXXXXXXXX/exec
```

## Test

- Open the `/exec` URL in a browser → `{"ok":true,"service":"landway-cta"}`.
- In the Apps Script editor, pick `testLead` from the function dropdown and
  **Run** → a "Sharda Enclave" test row appears and a test email arrives.
- Submit the real CTA form on a project page → the row's Project column shows
  that project's name, and the email subject reads `New Lead — <Project> — <Name>`.

## Notes

- **Email failures never lose a lead.** The sheet write happens first; if the
  mail quota is exhausted the row is still saved and the error is logged.
- **Free-tier email quota:** consumer Gmail accounts can send 100 emails/day
  from Apps Script (Workspace accounts: 1,500/day). Well above lead volume.
- **Old cached pages** that still post only `{name, phone}` keep working — their
  Project column reads `Unknown (not sent by page)` instead of failing.
- **Note on `Content-Type`:** the frontend posts as `text/plain` on purpose.
  Apps Script can't answer a CORS preflight, and `text/plain` keeps the request
  "simple" so the browser skips it. The script still parses the body as JSON.
