import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const QRScanner = () => {
    const [searchParams] = useSearchParams(); // To read query parameters
    const [qrData, setQrData] = useState('');
    const [response, setResponse] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Automatically handle QR code data from URL query
        const queryQrData = searchParams.get('data'); // Read "data" from query parameters
        if (queryQrData) {
            setQrData(queryQrData);
            handleQRSubmit(queryQrData); // Trigger backend call
        }
    }, [searchParams]);

    const handleQRSubmit = async (data = qrData) => {
        try {
            console.log("Sending QR Data:", data); // Log the data being sent
            const result = await axios.post('http://192.168.255.244:8000/api/qr-code/scan', { qrData: data });
            console.log("Response from Backend:", result.data); // Log the backend response
            setResponse(result.data);
            setMessage('QR code scanned and logged successfully!');
        } catch (error) {
            console.error('Error scanning QR code:', error);
            setMessage('Failed to scan QR code.');
        }
    };

    return (
        <div>
            <h1>QR Scanner</h1>
            <p>{message}</p>

            {/* Manual input fallback */}
            <textarea
                placeholder="Paste QR code data here"
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                rows={5}
                cols={40}
            />
            <button onClick={() => handleQRSubmit()}>Submit QR Code</button>

            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default QRScanner;
