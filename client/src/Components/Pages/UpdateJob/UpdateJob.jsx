import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import Sidebar from '../../sidebar/Sidebar';
import { Editor } from 'primereact/editor';
import { toast } from 'react-toastify'
import { useAuth } from '../../../Context/Auth';

const initialState = {
    jobTitle: '',
    location: '',
    employmentType: '',
    workAuthorization: '',
    company: '',
    salary: '',
    experience: '',
};

const JobForm = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialState);
    const [description, setDescription] = useState('');
    const [job, setJob] = useState({});
    const [auth] = useAuth();

    useEffect(() => {
        if (params?.slug) {
            getJob();
        }
    }, [params?.slug]);

    const getJob = async () => {
        try {
            const { data } = await axios.get(`/api/v1/job/get-job/${params.slug}`);
            setJob(data?.job);
            
            setFormData({
                jobTitle: data?.job?.jobTitle || '',
                location: data?.job?.location || '',
                employmentType: data?.job?.employmentType || '',
                workAuthorization: data?.job?.workAuthorization || '',
                company: data?.job?.company || '',
                salary: data?.job?.salary || '',
                experience: data?.job?.experience || '',
            });
            setDescription(data?.job?.description || '');

        } catch (error) {
            console.log(error);
        }
    };

    const CustomHeading = () => {
        return (
            <span className="ql-formats">
                <button className="ql-header" value="1" aria-label="Heading 1"></button>
                <button className="ql-header" value="2" aria-label="Heading 2"></button>
                <button className="ql-header" value="3" aria-label="Heading 3"></button>
                <button className="ql-header" value="4" aria-label="Heading 4"></button>
                <button className="ql-header" value="5" aria-label="Heading 5"></button>
                <button className="ql-header" value="6" aria-label="Heading 6"></button>
            </span>
        );
    };

    const CustomFontSize = () => {
        return (
            <span className="ql-formats">
                <button className="ql-size" value="small" aria-label="Small"></button>
                <button className="ql-size" value="normal" aria-label="Normal"></button>
                <button className="ql-size" value="large" aria-label="Large"></button>
                <button className="ql-size" value="huge" aria-label="Huge"></button>
            </span>
        );
    };

    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-list" value="ordered" aria-label="Ordered List"></button>
                <button className="ql-list" value="bullet" aria-label="Bullet List"></button>
                <button className="ql-align" value="" aria-label="Align Left"></button>
                <button className="ql-align" value="center" aria-label="Align Center"></button>
                <button className="ql-align" value="right" aria-label="Align Right"></button>
                <button className="ql-align" value="justify" aria-label="Justify"></button>
                <button className="ql-code-block" aria-label="Code Block"></button>
                <CustomHeading />
            </span>
        );
    };

    const header = renderHeader();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditorChange = useCallback((event, editor) => {
        const data = editor.getData();
        setDescription(data);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';

        try {

            const response = await axios.put(`/api/v1/job/update-job/${job._id}/${auth.user?._id}`, {
                ...formData,
                description: description,
            });
            setFormData(initialState);
            setDescription('');
            toast.success("Job Edited Successfully")
            navigate('/');
        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error('Error Submitting Data')
        }
    };

    return (
        <>
            <Sidebar />

            <div className='formMain'>

                <form onSubmit={handleSubmit} className="job-form">
                    <div className='heading'>
                        <h2>Post Only IT Jobs in United States</h2>
                    </div>
                    <div className='grid'>
                        <div>
                            <label className='form-label'>Job Title</label>
                            <input
                                placeholder='Full Stack Developer'
                                type="text"
                                name="jobTitle"
                                value={formData.jobTitle}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Company</label>
                            <input
                                placeholder='Amazone'
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Salary</label>
                            <input
                                placeholder='5 LPA'
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Experience</label>
                            <input
                                placeholder='0 - 2 Yrs'
                                type="text"
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Location</label>
                            <input
                                placeholder='Folsom, CA'
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Employment Type</label>
                            <input
                                placeholder='Remote'
                                type="text"
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                        <div>
                            <label className='form-label'>Work Authorization</label>
                            <input
                                placeholder='H1B'
                                type="text"
                                name="workAuthorization"
                                value={formData.workAuthorization}
                                onChange={handleChange}
                                className="form-input"
                                required />
                        </div>
                    </div>

                    <div className="card">
                        <Editor
                            headerTemplate={header}
                            value={description}
                            onTextChange={(e) =>
                                setDescription(e.htmlValue)}
                            style={{ height: '30vh', width: '39rem' }}
                        />
                    </div>
                    <button type="submit" className="form-button">Submit</button>
                </form>

            </div>

        </>
    );
};

export default JobForm;