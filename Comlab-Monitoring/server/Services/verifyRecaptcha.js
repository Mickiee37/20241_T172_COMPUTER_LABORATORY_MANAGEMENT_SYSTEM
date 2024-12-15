const verifyRecaptcha = async (recaptchaValue) => {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaValue}`;
  
    try {
      const response = await axios.get(url);  // Change POST to GET
      return response.data.success;
    } catch (err) {
      console.error('Error verifying reCAPTCHA:', err);
      return false;
    }
  };
  