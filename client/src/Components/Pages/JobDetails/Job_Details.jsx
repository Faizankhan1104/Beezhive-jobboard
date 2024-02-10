import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../Layout/Layout";
import './Job_Details.css'
import { PiBagSimpleBold } from "react-icons/pi";
import { MdCurrencyRupee } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { useAuth } from '../../../Context/Auth'
import DeleteConfarmation from "./DeleteConfarmation";
import { toast } from 'react-toastify'

const JobDetails = () => {
  const params = useParams();
  const [job, setJob] = useState({});
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [auth, setAuth] = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicaitonStatus, setApplicationStatus] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    if (params?.slug) {
      getJob();
    }
  }, [params?.slug]);

  const getJob = async () => {
    try {
      const { data } = await axios.get(`/api/v1/job/get-job/${params.slug}`);
      setJob(data?.job);
      // getRelatedJobs(data?.job._id, data?.job.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (job?.experience) {
      getSimilarJob();
    }
  }, [job]);

  const getSimilarJob = async () => {
    try {
      const { data } = await axios.get(`/api/v1/job/related-job/${job?.experience}`);
      setRelatedJobs(data?.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      // Perform the delete action here
      await axios.delete(`/api/v1/job/delete-job/${job._id}`);
      console.log('Job deleted!');
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (jobSlug) => {
    navigate(`/${auth.user?.userType}/job-Update/${jobSlug}`);
  };

  const handleApply = async (jobId) => {
    try {
      if (auth.user?.userType !== "employer" && auth.user?.resume?.fileName === null) {
        // Navigate to resume page
        navigate(`/${auth.user?.userType}/resume`);
      } else {
        const response = await axios.post(`/api/v1/job/apply-job/${jobId}/${auth.user?._id}`, {});
        
        if (response.status === 200) {
          setApplicationStatus("Application submitted successfully!");
          toast.success('Application submitted successfully!');
          window.location.reload(true);
        } else {
          setApplicationStatus("Failed to submit the application. Please try again.");
          toast.error('Failed to submit the application. Please try again.');
        }
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      setApplicationStatus("Internal Server Error");
      toast.error('Failed to submit the application. Please try again.');
    }
  };
  

  { JSON.stringify(auth, null, 4) }


  return (
    <Layout>
      <div className="main_container">
        <div className="row container">
          <div className="job_details_headers">
            <div className="job_title"><h3>{job?.jobTitle} </h3><span>{job?.company}</span></div>
            <div className="Job__details">
              <h5><PiBagSimpleBold /> {job?.experience}</h5>
              <h5> | <MdCurrencyRupee /> {job?.salary}</h5>
              <h5> | <MdCurrencyRupee /> {job?.employmentType}</h5>

            </div>
            <div className="Job__details">
              <h5> <IoLocationOutline /> {job?.location}</h5>
            </div>
            <div>
              {
                auth.user?.userType === 'employer' && job?.employer === auth.user?._id ? (
                  <div className="apply_button">
                    <button onClick={() => handleEdit(job?.slug)}>Edit</button>
                    <button onClick={() => setShowDeleteModal(true)}>Delete</button>
                  </div>
                ) : (
                  job?.applicants && job?.applicants.includes(auth?.user?._id) ? (
                    <div className="apply_button">
                      <button className="apl_btn" to={`/jobs/${job?.slug}`}>Applied</button>
                    </div>
                  ) : (
                    <div className="apply_button">
                      <button className="apl_btn" onClick={() => handleApply(job?._id)}>Apply</button>
                    </div>
                  )
                )
              }
            </div>
          </div>


          <div className="job_details_skills">
            <h5 className="profile_experience">Tech Stack</h5>
            <div className="skills_jd">
              {job?.selectedTechStack?.map((tech) => (

                <span className='chip__ chip' key={tech.id}>{tech.name}</span>

              ))}
            </div>
          </div>

          <div className="job_details_skills">

            <h5 className="profile_experience">Required Skills</h5>
            <div className="skills_jd">

              {job?.selectedSkills?.map((skill) => (


                <span className='chip__  chip' key={skill.id}>{skill.name}</span>


              ))}
            </div>

          </div>


          <DeleteConfarmation
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            jobId={job?._id}
            onConfirm={handleDelete}
            api={`/api/v1/job/delete-job/${job?._id}`}
          />
          <div className="job_description">
            <div dangerouslySetInnerHTML={{ __html: job?.description }} />
          </div>
        </div>
        <hr />
        <div className="similar_job_main">
          <div className="similar_head">
            <h5>Similar Jobs ➡️</h5>
          </div>
          {relatedJobs?.length < 1 && (
            <p className="text-center">No Similar Jobs found</p>
          )}
          <div className="">
            {relatedJobs?.map((relatedJob) => (
              relatedJob?._id === `${job?._id}` || relatedJob?.applicants && relatedJob?.applicants.includes(auth?.user?._id) ? (<React.Fragment key={relatedJob._id} />) : (
                <div className="similar_related-job" key={relatedJob._id}>
                  {/* Display related job details, e.g., jobTitle, location, etc. */}
                  <div className="job_title"><h3>{relatedJob.jobTitle} </h3><span>{relatedJob.company}</span></div>
                  <div className="Job__details">
                    <h5><PiBagSimpleBold /> {relatedJob?.experience}</h5>
                    <h5> | <MdCurrencyRupee /> {relatedJob?.salary}</h5>
                    <h5> | <MdCurrencyRupee /> {relatedJob?.employmentType}</h5>
                  </div>
                  <div className="Job__details_related">
                    <h5> <IoLocationOutline /> {relatedJob?.location}</h5>
                    <Link to={`/jobs/${relatedJob?.slug}`}>Apply</Link>
                  </div>
                </div>
              )
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );

};

export default JobDetails;