import React, { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { skillArrays, techStacks } from '../../Skills';
import Multiselect from 'multiselect-react-dropdown';
import {toast} from 'react-toastify'

const AddSkillsModel = ({ isOpen, onClose, onAddEmployment, auth }) => {
    const [selectedTechStack, setSelectedTechStack] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [currentSkills, setCurrentSkills] = useState([]);

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

    const handleSubmit = async () => {
        try {
            console.log(selectedTechStack);
            const profileData = {
                selectedTechStack,
                selectedSkills,
            };

            const response = await axios.put(`/api/v1/auth/update-user-profile/${auth.user?._id}`, profileData);
            console.log('Profile updated successfully:');
            toast.success('Skills Updated')

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error')
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="employment-modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <div className='modalHead'>
                    <h4>Add Employment</h4>
                    <button className="close" onClick={onClose}>X</button>
                </div>
                <form onSubmit={handleSubmit}>
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
                    <button className="profile_btn_add" >
                        Add
                    </button>
                </form>
            </div>
        </Modal>
    );
};

export default AddSkillsModel;
