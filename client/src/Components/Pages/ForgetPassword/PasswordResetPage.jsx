import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgetPassword.css';
import Layout from '../../Layout/Layout';
import {toast} from 'react-toastify'

const PasswordResetPage = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetStatus, setResetStatus] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        try {
            // Validate password and confirm password
            if (password !== confirmPassword) {
                setResetStatus('Passwords do not match');
                return;
            }

            // Send a request to the server to reset the password
            const response = await axios.put('/api/v1/email/reset-password', {
                token,
                password,
            });

            // Check the response status and handle accordingly
            if (response.status === 200) {
                // setResetStatus('Password reset successful!');
                navigate('/');
                toast.success('Password reset successful!')
            } else {
                // Password reset failed
                // setResetStatus('Password reset failed. Please try again.');
                toast.error('Password reset failed. Please try again')
            }
        } catch (error) {
            console.error('Password reset error:', error);
            // setResetStatus('Internal Server Error');
            toast.error('Internal Server Error');
        }
    };

    return (
        <Layout>
            <div className='forget-container'>
                <div className='forget-form'>
                    <h2>Password Reset Page</h2>
                    <label htmlFor="password">New Password:</label>
                    <input
                        className='forget_input'
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <br />
                    <button onClick={handlePasswordReset}>Reset Password</button>
                    <p>{resetStatus}</p>
                </div>
            </div>
        </Layout>
    );
};

export default PasswordResetPage;
