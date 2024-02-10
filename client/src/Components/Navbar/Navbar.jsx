import React from 'react';
import './Navbar.css'
import LoginModal from '../Login/Login';
import RegistrationModal from '../Register/Register';
import { NavLink, Link } from 'react-router-dom';
import { isUserLoggedIn } from '../../auth/auth';
import { useState } from 'react';
import { useAuth } from '../../Context/Auth';
import userImg from '../../assets/profile.png';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userName }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    setIsModalOpen(true);
  };
  const handleRegistrationClick = () => {
    setIsRegistrationModalOpen(true);
  };


  const handleJobPostClick = () => {
    // Check if the user is logged in
    if (auth.user) {
      // Check if the user is an employer
      if (auth.user.userType === 'employer') {
        // Redirect to the job post page
        navigate(`/${auth?.user.userType}/jobpost`);
      } else {
        // Handle the case where the user is not an employer
        console.log('Only employers can post jobs.');
      }
    } else {
      setIsRegistrationModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsRegistrationModalOpen(false);
  };
  const switchLogin = () => {
    setIsModalOpen(true);
    setIsRegistrationModalOpen(false);
  }

  const handleLogin = (email, password) => {
    handleModalClose();
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: ''
    })
    localStorage.removeItem('auth')
  }
  const handleRegistration = (name, email, password) => {
    // Implement your registration logic here
    // Close the modal
    handleModalClose();
  };


  // ==============================================================

  const isJobSeekerLoggedIn = isUserLoggedIn();

  const navbarStyle = {
    backgroundColor: 'white', // Set the background color to white
    color: 'black', // Set the text color to black
  };

  return (
    <nav id='navbar' className="navbar navbar-expand-lg text-dark bg-white p-2">
      <div className="container-fluid">
        <NavLink className="navbar-brand font-weight-light" to="/">
          <span className=' font-weight-bold fs-3 font-italic ' >BEEZHIVE</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse  navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active text-dark" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
            {
              !auth.user ? (<>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle text-dark"
                    to="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Job Seeker
                  </NavLink>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="drp dropdown-item text-dark" onClick={handleLoginClick} >
                        Login
                      </Link>

                    </li>
                    <li>
                      <a className="drp dropdown-item text-dark" onClick={handleRegistrationClick}>
                        Register
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle text-dark"
                    to="#"
                    id="employerDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Employer
                  </NavLink>
                  <LoginModal
                    isOpen={isModalOpen}
                    onClose={handleModalClose}
                    onLogin={handleLogin}
                    swithx={switchLogin}
                  />
                  <RegistrationModal isOpen={isRegistrationModalOpen} onClose={handleModalClose} onRegister={handleRegistration} />
                  <ul className="dropdown-menu" aria-labelledby="employerDropdown">
                    <li>
                      <a className="drp dropdown-item" onClick={handleLoginClick}>
                        Login
                      </a>
                    </li>
                    <li>
                      <a className=" drp dropdown-item" onClick={handleRegistrationClick}>
                        Register
                      </a>
                    </li>
                  </ul>
                </li>
              </>) : (<>
              </>)
            }
          </ul>
          {
            !auth.user ? (<>
              <button className='btn btn-dark ' onClick={handleJobPostClick} >Post Jobs For Free</button>
            </>) : (<>
              <div class="dropdown ">
                <button class="btn d-flex align-items-center btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className=' profile-picture-container'>
                    <img src={userImg} alt='Profile' className='profile-picture-nav' />
                    Profile
                  </div>
                </button>
                <ul class="dropdown-menu ">
                  <li><NavLink class="dropdown-item " to={`/${auth.user?.userType}/profile`}>Hii {auth?.user.name}</NavLink></li>
                  {auth?.user.userType === 'employer' ? (<><li><NavLink class="dropdown-item" to={`/${auth.user?.userType}/myjobs`}>Posted Jobs</NavLink></li><li><NavLink class="dropdown-item" to={`/${auth.user?.userType}/job-applicants`}>Applicants</NavLink></li>

                  </>) : (<li><NavLink class="dropdown-item" to={`/${auth.user?.userType}/my-applied-Job`}>My Jobs</NavLink></li>)}

                  <li>
                    {auth.user?.userType === 'jobseeker' ? (
                      <NavLink class="dropdown-item" to={`/${auth.user?.userType}/resume`}>Upload Resume</NavLink>
                    ) : (
                      <NavLink class="dropdown-item" to={`/${auth.user?.userType}/jobpost`}>Post a Free Job</NavLink>
                    )}
                  </li>
                  <li><NavLink class="dropdown-item" to={`/${auth?.user?.userType}/change-email`}>Change Email</NavLink></li>
                  <li><NavLink onClick={handleLogout} to="/" activeClassName="" activeStyle={null}>
                    Logout
                  </NavLink></li>

                </ul>
              </div>
            </>)}
        </div>

      </div>
    </nav>
  );

};

export default Navbar;
