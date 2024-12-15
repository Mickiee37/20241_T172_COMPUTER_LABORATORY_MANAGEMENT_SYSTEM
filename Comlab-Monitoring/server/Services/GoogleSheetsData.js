
import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const GoogleSheetsData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: '33d6a77860a50700be156c91eadfa4e80913a44a', // Replace with your API key
        clientId: '118319732916876781354', // Replace with your Client ID
        scope: 'https://www.googleapis.com/auth/spreadsheets.readonly',
        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
      }).then(() => {
        // Fetch data from Google Sheets
        gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: 'YOUR1p8Dw9nUbe7HElDqWExpqqpl7PC-VjbxTi8S4oof_MXk', // Replace with your Spreadsheet ID
          range: 'Sheet1!A1:E', // Adjust the range based on your sheet's structure
        }).then(response => {
          const sheetData = response.result.values;
          setData(sheetData);
          // Send the data to your backend server
          sendDataToBackend(sheetData);
        });
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  // Send data to the backend API
  const sendDataToBackend = async (sheetData) => {
    try {
      const response = await fetch('/api/store-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: sheetData }), // Send the data as a JSON payload
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error('Error sending data to backend:', error);
    }
  };

  return (
    <div>
      <h1>Google Sheets Data</h1>
      <ul>
        {data.map((row, index) => (
          <li key={index}>{row.join(', ')}</li> // Display rows from the sheet
        ))}
      </ul>
    </div>
  );
};

export default GoogleSheetsData;
