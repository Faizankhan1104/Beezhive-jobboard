import React, { useState, useEffect } from 'react';
import Sidebar from '../sidebar/Sidebar'
import './My_jobs.css'
import axios from 'axios';
import { GiMoneyStack } from "react-icons/gi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineWorkHistory } from "react-icons/md";
import { Link } from 'react-router-dom';
import striptags from 'striptags';
import { useAuth } from '../../Context/Auth';


const My_jobs = () => {
    const [jobData, setJobData] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [auth, setAuth] = useAuth(); // Make sure to import useAuth from your Auth context

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get('/api/v1/job/getjobs');
                setJobData(response.data.jobs);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        const filteredJobs = jobData.filter((job) => {
            return job.employer === auth?.user._id;
        });
        setFilteredJobs(filteredJobs);
    }, [jobData, auth.user._id]);

    return (
        <div>
            <Sidebar />
            <div className='_Myjobs'>
                <div className='jobList'>
                    {filteredJobs.length < 1 ? (<><h1>Jobs Not Found</h1></>) : (<>
                        <ul>
                            {filteredJobs.map((job) => (
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
                                        <Link to={`/jobs/${job.slug}`}>Edit</Link>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default My_jobs;