import React, { useState, useEffect } from 'react';
import './showJobs.css';
import userImg from '../../assets/profile.png';
import searchImg from '../../assets/searchImage.jpg';
import { BiChevronUp, BiChevronDown } from 'react-icons/bi'
import Layout from '../Layout/Layout';
import { useAuth } from '../../Context/Auth'
import axios from 'axios';
import { GiMoneyStack } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import { Link, Navigate, useNavigate } from 'react-router-dom';
import striptags from 'striptags';
import LoginModal from '../Login/Login';
import Multiselect from 'multiselect-react-dropdown';
import { skillArrays, techStacks } from '../../Skills';
import SearchInput from '../Form/SearchInput';
import { classNames } from 'primereact/utils';

const ShowJobs = () => {
  const [selectedExperience, setSelectedExperience] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectSkills, setSelectSkills] = useState([]);
  const [auth, setAuth] = useAuth();
  const [jobData, setJobData] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [experience, setExperience] = useState('');
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [currentSkills, setCurrentSkills] = useState([]);
  const [jobsToShow, setJobsToShow] = useState(3);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`/api/v1/job/getjobs`);
        setJobData(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);


  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleLogin = (email, password) => {
    console.log(`Login attempted with email:`);
    handleModalClose();
  };

  const handleExperienceChange = (e) => {
    setExperience(e.target.value);
  };

  const handleTechStackChange = (selectedList) => {
    setSelectedTechStack(selectedList);

    const selectedTechStackNames = selectedList.map((tech) => tech.id);
    const allSelectedSkills = selectedTechStackNames.reduce((acc, stack) => {
      return acc.concat(skillArrays[stack] || []);
    }, []);

    const updatedSelectedSkills = selectSkills.filter((skill) =>
      allSelectedSkills.some((selectedSkill) => selectedSkill.name === skill.name)
    );

    setSelectedSkills(updatedSelectedSkills);
    setCurrentSkills(allSelectedSkills);
  };

  const handleSkillsChange = (selectedOptions) => {
    setSelectSkills(selectedOptions);
  };

  const handleApplyClick = (job) => {
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

  const handleResumeClick = (content) => {
    if (!auth?.user?._id) {
      setIsModalOpen(true);
    }
    else if (auth?.user?.userType === 'jobseeker') {
      navigate(`/${auth.user?.userType}/resume`)
    }
    else {
      navigate(`/${auth?.user?.userType}/jobpost`)
    }
  };



  const filteredJobs = jobData.slice(0, jobsToShow).filter((job) => {
    const experienceFilter = selectedExperience === '' || job.experience === selectedExperience;
    const skillsFilter = selectedSkills.length === 0 || selectedSkills.every((skill) => job.skills.includes(skill));
    return experienceFilter && skillsFilter;
  });

  useEffect(() => {
    if (selectSkills.length || selectedTechStack.length || experience) filterJob();
  }, [selectSkills, selectedTechStack, experience]);

  const filterJob = async () => {
    try {
      
      const { data } = await axios.post("/api/v1/job/job-filters", {
        selectSkills,
        selectedTechStack,
        experience,
      });
      setJobData(data?.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <section className=' job_section'>
        <div>
          <div className='super_Seacrh'>
            <img src={searchImg} alt="searchImage" />
            <div className="search-bar">
              <SearchInput />
            </div>
          </div>
        </div>
        {/* filter */}

        <div className='container'>
          <div className="sidebar" >
            <div className='profile_div'>
              <div className='profile-picture-container'>
              </div>
              <p className='name'>{auth?.user?.name}</p>
              <p>Email: {auth?.user?.email}</p>
              <p>I am {auth?.user?.userType}</p>
              {auth?.user?.userType === 'employer' ? (
                <>
                  <button className='btnn_side' onClick={handleResumeClick}>Post a job For Free</button>
                </>
              ) : (
                <>
                  <button className='btnn_side' onClick={handleResumeClick}>Upload Resume</button>
                </>
              )}
            </div>

            <div className='all_filters'>
              <h3>All Filter</h3>
              <div className="group__1">
                <h5 className="name_details">Experience</h5>
                <select
                  id="experienceSelector"
                  value={experience}
                  onChange={handleExperienceChange}
                >
                  <option value="Fresher">Fresher</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <div className="skills_selection">
              <h5 className="name_details_profile">Tech Stack</h5>
              <Multiselect
                options={techStacks}
                selectedValues={selectedTechStack}
                onSelect={handleTechStackChange}
                onRemove={handleTechStackChange}
                displayValue="name"
                placeholder="Select Tech Stack"
                showCheckbox={true}
              />

              {selectedTechStack.length > 0 && (
                <div>
                  <label className="name_details_profile">Add Skills </label>
                  <Multiselect
                    options={currentSkills}
                    selectedValues={selectSkills}
                    onSelect={handleSkillsChange}
                    onRemove={handleSkillsChange}
                    displayValue="name"
                    placeholder="Select Skills"
                    showCheckbox={true}
                  />
                </div>
              )}
            </div>

            <button className='reset_button' onClick={() => window.location.reload()}>Reset Filter</button>
          </div>
          <div className='jobList'>
            <ul>
              {filteredJobs.map((job) => (
                <li className='lists' key={job.id}>
                  <h5>{job.jobTitle}</h5>
                  <p className='pera'>{job.company}</p>
                  <div className='job_details'>
                    <span className='peraSub'><MdOutlineWorkHistory /> {job.experience}</span>
                    <span className='peraSub'><GiMoneyStack /> {job.salary}</span>
                    <span className='peraSub'><IoLocationOutline /> {job.location}</span>
                  </div>
                  <div className='peraSub apply_job'>
                    {striptags(job.description).substring(0, 75) + "..."}
                    {job.applicants && job.applicants.includes(auth?.user?._id) ? (
                      <button className="apld_btn" onClick={() => handleApplyClick(job)}>Applied</button>
                    ) : (
                      <button className="apld_btn" onClick={() => handleApplyClick(job)}>Apply</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            {filteredJobs.length < jobData.length && (
              <button className='loadMoreBtn' onClick={() => setJobsToShow((prev) => prev + 3)}>
                Load More
              </button>
            )}
          </div>
        </div>
        <LoginModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onLogin={handleLogin}
        />
      </section>
    </Layout>
  );
};

export default ShowJobs;
