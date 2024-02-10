import React from 'react'
import { useState, useEffect } from 'react'
import { useAuth } from '../../Context/Auth'
import {useNavigate, Outlet } from "react-router-dom";
import axios from 'axios';
import Login from '../Login/Login';



export default function Private ()  {
    const [ok, setOk] = useState(false);
    const [auth, setAuth] = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(true);
    const navigate = useNavigate();
    const handleModalClose = () => {
        setIsModalOpen(false);
        navigate('/');
      };


    useEffect(() => {
        const authCheck = async () => {
            const res = await axios.get('/api/v1/auth/user-auth',
                {
                    headers: {
                        'Authorization': auth?.token
                    }

                })
            if (res.data.ok) {
                setOk(true);
            } else {
                setOk(false)
            }
        }
        if (auth?.token) authCheck();
    }, [auth?.token])
    
    return ok ? <Outlet /> : <Login isOpen={isModalOpen} onClose={handleModalClose}/>;

}
