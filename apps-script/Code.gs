/**
 * Landway Innovation — CTA lead capture (Google Apps Script backend).
 *
 * Receives { name, phone, project, page } from the CTA form on any of the
 * project sites (Sharda Enclave, Kalp Residency, …) or the main website, then:
 *
 *   1. appends [Date, Name, Phone, Project, Page] to this spreadsheet, and
 *   2. emails the same details to the address in NOTIFY_EMAIL.
 *
 * Runs entirely inside Google — free, no server, no third-party service.
 *
 * Setup: Extensions → Apps Script (from the Google Sheet), paste this in,
 * then Deploy → Manage deployments → edit → New version (see README.md).
 */

// The tab (sheet) name to write into.
var SHEET_NAME = 'Sheet1';

// Where the "new lead" notification is sent.
var NOTIFY_EMAIL = 'shubham.singh@landwayinnovation.com';

// Used when an older cached page posts without a project name.
var UNKNOWN_PROJECT = 'Unknown (not sent by page)';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var name = (data.name || '').toString().trim();
    var phone = (data.phone || '').toString().trim();

    // Project name is detected by the page itself and sent with the form.
    // Falls back gracefully so a stale cached page can never lose a lead.
    var project = (data.project || '').toString().trim() || UNKNOWN_PROJECT;
    var page = (data.page || '').toString().trim();

    // Name: letters and spaces only, at least 2 letters.
    if (!/^[A-Za-z][A-Za-z ]*$/.test(name) || name.replace(/ /g, '').length < 2) {
      return json({ ok: false, error: 'invalid name' });
    }

    // Phone: 10-digit Indian mobile number (starts 6–9).
    if (!/^[6-9][0-9]{9}$/.test(phone)) {
      return json({ ok: false, error: 'invalid phone' });
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    // Human-readable timestamp in India time for the "Date" column.
    var date = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, HH:mm');

    // Column order: Date, Name, Phone, Project, Page
    sheet.appendRow([date, name, phone, project, page]);

    // The sheet write is the source of truth — never let a mail failure
    // (quota, transient error) turn a captured lead into an error response.
    try {
      sendNotification(name, phone, project, page, date);
    } catch (mailErr) {
      console.error('lead saved but email failed: ' + mailErr);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function sendNotification(name, phone, project, page, date) {
  var subject = 'New Lead — ' + project + ' — ' + name;

  var body =
    'A new enquiry was submitted on the website.\n\n' +
    'Name: ' + name + '\n' +
    'Phone Number: ' + phone + '\n' +
    'Project: ' + project + '\n\n' +
    'Submitted: ' + date + ' IST\n' +
    (page ? 'Page: ' + page + '\n' : '');

  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#111">' +
    '<p style="margin:0 0 16px">A new enquiry was submitted on the website.</p>' +
    '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">' +
    row('Name', name) +
    row('Phone Number', '<a href="tel:+91' + phone + '">' + phone + '</a>') +
    row('Project', project) +
    '</table>' +
    '<p style="margin:16px 0 0;color:#666;font-size:13px">Submitted: ' + date + ' IST' +
    (page ? '<br>Page: <a href="' + page + '">' + page + '</a>' : '') +
    '</p></div>';

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    body: body,
    htmlBody: html,
    name: 'Landway Website',
    replyTo: NOTIFY_EMAIL,
  });
}

function row(label, value) {
  return (
    '<tr>' +
    '<td style="border:1px solid #e5e5e5;background:#fafafa;font-weight:bold">' + label + '</td>' +
    '<td style="border:1px solid #e5e5e5">' + value + '</td>' +
    '</tr>'
  );
}

// Lets you open the /exec URL in a browser to confirm it's live.
function doGet() {
  return json({ ok: true, service: 'landway-cta' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Run this once from the Apps Script editor (Run → testLead) to check that the
 * sheet row and the email both work, without touching the live website.
 */
function testLead() {
  var res = doPost({
    postData: {
      contents: JSON.stringify({
        name: 'Test Lead',
        phone: '9876543210',
        project: 'Sharda Enclave',
        page: 'https://example.com/sharda-enclave',
      }),
    },
  });
  console.log(res.getContent());
}
