import React, { useEffect, useState } from 'react';
import Sidebar from '../sidebar/Sidebar';
import axios from 'axios';
import { useAuth } from '../../Context/Auth';
import { toast } from 'react-toastify'

const Resume = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [auth] = useAuth();
  const [resume, setResume] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setSelectedFiles([...files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('resume', file);
    });

    const token = auth && auth.token;

    try {
      const response = await axios.post(`/api/v1/auth/upload/${auth.user?._id}`, formData, {
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        
        toast.success('Resume Upload Successfully')
        window.location.reload(true)
        const updatedUserData = await auth.getUserData();
        auth.setUser(updatedUserData);
        setSelectedFiles([]);
      } else {
        console.error('File upload failed');
        toast.error('Resume not Uploaded')
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error("Error Uploading Files")
    }
    
  };

  const handleDownload = async (fileName) => {
    try {
      const response = await axios.get(`/api/v1/auth/download/${fileName}/${auth.user?._id}`, {
        responseType: 'blob', // Specify the response type as 'blob'
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const handleView = async (fileName) => {
    const token = auth && auth.token;

    try {
      // Get the file URL
      const response = await axios.get(`/api/v1/auth/download/${fileName}/${auth.user?._id}`, {
        responseType: 'blob', // Specify the response type as 'blob'
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: response.headers['content-type'] });

      // Create a URL for the Blob
      const fileURL = window.URL.createObjectURL(blob);

      // Open the file in a new tab
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error viewing resume:', error);
    }
  };

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`/api/v1/auth/resumes/${auth.user?._id}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        setResume(response.data.resume);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, [auth.token]);

  return (
    <div>
      <Sidebar />
      <div className='_Myjobs'>
        <div className='resume__'>
          <h3 className='resume_heading'>Resume</h3>
          {resume ? (
            <div className='down_button'>
              <h5>{resume.fileName}</h5>
              <div className='down_button_div' >
                {resume.fileName ? (<><button onClick={() => handleView(resume.fileName)}>View</button>
                  <button onClick={() => handleDownload(resume.fileName)}>Download</button></>) : (<></>)}
              </div>
            </div>
          ) : (
            <p>No resume available</p>
          )}
          <p>
            Resume is the most important document recruiters look for.
            Recruiters generally do not look at profiles without resumes.
          </p>
          <div className='resume_upload'>
            <label htmlFor='file' className='label_resume'>
              Upload Resumes
            </label>
            <p>Supported Formats: doc, docx, rtf, pdf, up to 2 MB</p>
            <input
              type='file'
              id='file'
              name='resume'
              multiple={false}
              className='upload_resume'
              onChange={handleFileChange}
            />
          </div>
          <button className='resume_btn_add' onClick={handleUpload}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default Resume;
