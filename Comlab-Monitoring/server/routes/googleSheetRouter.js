import express from 'express';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// Load service account key
const __dirname = path.resolve();
const serviceAccountPath = path.join(__dirname, 'comlab-monitoring-4ecec-33d6a77860a5.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

// Set up Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Spreadsheet details
const SPREADSHEET_ID = '1p8Dw9nUbe7HElDqWExpqqpl7PC-VjbxTi8S4oof_MXk';
const RANGE = 'Sheet1!A:C';

const router = express.Router();

router.get('/google-sheet-data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    console.log('Raw Google Sheets Data:', rows); // Log the raw data fetched from Sheets

    const data = rows.map((row, index) => {
      const [date, time] = (row[1] || '').split(' ');
      return {
        labNumber: index + 1,
        instructorName: row[0] || 'N/A',
        date: date || null,
        timeIn: time || null,
      };
    });

    console.log('Processed Data:', data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).send('Error fetching data');
  }
});


export default router;
