import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import { useAuth } from '../../Context/Auth';
import "./Applicant.css"

const Applicants = () => {
  const [jobs, setJobs] = useState([]);
  const [auth, setAuth] = useAuth();
  const [filteredJobs, setFilteredJobs] = useState([]);


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/v1/job/job-applicants');
        setJobs(response.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, [])

  const handleView = async (applicantId) => {
    console.log(applicantId);
    const token = auth && auth.token;
    try {
      const response = await axios.get(`/api/v1/auth/download-applicant-resume/${applicantId}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const fileURL = window.URL.createObjectURL(blob);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error viewing resume:', error);
    }
  };

  useEffect(() => {
    const filteredJobs = jobs.filter((job) => {
      return job.employer === auth?.user._id;
    });
    setFilteredJobs(filteredJobs);
  }, [jobs, auth.user._id]);

  const handleDownload = async (applicantId, fileName) => {
    try {
      const response = await axios.get(`/api/v1/auth/download-applicant-resume/${applicantId}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className='_Myjobs'>
        {filteredJobs.length < 1 ? (<><h1>Applicants Not Found</h1></>) : (<>
          {filteredJobs.map((job) => (
            <div key={job._id} className='jobContainer'>
              <h5>{job.jobTitle}</h5>
              {/* <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {job.applicants.map((applicant) => (
                  <tr key={applicant._id}>
                    <td>{applicant.name}</td>
                    <td>{applicant.email}</td>
                    <td>
                      {applicant.resume?.fileName}
                      {applicant.resume?.fileName ? (<> <button onClick={() => handleView(applicant._id, applicant.resume.fileName)}>View</button>
                        <button onClick={() => handleDownload(applicant._id)}>Download</button></>) : (<></>)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Resume</th>

                  </tr>
                </thead>
                <tbody>
                  {job.applicants.map((applicant) => (
                    <tr>
                      <th scope="row">{applicant.name}</th>
                      <td>{applicant.email}</td>
                      <td>
                        <span className="name_resume">{applicant.resume?.fileName}</span>
                        {applicant.resume?.fileName ? (<> <button className="button_view_download" onClick={() => handleView(applicant._id, applicant.resume.fileName)}>View</button>
                          <button className="button_view_download" onClick={() => handleDownload(applicant._id)}>Download</button></>) : (<></>)}
                      </td>
                      <td></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
        )}

      </div>
    </div>
  );
};


export default Applicants;
