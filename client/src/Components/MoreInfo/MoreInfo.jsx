import React, { useState } from 'react';
import JobseekerForm from './JobseekerForm';
import EmployerForm from './EmployerForm';
import { useAuth } from '../../Context/Auth'
import './MoreInfo.css'
import Layout from '../Layout/Layout';

const options = [
    { value: 'jobseeker', label: 'Jobseeker' },
    { value: 'employer', label: 'Employer' },
];

function MoreInfoForm() {
    const [auth, setAuth] = useAuth();


    return (
        <Layout>
            <div id='contianer'>
                {auth.user.userType === 'jobseeker' ? <JobseekerForm /> : <EmployerForm />}
            </div>
        </Layout>
    );
}

export default MoreInfoForm;
