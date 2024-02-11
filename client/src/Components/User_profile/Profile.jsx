import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import './My_jobs.css';
import { skillArrays, techStacks } from '../../Skills';
import userImg from '../../assets/profile.png';
import { useAuth } from '../../Context/Auth';
import Multiselect from 'multiselect-react-dropdown';
import AddEmploymentModal from '../AddEmploymentModal/AddEmploymentModal';
import UpdateProfile from '../Update_profile/UpdateProfile';
import { FaUserEdit } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { FiEdit2 } from "react-icons/fi";
import AddSkillsModel from '../KeySkills/AddSkillsModel';
import DeleteConfarmation from '../Pages/JobDetails/DeleteConfarmation'
import { toast } from 'react-toastify'


const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addSkills, setAddSkills] = useState(false)
  const [updateProfileModel, setUpdateProfileModel] = useState(false);
  const [user, setUser] = useState();
  const [employmentDetails, setEmploymentDetails] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [expId, setExpId] = useState()

  useEffect(() => {
    const fetchUserProfile = async () => {

      try {
        const response = await axios.get(`/api/v1/auth/get-User/${auth.user?._id}`);


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




  const handleaddEmployment = () => {
    setIsModalOpen(true);
  };


  const handleModalClose = () => {
    setIsModalOpen(false);
    setAddSkills(false);
    setUpdateProfileModel(false);
  };

  const handleLogin = (email, password) => {
    handleModalClose();
  };

  const handleaddSkilla = () => {
    setAddSkills(true);
  };

  const handleSkillsSubmit = () => {
    handleCloseModal();
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/v1/job/delete-job/${employmentDetails?._id}`);

      toast.success('Delete Successfully')

    } catch (error) {

      toast.error('Error fetching user data')
    }
  };



  const handleOpenModal = () => {
    setUpdateProfileModel(true);
  };

  const handleDeleteModel = (employmentId) => {
    setExpId(employmentId);
    setShowDeleteModal(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileUpdate = (updatedUserData) => {

  };

  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/employment/employment-details/${auth.user?._id}`);
        if (response.data) {

          setEmploymentDetails(response.data);
        } else {
          console.error('Profile picture data not found in the response.');
        }
      } catch (error) {
        console.error('Error fetching employment details:', error);
      }
    };

    fetchEmploymentDetails();
  }, [auth]);

  useEffect(() => {
    const fetchEmploymentDetails = async () => {
      try {
        const response = await axios.get(`/api/v1/get-employment-details/${auth.user?._id}`);

        if (response.data) {
          setEmploymentDetails(response.data);
        } else {
          console.error('Profile picture data not found in the response.');
        }
      } catch (error) {
        console.error('Error fetching employment details:', error);
      }
    };

    fetchEmploymentDetails();
  }, [auth]);



  return (
    <div>
      <div className="profile-container">
        <Sidebar />
        <div className="_Myjobs">
          <div>
            <div className="user__profile">
              <img htmlFor='file' src={user?.profilePicture?.url || userImg} alt="Profile" className="profile--picture" />

              <div>
                <h6>{user?.name} <FaUserEdit id='edit_icon' onClick={handleOpenModal} /></h6>
                <h6>{auth?.user?.email}</h6>
                <h6>
                  {user?.about}
                </h6>
              </div>
            </div>

            <div className="add__info_experience">
              <button id="text-dark" onClick={handleaddEmployment} >
                Add Employment
              </button>
            </div>
            <div className="add__info_experience">

              {employmentDetails?.map((employment) => (
                <div key={employment?._id}>
                  <div className='experience_section'>
                    <div className='experience_column'>
                      <h5>Experience: </h5> <h5> {employment?.employmentExperience} </h5>
                    </div>
                    <div className='experience_column'>
                      <h5>Company Name: </h5> <h5>{employment?.company}</h5>
                    </div>
                    <div className='experience_column'>
                      <h5>Designation: </h5> <h5>{employment?.designation}</h5>
                    </div>
                    {employment?.jobStatus === 'Current' ? (<div className='experience_column'> <h5>Notice Period: </h5> <h5>{employment?.noticePeriod}</h5></div>) : (<div className='experience_column'><h5>Job Status: </h5><h5>{employment?.jobStatus}</h5></div>)}
                    <div className='edit_delete_icon'>
                      <MdDelete onClick={() => handleDeleteModel(employment?._id)} className='icon_delete  icon_hvr' />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {auth.user?.userType === 'employer' ? (<></>) : (<div className="add__info_experience">
              <h5 className="profile_experience">Key Skills <FiEdit2 onClick={handleaddSkilla} className='icon_skills' /></h5>
              <p>
                Tell recruiters what you know or what you are known for e.g. Direct Marketing,
                Oracle, Java etc. We will send you job recommendations based on these skills.
              </p>

              <div className="add__info_experience">
                <h5 className="profile_experience">Tech Stack</h5>
                <div className='skills'>
                  {user?.selectedTechStack?.map((tech) => (

                    <span className='chip__ chip' key={tech?.id}>{tech?.name}</span>

                  ))}
                </div>
              </div>

              <div className="add__info_experience">
                <h5 className="profile_experience">Skills</h5>
                <div className='skills'>
                  {user?.selectedSkills?.map((skill) => (
                    <span className='chip__  chip' key={skill?.id}>{skill?.name}</span>
                  ))}
                </div>
              </div>
            </div>)}

          </div>
        </div>
      </div>
      <AddEmploymentModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onAddEmployment={handleLogin}
      />
      <UpdateProfile
        isOpen={updateProfileModel}
        onClose={handleModalClose}
        onUpdate={handleProfileUpdate}
        userData={auth?.user}
      />
      <AddSkillsModel
        isOpen={addSkills}
        onClose={handleModalClose}
        onAddEmployment={handleSkillsSubmit}
        auth={auth}

      />
      <DeleteConfarmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        jobId={employmentDetails._id}
        onConfirm={handleDelete}
        api={`/api/v1/employment/delete-employment/${expId}`}
      />
    </div>
  );
};

export default Profile;
