import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Path to service account JSON
const __dirname = path.resolve();
const credentialsPath = path.join(
  __dirname,
  'comlab-monitoring-4ecec-1d17ce82f9c7.json' // Ensure this file exists at this path
);

// Load credentials safely
let credentials;
try {
  credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
} catch (error) {
  console.error('Failed to load Google service account credentials:', error.message);
  process.exit(1); // Exit if credentials file cannot be loaded
}

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Initialize Google Sheets API
const sheets = google.sheets({ version: 'v4', auth });

// Spreadsheet details
const SPREADSHEET_ID = '1p8Dw9nUbe7HElDqWExpqqpl7PC-VjbxTi8S4oof_MXk';
const RANGE = 'Sheet1!A:C';

// Express Router Setup
import express from 'express';
const router = express.Router();

router.get('/google-sheet-data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    const data = rows.map((row, index) => ({
      labNumber: index + 1,
      instructorName: row[0] || 'N/A',
      date: (row[1] || '').split(' ')[0] || null,
      timeIn: (row[1] || '').split(' ')[1] || null,
    }));

    res.json(data);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error.message);
    res.status(500).send('Error fetching data');
  }
});

export default router;