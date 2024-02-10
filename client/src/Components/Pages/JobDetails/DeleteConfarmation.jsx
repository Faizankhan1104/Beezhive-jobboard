import React, { useState } from 'react';
import Modal from 'react-modal';
import './DeleteConfarmation.css'; // Import the CSS for styling
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'

const DeleteConfarmation = ({ isOpen, onClose, onDelete, jobId, api }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (api) {
                await axios.delete(api);
                console.log('Job deleted!');
                navigate('/')
            }
            toast.success('Delete Sucessfully')
            
        } catch (error) {
            console.error('Delete request error:', error);
            toast.error('Error')
        } finally {
            setShowDeleteModal(false);
        }
    };


    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            className="delete-confirmation-modal"
            overlayClassName="overlay"
        >
            <div className="modal-content">
                <div className='delete-confirmation-head'>
                    <h5>Delete Confirmation</h5>
                    <button className="close" onClick={onClose}>X</button>
                </div>
                <p>Are you sure you want to delete?</p>
                <div className="button-group">
                    <button className='cancel-delete' onClick={onClose}>Cancel</button>
                    <button className='confirm-delete' onClick={handleSubmit}>Yes, Delete</button>

                </div>
            </div>
        </Modal>
    );
};

export default DeleteConfarmation;
