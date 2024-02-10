// updateUserProfile.js

import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './UpdateProfile.css'; // Import the CSS for styling
import { toast } from 'react-toastify'


Modal.setAppElement('#root');

const UpdateProfile = ({ isOpen, onClose, onUpdate, userData }) => {
  const [name, setName] = useState(userData.name || '');
  const [userId, setUserId] = useState(userData?._id || '');
  const [about, setAbout] = useState(userData.about || '');
  const [profilePicture, setProfilePicture] = useState(null);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('about', about);
      if (profilePicture) {
        formData.append('profilePicture', profilePicture);
      }

      // Set the Content-Type header to 'multipart/form-data'
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.put(`/api/v1/auth/add-profile-picture/${userId}`, formData, config);

      console.log('Profile updated successfully:');
      onUpdate(response.data.user);
      toast.success('Profile Updated Successfully')
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to Upload")
    }
  };

  const handelClose = async () => {
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="profile-update-modal"
      overlayClassName="overlay"
    >
      <div className="modal-content_profile">
        <div className='updateProfileHead'>
          <h5>Update Profile</h5>
          <button className="close" onClick={handelClose}>X</button>
        </div>
        <form enctype="multipart/form-data">
          <div className="group1">
            <label htmlFor="name">Name</label>
            <input
              className='input_field'
              type="text"
              id="name"
              placeholder='Your Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="group1">
            <label htmlFor="profilePicture">Profile Picture</label>
            <input
              className='input_field'
              type="file"
              id="profilePicture"
              name="profilePicture"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>
          <div className="group1">
            <label htmlFor="about">About</label>
            <textarea
              className='input_field'
              id="about"
              placeholder='Tell something about yourself...'
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
          </div>

          <div>
            <button className='update' onClick={handleUpdate}>Update Profile</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UpdateProfile;
