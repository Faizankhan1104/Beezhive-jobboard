import React, { useState } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; // Import the CSS for styling
import { useAuth } from '../../Context/Auth';
import { toast } from 'react-toastify'

// Make sure to set the root element for accessibility

const Login = ({ isOpen, onClose, onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [auth, setAuth] = useAuth();
  const [logStatus, setLogStatus] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });
      console.log(response.data);
      // Check the response status and handle accordingly
      if (response.status === 200) {
        // Authentication successful, you can handle the response here
        const userData = response.data.user;
        console.log('Login successful:');
        toast.success('Login successful')
        setAuth({
          ...auth,
          user: response.data.user,
          token: response.data.token
        })
        localStorage.setItem("auth", JSON.stringify(response.data));
        onLogin(userData);

        onClose();
      } else {
        toast.error('Invalid User or Password');
        console.error('Authentication failed:');
        setLogStatus("Invalid User or Password");
      }
      
      
    } catch (error) {
      console.error('Login error:', error);
    }
  };


  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="login-modal"
      overlayClassName="overlay"
    >
      <div className="modal-content">
        <div className='loginHead'>
          <h4>Login</h4>

          <button className="close" onClick={onClose}>X</button>
        </div>
        {/* <Link id='register' onClick={onSwitchToRegister} >Don't have An Account ?</Link> */}
        <form onSubmit={handleSubmit}>
          <div className="group1">
            <label htmlFor="email">Email</label>
            <input
              className='input_field'
              type="text"
              id="email"
              placeholder='johndoe@gmail.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="group1">
            <label htmlFor="password">Password</label>
            <input
              className='input_field'
              type="password"
              id="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            {logStatus}
            <button className='login' >Login</button>
            <Link id='links' to="/User/forget-password" >Forget Password</Link>
          </div>
        </form>

      </div>
    </Modal>
  );
};

export default Login;
