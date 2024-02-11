import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import './AddEmployment.css'
import {toast} from 'react-toastify'
import { useAuth } from '../../Context/Auth';

const AddEmploymentModal = ({ isOpen, onClose, onAddEmployment }) => {
    const [experience, setExperience] = useState('');
    const [company, setCompany] = useState('');
    const [designation, setDesignation] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');
    const [jobStatus, setJobStatus] = useState('current');
    const [auth, setAuth] = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post(`/api/v1/employment/add-employment/${auth?.user?._id}`, {
                employmentExperience: experience, // Use the correct field name expected by the server
                company,
                designation,
                noticePeriod,
                jobStatus,
            });

            // Handle the response status and update the UI accordingly
            if (response.status === 201) {
                
                onAddEmployment(response.data);
                toast.success('Experience Added Successfully') 
                window.location.reload(true);     
                onClose();
            } else {
                // Handle other response statuses or errors
                console.error('Failed to add employment:', response.data.error);
                toast.error('Failed to add employment')
            }
        } catch (error) {
            console.error('Error adding employment:', error);
            toast.error('Failed to add employment')
        }
    };
    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="employment-modal"
            overlayClassName="overlay"
        >  
                <div className="modal-content_addEmp">
                    <div className='modalHead'>
                        <h5>Add Employment</h5>
                        <button className="close" onClick={onClose}>X</button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="group__1">
                            <label className="name_details">Experience</label>
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
                        <div className="group__1">
                            {/* <label htmlFor="company">Company</label> */}
                            <input
                                type="text"
                                id="company"
                                placeholder='Company Eg: Amazone'
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                        <div className="group__1">
                            {/* <label htmlFor="designation">Designation</label> */}
                            <input
                                type="text"
                                id="designation"
                                placeholder="Designation eg: Software Engineer"
                                value={designation}
                                onChange={(e) => setDesignation(e.target.value)}
                            />
                        </div>
                        <div className="group__1">
                            {/* <label htmlFor="noticePeriod">Notice Period</label> */}
                            <input
                                type="text"
                                id="noticePeriod"
                                placeholder='Notice Period eg: 1 Month'
                                value={noticePeriod}
                                onChange={(e) => setNoticePeriod(e.target.value)}
                            />
                        </div>
                        <div className="group__1">
                            <div className='job_status'>
                                <label>Job Status:</label>
                                <label className='_job_label'>
                                    <input
                                        type="radio"
                                        value="Current"
                                        checked={jobStatus === 'current'}
                                        onChange={() => setJobStatus('current')}
                                    />
                                    Current
                                </label>
                                <label className='_job_label'>
                                    <input
                                        type="radio"
                                        value="Previous"
                                        checked={jobStatus === 'previous'}
                                        onChange={() => setJobStatus('previous')}
                                    />
                                    Previous
                                </label>
                            </div>
                        </div>
                        <button className='add-employment' >Add Employment</button>
                    </form>
                </div>
            
        </Modal>
    );
};

export default AddEmploymentModal;
