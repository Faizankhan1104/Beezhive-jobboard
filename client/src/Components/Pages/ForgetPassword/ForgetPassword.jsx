import React, { useState } from 'react';
import './ForgetPassword.css'; // Import your CSS for styling
import Layout from '../../Layout/Layout';
import axios from 'axios';
import { toast } from 'react-toastify';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [otpStatus, setOTPStatus] = useState('');


  const handleSendOTP = async () => {
    try {
      // Make an API call to your backend to send OTP
      const response = await axios.post('/api/v1/email/forgot-password', { email });
      
      setButtonDisabled(true);
      if (response.status === 200) {
        toast.success("Check Your Email")
        setOtpSent(true);
        
        // setOTPStatus("Check your email")
        
        
      } else if (response.status === 400) {
        // setOTPStatus("User Not Found")
        toast.error("User Not Found")

      } else {
        console.error('Failed to send OTP');
        toast.error('Failed to send OTP')
      }
    } catch (error) {
      // console.error('Error sending OTP:', error);
      toast.error('Error sending OTP: Internar Server Error')
    }
  };

  return (
    <Layout>
      <div className='forget-container'>
        <div className='forget-form'>
          <label>Enter Your Registered Email</label>
          <input
            type="text"
            value={email}
            required={true}
            placeholder="example@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP} disabled={isButtonDisabled} >Send OTP</button>
          <p>{otpStatus}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ForgetPassword;
