import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// Load credentials file path and spreadsheet details from environment variables
const __dirname = path.resolve();
const CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, 'comlab-monitoring-4ecec-1d17ce82f9c7.json');
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1p8Dw9nUbe7HElDqWExpqqpl7PC-VjbxTi8S4oof_MXk';
const RANGE = process.env.SHEET_RANGE || 'Sheet1!A:C';

// Load and validate Google credentials
let credentials;
try {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(`Credentials file not found at ${CREDENTIALS_PATH}`);
  }
  credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
} catch (error) {
  console.error('Failed to load Google service account credentials:', error.message);
  process.exit(1); // Exit the process if credentials file cannot be loaded
}

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Initialize Google Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

/**
 * Route to fetch data from Google Sheets and format it.
 */
router.get('/google-sheet-data', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data found in Google Sheets.' });
    }

    // Format data
    const formattedData = rows.map((row, index) => ({
      labNumber: index + 1,
      instructorName: row[0] || 'N/A',
      date: row[1] ? row[1].split(' ')[0] : 'N/A',
      timeIn: row[1] ? row[1].split(' ')[1] : 'N/A',
      additionalInfo: row[2] || 'N/A',
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from Google Sheets.' });
  }
});

export default router;
