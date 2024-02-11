import React, { useState, useCallback } from 'react';
import axios from 'axios';
import './Jobform.css'
import 'react-quill/dist/quill.snow.css';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"
import Sidebar from '../../sidebar/Sidebar';
import { Editor } from 'primereact/editor';
import { useNavigate } from "react-router-dom";
import { skillArrays, techStacks } from '../../../Skills';
import Multiselect from 'multiselect-react-dropdown';
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
    const [selectedTechStack, setSelectedTechStack] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [currentSkills, setCurrentSkills] = useState([]);
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleTechStackChange = (selectedList) => {
        setSelectedTechStack(selectedList);

        const selectedTechStackNames = selectedList.map((tech) => tech.id);
        const allSelectedSkills = selectedTechStackNames.reduce((acc, stack) => {
            return acc.concat(skillArrays[stack] || []);
        }, []);

        const updatedSelectedSkills = selectedSkills.filter((skill) =>
            allSelectedSkills.some((selectedSkill) => selectedSkill.name === skill.name)
        );

        setSelectedSkills(updatedSelectedSkills);
        setCurrentSkills(allSelectedSkills);
    };

    const handleSkillsChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions);
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
    }

    const header = renderHeader();

    const [description, setDescription] = useState('');

    const [formData, setFormData] = useState(initialState);
    

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

    const handleSubmit = async () => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = description;
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        navigate('/');

        try {

            const response = await axios.post(`/api/v1/job/postjob/${auth.user?._id}`, {
                ...formData,
                description: description,
                selectedTechStack,
                selectedSkills,
            });
            console.log(response)
            if (response.status === 201) {

                setFormData(initialState);

                setDescription('');
                toast.success("Job Posted Successfully")
                navigate('/');
                console.log('after Home')                
            }
            
            

        } catch (error) {
            console.error('Error submitting data:', error);
            toast.error("Error Submitting Data")
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
                            <select
                                placeholder='0 - 2 Yrs'
                                id="experienceSelector"
                                value={formData.experience}
                                onChange={handleChange}
                                className="form-input"
                                type="text"
                                name="experience"
                                required
                            >
                                <option value="Fresher">Fresher</option>
                                <option value="0-1">0-1 years</option>
                                <option value="1-3">1-3 years</option>
                                <option value="3-5">3-5 years</option>
                                <option value="5-10">5-10 years</option>
                                <option value="10+">10+ years</option>
                            </select>

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
                        <div className="skills_selection">
                            <label className="name_details_profile">Select Tech Stack</label>
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
                                        selectedValues={selectedSkills}
                                        onSelect={handleSkillsChange}
                                        onRemove={handleSkillsChange}
                                        displayValue="name"
                                        placeholder="Select Skills"
                                        showCheckbox={true}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className='form-label'>Work Mode</label>
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
                    <button className="form-button">Submit</button>
                </form>

            </div>

        </>
    );
};

export default JobForm;