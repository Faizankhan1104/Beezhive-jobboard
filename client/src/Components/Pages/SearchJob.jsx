import React, { useState } from 'react'
import Layout from '../Layout/Layout'
import { useSearch } from '../../Context/Search'
import { useAuth } from '../../Context/Auth'
import axios from 'axios';
import { GiMoneyStack } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import striptags from 'striptags';
import LoginModal from '../Login/Login';


const SearchJob = () => {
  const [values, setValues] = useSearch();
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);


  const handleApplyClick = (job) => {
    // Redirect to the appropriate page when Apply is clicked
    if (!auth?.user?._id) {
      setIsModalOpen(true);
    } else if (!auth.user.userType === "employer" && !auth.user.resume) {
      navigate(`/${auth.user?.userType}/resume`);
    } else if (job.applicants && job.applicants.includes(auth.user._id)) {
      navigate(`/jobs/${job.slug}`);
    } else {
      navigate(`/jobs/${job.slug}`);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (email, password) => {
    console.log(`Login attempted with email: `);
    handleModalClose();
  };

  return (
    <Layout>
      <div className="container">
        <div className="text_center">
          <h1>Search Result</h1>

          {/* Check if value.results is defined before accessing its length */}
          <h5>
            {values?.results && values.results.length === 0 ? 'No Jobs Found' : `Found ${values.results.length} Jobs`}
          </h5>


          <div className='jobList'>
            <ul>
              {values?.results && values.results.map((job) => (
                <li className='lists' key={job.id}>
                  <h5>{job.jobTitle}</h5>
                  <p className='pera'>{job.company}</p>
                  <div className='job_details'>
                    <span className='peraSub'><MdOutlineWorkHistory /> {job.experience}</span>
                    <span className='peraSub'><GiMoneyStack /> {job.salary}</span>
                    <span className='peraSub'><IoLocationOutline /> {job.location}</span>
                  </div>
                  <div className='peraSub apply_job'>{striptags(job.description).substring(0, 75) + "..."}
                    {job.applicants && job.applicants.includes(auth?.user?._id) ? (<Link to={`/jobs/${job.slug}`}>Applied</Link>) : (<button onClick={() => handleApplyClick(job)}>Apply</button>)}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <LoginModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onLogin={handleLogin}
        />
      </div>
    </Layout>
  )
}

export default SearchJob
