import QRCode from 'qrcode';

// Generate the QR code
export const generateQRCode = (req, res) => {
  const { instructorName, timeIn, date } = req.query;

  if (!instructorName || !timeIn || !date) {
    return res.status(400).json({ message: 'Instructor name, timeIn, and date are required.' });
  }

  const qrCodeData = `${instructorName} logged in at ${timeIn} on ${date}`;

  QRCode.toDataURL(qrCodeData, (err, url) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to generate QR code' });
    }

    res.json({ qrCodeUrl: url });
  });
};
