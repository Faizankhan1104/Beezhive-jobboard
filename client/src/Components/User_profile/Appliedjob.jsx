import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../sidebar/Sidebar';
import { Link } from 'react-router-dom';
import striptags from 'striptags';
import { GiMoneyStack } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import './My_jobs.css'



const AppliedJobs = ({ userId }) => {
    const [appliedJobs, setAppliedJobs] = useState([]);


    useEffect(() => {
        const fetchAppliedJobs = async () => {
            
            try {
                const response = await axios.get(`/api/v1/job/get-my-jobs/${userId}`);
                setAppliedJobs(response.data.appliedJobs);
            } catch (error) {
                console.error('Error fetching applied jobs:', error);
            }
        };

        fetchAppliedJobs();
    }, [userId]);

    return (
        <div>
            <Sidebar />
            <div className='_Myjobs'>
                <div className='jobList'>
                    <ul>
                        {appliedJobs.map((job) => (
                            <li className='lists' key={job.id}>
                                <h3>{job.jobTitle}</h3>
                                <p className='pera'>{job.company}</p>
                                <div className='job_details'>
                                    <span className='peraSub'><MdOutlineWorkHistory /> {job.experience}</span>
                                    <span className='peraSub'><GiMoneyStack /> {job.salary}</span>
                                    <span className='peraSub'><IoLocationOutline /> {job.location}</span>
                                </div>
                                <div className='peraSub apply_job'>
                                    {striptags(job.description).substring(0, 75) + '...'}
                                    <Link to={`/jobs/${job.slug}`}>Applied</Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default AppliedJobs;
