import React from 'react';
import { Route,useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/Auth'

const PrivateJobseekerRoute = ({ path, element }) => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    // Check if the user is authenticated and has the userType "jobseeker"
    const isJobseeker = auth?.user?.userType === 'jobseeker';

    if (!auth.isAuthenticated) {
        // Redirect to the login page if the user is not authenticated
        navigate('/login');
        return null;
    }

    if (!isJobseeker) {
        // Redirect to a different page if the user is not a jobseeker
        navigate('/access-denied');
        return null;
    }

    // Render the component for authenticated jobseekers
    return <Route path={path} element={element} />;
};

export default PrivateJobseekerRoute;
