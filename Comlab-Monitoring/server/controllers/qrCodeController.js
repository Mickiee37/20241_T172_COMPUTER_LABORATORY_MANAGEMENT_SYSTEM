import QRCode from 'qrcode';

// Generate the QR code
export const generateQRCode = async (req, res) => {
  const { instructorName, instructorId } = req.query;

  if (!instructorName || !instructorId) {
    return res.status(400).json({ message: 'Instructor name and ID are required.' });
  }

  try {
    // Create QR code data with instructor info
    const qrData = JSON.stringify({
      instructorId,
      instructorName,
      type: 'attendance'
    });

    // Generate QR code as base64
    const qrCodeUrl = await QRCode.toDataURL(qrData);
    res.json({ qrCodeUrl });
  } catch (error) {
    console.error('QR Code generation error:', error);
    res.status(500).json({ message: 'Failed to generate QR code' });
  }
};