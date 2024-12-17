import QRCode from 'qrcode';
import Instructor from '../models/instructor.js';
import Key from '../models/key.js';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

// Set Google DNS Resolver to avoid ENOTFOUND errors
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Constants for Google Sheets
const SPREADSHEET_ID = '1p8Dw9nUbe7HElDqWExpqqpl7PC-VjbxTi8S4oof_MXk';
const RANGE = 'Sheet1!A:B';

// Path to your Google Service Account JSON file
const credentialsPath = path.resolve('./comlab-monitoring-4ecec-a1e7074749a3.json');
const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));

// Configure Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({
  version: 'v4',
  auth,
  rootUrl: 'https://sheets.googleapis.com', // Ensure this is set explicitly
});


// Helper function to append data to Google Sheets
const appendToGoogleSheet = async (spreadsheetId, range, values) => {
  try {
    console.log('Appending to Google Sheet:', { spreadsheetId, range, values });
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [values],
      },
    });
    console.log('Data appended successfully:', response.data);
  } catch (error) {
    console.error('Error appending to Google Sheets:', error.message || error.response?.data);
    throw new Error(`Google Sheets Error: ${error.message}`);
  }
};

// Generate Instructor QR Code
export const generateInstructorQR = async (req, res) => {
  try {
    const { instructorId } = req.body;

    const instructor = await Instructor.findById(instructorId);
    if (!instructor) return res.status(404).json({ message: 'Instructor not found' });

    const qrData = JSON.stringify({ type: 'instructor', id: instructorId });
    const qrCode = await QRCode.toDataURL(qrData);

    instructor.qrCode = qrCode;
    await instructor.save();

    res.json({ message: 'Instructor QR code generated', qrCode });
  } catch (error) {
    console.error('Error generating QR Code:', error.message);
    res.status(500).json({ message: 'Error generating QR Code', error: error.message });
  }
};

// Generate Key QR Code
export const generateKeyQR = async (req, res) => {
  try {
    const { labId } = req.body;

    const key = await Key.findOne({ labId });
    if (!key) return res.status(404).json({ message: 'Key not found' });

    const qrData = JSON.stringify({ type: 'key', id: key._id });
    const qrCode = await QRCode.toDataURL(qrData);

    key.qrCode = qrCode;
    await key.save();

    res.json({ message: 'Key QR code generated', qrCode });
  } catch (error) {
    console.error('Error generating QR Code:', error.message);
    res.status(500).json({ message: 'Error generating QR Code', error: error.message });
  }
};

// Scan QR Code and Log to Google Sheets
export const scanQRCode = async (req, res) => {
  try {
    const { name, timeIn } = req.query;

    if (!name || !timeIn) {
      return res.status(400).json({ message: 'Missing required fields: name or timeIn' });
    }

    console.log('Received QR Data:', { name, timeIn });

    const newRow = [name, timeIn];
    await appendToGoogleSheet(SPREADSHEET_ID, RANGE, newRow);

    console.log('Data successfully logged to Google Sheets');
    res.status(200).json({ message: 'QR code scan logged successfully!' });
  } catch (error) {
    console.error('Error logging to Google Sheets:', error.message);
    res.status(500).json({ message: 'Error logging QR scan', error: error.message });
  }
};