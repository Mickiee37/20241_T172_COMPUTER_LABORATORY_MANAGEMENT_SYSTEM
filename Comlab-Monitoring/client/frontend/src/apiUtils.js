import axios from 'axios';

// Open Lab by scanning Lab QR Code
export const scanLabQRCode = async (labNumber) => {
  try {
    const response = await axios.post('http://192.168.194.244:8000/api/labs/scan-lab', { labNumber });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Error scanning Lab QR Code');
  }
};

// Assign Instructor by scanning Instructor QR Code
export const scanInstructorQRCode = async (labNumber, instructorName) => {
  try {
    const response = await axios.post('http://192.168.194.244:8000/api/labs/scan-instructor', {
      labNumber,
      instructorName,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message || 'Error scanning Instructor QR Code');
  }
};
