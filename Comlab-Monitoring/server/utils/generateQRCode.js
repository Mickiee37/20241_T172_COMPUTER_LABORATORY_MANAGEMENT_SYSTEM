import QRCode from 'qrcode';

// Base URL for scanning QR codes
const baseUrl = `http://192.168.255.244:8000/api/qr-code/scan`;

// Generate the QR code
QRCode.toFile('./qrcode.png', baseUrl, (err) => {
    if (err) {
        console.error("Error generating QR code:", err);
    } else {
        console.log("QR code generated and saved as qrcode.png");
    }
});
