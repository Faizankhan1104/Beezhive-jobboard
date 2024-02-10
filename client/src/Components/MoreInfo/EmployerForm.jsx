import React, { useState } from 'react';

function EmployerForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyEmail, setCompanyEmail] = useState('');
    const [jobDescription, setJobDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Employer form data ko submit karne ka logic yahan likhen
    };

    return (
        <div>
            <div className='jobseeker_form'>
                <form className='deatils_form' onSubmit={handleSubmit}>
                    <div className='inp_details'>
                        <label className='name_details'>Name</label>
                        <input className='input_field_details' placeholder='John Doe' type="text" value={name} onChange={(e) => setCompanyName(e.target.value)} required /><br /><br />
                    </div>
                    <div className='inp_details'>
                        <label className='name_details'>Phone</label>
                        <input className='input_field_details' placeholder='+91 9876543210' type="text" value={phone} onChange={(e) => setCompanyName(e.target.value)} required /><br /><br />
                    </div>
                    <div className='inp_details'>
                        <label className='name_details'>Company Name</label>
                        <input className='input_field_details' placeholder='i.e Amazone' type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required /><br /><br />
                    </div>
                    <div className='inp_details'>
                        <label className='name_details'>Company Email</label>
                        <input className='input_field_details' placeholder='johndoe@amazone.com' type="email" value={companyEmail} onChange={(e) => setCompanyEmail(e.target.value)} required /><br /><br />
                    </div>
                    <input className='sub_button' type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}

export default EmployerForm;
