import React from 'react'
import "./Sidebar.css"
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/Auth';


const EmployerSidebar = () => {
    const [auth, setAuth] = useAuth();
    const handleLogout = () => {
        setAuth({
          ...auth,
          user: null,
          token: ''
        })
        localStorage.removeItem('auth')
      }
    return (
        
            <div className="sidebar_profile">                
                <NavLink to={`/${auth.user?.userType}/profile`}activeClassName="active-link">Profile</NavLink>
                <NavLink to={`/${auth.user?.userType}/resume`} activeClassName="active-link">Post A Job</NavLink>
                <NavLink to={`/${auth.user?.userType}/myjobs`} activeClassName="active-link">Posted Jobs</NavLink>
                <NavLink to={`/${auth.user?.userType}/myjobs`} activeClassName="active-link">Application</NavLink>
                <NavLink to="/change-email" activeClassName="active-link">Change Email</NavLink>
                <NavLink onClick={handleLogout} to="/" activeClassName="active-link">Logout</NavLink>
            </div>
    )
}

export default EmployerSidebar