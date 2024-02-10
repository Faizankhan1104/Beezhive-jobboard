import React from 'react'
import Navbar from '../Navbar/Navbar'
import Footer from '../Footer/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar />
            <main>
                <ToastContainer />
                {children}
            </main>
            <Footer />

        </div>
    )
}

export default Layout