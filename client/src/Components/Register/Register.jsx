import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios'
import LoginModal from '../Login/Login';
import { useAuth } from '../../Context/Auth'
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Import the CSS for styling
import {toast} from 'react-toastify'

const Registration = ({ isOpen, onClose, onRegister }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('jobseeker');
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password.length < 8) {
            toast.error('Password must be at least 8 characters long');
            return;
        }
        try {
            const response = await axios.post('/api/v1/auth/register', {
                userType,
                name,
                email,
                password,
            });

            if (response.status === 201) {
                // Authentication successful, you can handle the response here
                
          
                // Close the modal
                toast.success('Register Successful')
                onClose();
                
              } else {
                // Authentication failed, handle the error
                console.error('Authentication failed:', response.data.error);
                toast.error("Error registering user");
              }

            onClose()
        } catch (error) {
            console.error('Axios error:', error);
            if (error.response) {
                console.log('Error data:', error.response.data);
                console.log('Error status:', error.response.status);
            }
        }
    };

    const handleLoginClick = () => {
        setIsModalOpen(true);


    };
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleLogin = (email, password) => {
        // Implement your login logic here
        console.log(`Login attempted with email: `);

        // Close the modal
        handleModalClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="registration-modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <div className="registrationHead">
                    <h4>Register</h4>
                    <button className="close" onClick={onClose}>X</button>
                </div>
                {/* <h6 onClick={handleLoginClick}>Already have an account ? </h6> */}
                <form onSubmit={handleSubmit}>
                    <div className='User_type'>
                        <option className={userType === 'jobseeker' ? 'activ' : "user__type"} onClick={(e) => setUserType(e.target.value)} value="jobseeker">Jobseeker</option>
                        <option className={userType === 'employer' ? 'activ' : "user__type"} onClick={(e) => setUserType(e.target.value)} value="employer">Employer</option>
                    </div>
                    <div className="group1" id='name_group1'>
                        <label >Name</label>
                        <input
                            className="input_field"
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="group1">
                        <label >Email</label>
                        <input
                            className="input_field"
                            type="text"
                            id="email"
                            placeholder="johndoe@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="group1">
                        <label >Password</label>
                        <input
                            className="input_field"
                            type="password"
                            id="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <LoginModal
                            isOpen={isModalOpen}
                            onClose={handleModalClose}
                            onLogin={handleLogin}
                        />

                    </div>
                    <button className="register" id='register_btn'>Register</button>
                </form>
            </div>
        </Modal>
    );
};

export default Registration;