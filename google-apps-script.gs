/**
 * Tom Lab — Friday Sync Speakers
 * Google Apps Script backend.
 *
 * What it does:
 *   • doPost  — receives a form submission and appends it as a row.
 *   • doGet   — returns the APPROVED speakers as JSON for the dashboard.
 *
 * One-time setup:
 *   1. In your Google Sheet: Extensions ▸ Apps Script. Delete any sample code,
 *      paste this whole file, and Save.
 *   2. Run the `setup` function once (select it in the toolbar ▸ Run).
 *      Approve the permission prompt. This creates the header row + checkboxes.
 *   3. Deploy ▸ New deployment ▸ type "Web app":
 *          Execute as:      Me
 *          Who has access:  Anyone
 *      Deploy, then COPY the Web app URL (ends in /exec).
 *   4. Send that /exec URL back and the form + dashboard get wired to it.
 *
 * Day-to-day: new submissions land as rows with Approved unticked. Tick the
 * Approved checkbox to make a speaker appear on the public dashboard.
 */

const SHEET_NAME = 'Speakers';

const HEADERS = [
  'Timestamp', 'Approved', 'Speaker name', 'Profile link', 'Affiliation',
  'Career stage', 'Research areas', 'Why a good fit', 'Best way to contact',
  'How you know them', 'Availability', 'Recommended by', 'Status'
];

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function setup() {
  const sheet = getSheet();
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  sheet.getRange(2, 2, sheet.getMaxRows() - 1, 1).insertCheckboxes();
  SpreadsheetApp.getUi().alert('Setup complete. Now: Deploy ▸ New deployment ▸ Web app.');
}

function doPost(e) {
  try {
    const sheet = getSheet();
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
    }
    const p = (e && e.parameter) || {};
    sheet.appendRow([
      new Date(),
      false,                    // Approved — unticked by default
      p.speaker_name || '',
      p.profile || '',
      p.affiliation || '',
      p.career_stage || '',
      p.keywords || '',
      p.fit || '',
      p.contact || '',
      p.relationship || '',
      p.availability || '',
      p.recommended_by || '',
      'To invite'               // Status default
    ]);
    sheet.getRange(sheet.getLastRow(), 2).insertCheckboxes();
    return json({ success: true });
  } catch (err) {
    return json({ success: false, error: String(err) });
  }
}

function doGet() {
  const sheet = getSheet();
  const values = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < values.length; i++) {
    const r = values[i];
    const approved = r[1] === true || String(r[1]).toUpperCase() === 'TRUE';
    if (!approved) continue;
    const keywords = String(r[6] || '')
      .split(',').map(function (k) { return k.trim(); }).filter(Boolean);
    out.push({
      name: r[2],
      profile: r[3],
      affiliation: r[4],
      career_stage: r[5],
      keywords: keywords,
      fit: r[7],
      availability: r[10],
      recommended_by: r[11],
      status: r[12] || 'To invite'
    });
  }
  return json(out);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
