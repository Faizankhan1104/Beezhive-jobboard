import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar';
import { useAuth } from '../../Context/Auth';
import axios from 'axios';
import { RiVerifiedBadgeLine } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify'
import { classNames } from 'primereact/utils';


const EmailChange = () => {
    const [otp, setOtp] = useState('');
    const [verificationStatus, setVerificationStatus] = useState('');
    const [auth, setAuth] = useAuth();
    const [otpbtn, setOtpBtn] = useState(false)
    const [verificationCode, setVerificationCode] = useState('');
    const [user, setUser] = useState();
    const [newEmail, setNewEmail] = useState('');
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState();
    const [isclassName, setClassName] = useState('otp_btnn')



    useEffect(() => {
        const fetchUserProfile = async () => {
            
            try {
                const response = await axios.get(`/api/v1/auth/get-User/${auth.user._id}`);


                if (response.data) {
                    
                    setUser(response.data.user);
                } else {
                    console.error('Profile picture data not found in the response.');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserProfile();
    }, [auth]);


    const sendOTP = async (email) => {
        
        try {
            // Send a request to your backend to send the OTP to the provided email

            const response = await axios.post('/api/v1/email/send-verification-email', {
                email,
            });

            const result = await response.data;
            
            setVerificationCode(result.verificationCode)
            
            setClassName('dis_btn')

            if (response.status ===  200 ) {
                
                toast.success('OTP sent successfully! Check your email')
                setOtpBtn(true);

            } else {
                setVerificationStatus('Failed to send OTP. Please try again.');
                toast.error('Failed to send OTP. Please try again.')
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to send OTP. Please try again.')
        }
    };
    

    const verifyOTP = async (email) => {
        
        try {
            if (otp === verificationCode.toString()) {
                const response = await axios.put(`/api/v1/email/verified-email/${email}`, {});
                setVerificationStatus('Verification successful!');
                window.location.reload(true);
                toast.success('OTP sent successfully! Check your email')

            } else {
                // setVerificationStatus('Incorrect verification code. Please try again.');
                toast.error('Incorrect verification code. Please try again.')
            }
        } catch (error) {
            console.error(error);
            toast.error('Incorrect verification code. Please try again.')
        }
    };

    const handlechangeEmail = async () => {
        try {
            // Make a request to update the email with the newEmail and currentPassword
            const response = await axios.put(`/api/v1/email/change-email/${auth.user?._id}`, {
                newEmail,
                currentPassword,
            });

            if (response.status === 200) {
                // setVerificationStatus('Email changed successfully!');
                toast.success('Incorrect verification code. Please try again.')
                window.location.reload(true);
            } else {
                setVerificationStatus('Failed to change email. Please try again.');
                toast.error('Incorrect password code. Please try again.')
            }
        } catch (error) {
            console.error(error);
            toast.error('Error: Please try again.')
        }
    };

    return (
        <>
            <Sidebar />
            <div className='_Myjobs'>
                <div className="email_change">
                    <label>Email</label>
                    <input
                        className='currentEmail'
                        type="text"
                        value={user?.email}
                    // onChange={(e) => setOtp(e.target.value)}
                    />
                    {user?.verified ? (<><RiVerifiedBadgeLine className='icon_verified' /></>) : (<></>)}
                    {user?.verified ? (<></>) : (<>
                        <p className='verifie_your_email'>Please Verify Your Email !</p>
                        <button className={isclassName}  onClick={() => sendOTP(user?.email)} disabled={otpbtn} >
                            Send OTP
                        </button></>)}

                </div>
                {user?.verified ? (<></>) : (<><div className="email_change">
                    <label>Enter OTP</label>
                    <input
                        type="text"
                        required={true}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button className='otp_btnn' onClick={() => verifyOTP(user?.email)}>
                        Verify
                    </button>
                </div></>)}
                <p>{verificationStatus}</p>

                <div>

                    <div className='newEmail'>
                        <h5>Change Email</h5>
                        <label >New Email</label>
                        <input type="text"
                            required={true}
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)} />

                        <label >Current Password</label>
                        <input type="password"
                            required={true}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)} />

                        <button className='otp_btnn' onClick={handlechangeEmail} >Submit</button>
                        <p>{verificationStatus}</p>
                    </div>

                </div>
            </div>
        </>
    );
};

export default EmailChange;
