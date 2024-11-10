import QRCode from 'qrcode';

// Generate the QR code
export const generateQRCode = (req, res) => {
  const { instructorName, timeIn, date } = req.query;

  if (!instructorName || !timeIn || !date) {
    return res.status(400).json({ message: 'Instructor name, timeIn, and date are required.' });
  }

  // Generate the QR code data
  const qrCodeData = `${instructorName} logged in at ${timeIn} on ${date}`;

  // Generate QR code image as base64 string
  QRCode.toDataURL(qrCodeData, (err, url) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }

    // Return the QR code URL to the frontend
    res.json({ qrCodeUrl: url });
  });
};
