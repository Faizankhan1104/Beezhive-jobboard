import React, { useState } from 'react';
import Select from 'react-select';
import Multiselect from 'multiselect-react-dropdown';
import { skillArrays, techStacks } from '../../Skills'
import './Jobseeker.css'

function JobseekerForm() {
    const [selectedTechStack, setSelectedTechStack] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [resume, setResume] = useState(null);
    const [skills, setSkills] = useState('');
    const [experience, setExperience] = useState('Fresher');
    const [company, setCompany] = useState('');
    const [jobProfile, setJobProfile] = useState('');
    const [currentSkills, setCurrentSkills] = useState([]);

    const handleTechStackChange = (selectedList) => {
        setSelectedTechStack(selectedList);

        // Get the skills for all selected tech stacks
        const selectedTechStackNames = selectedList.map((tech) => tech.id);
        const allSelectedSkills = selectedTechStackNames.reduce((acc, stack) => {
            return acc.concat(skillArrays[stack] || []);
        }, []);

        // Filter out any skills that are not in the current selection
        const updatedSelectedSkills = selectedSkills.filter((skill) =>
            allSelectedSkills.some((selectedSkill) => selectedSkill.name === skill.name)
        );

        setSelectedSkills(updatedSelectedSkills);
        setCurrentSkills(allSelectedSkills);
    };

    const handleSkillsChange = (selectedOptions) => {
        setSelectedSkills(selectedOptions);
    };
    const handleExperienceChange = (e) => {
        setExperience(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Jobseeker form data ko submit karne ka logic yahan likhen
    };
    

    return (
        <div>
            <div className='jobseeker_form'>
                <form className='deatils_form' onSubmit={handleSubmit}>
                    <div className='inp_details'>
                        <label className='name_details'>Phone</label>
                        <input placeholder='+91 9876543210' className='input_field_details' type="text" value={skills} onChange={(e) => setSkills(e.target.value)} required /><br /><br />
                    </div>
                    <div className='inp_details'>
                        <label className='name_details'>Experience</label>
                        <select id="experienceSelector" 
                        value={experience} onChange={handleExperienceChange} >
                            <option value="Fresher">Fresher</option>
                            <option value="0-1">0-1 years</option>
                            <option value="1-3">1-3 years</option>
                            <option value="3-5">3-5 years</option>
                            <option value="5-10">5-10 years</option>
                            <option value="10+">10+ years</option>
                        </select>
                    </div>
                    {experience === "Fresher" ? "" : <>
                        <div className='inp_details'>
                            <label className='name_details' >Company Name</label>
                            <input placeholder='i.e Amazone' className='input_field_details ' type="text" value={company} onChange={(e) => setCompany(e.target.value)} required /><br /><br />
                        </div>
                        <div className='inp_details'>
                            <label className='name_details' >Job Profile</label>
                            <input placeholder='Full Stack Developer' className='input_field_details ' type="text" value={jobProfile} onChange={(e) => setJobProfile(e.target.value)} required /><br /><br />
                        </div>
                    </>}
                    <div className='skills_selection'>
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

                    <div className='inp_details'>
                        <label className='name_details'>Upload Resume</label>
                        <input className='input_field_login1' placeholder='.pdf,.doc,.docx"' type="file" onChange={(e) => setResume(e.target.files[0])} accept=".pdf,.doc,.docx" required /><br /><br />
                    </div>
                    <input className='sub_button' type="submit" value="Submit" />
                </form>
            </div >
        </div >
    );
}

export default JobseekerForm;
