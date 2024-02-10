// const fs = require("fs");
const slugify = require("slugify");
const Job = require('../models/jobForm');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const UserModel = require('../models/UserModel')
const DOMPurify = createDOMPurify(window);
const axios = require('axios');
const striptags = require('striptags');
const jobApplication = require('../models/application')

// dotenv.config();

function generateUniqueSlug(jobTitle) {
    const baseSlug = slugify(jobTitle);
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substr(2, 5); // You can customize the length of the unique id

    return `${baseSlug}-${timestamp}-${uniqueId}`;
}

module.exports.createNewJob = async (req, res) => {

    try {
        const { jobTitle, location, employmentType, workAuthorization, company, salary, experience, description, selectedSkills, selectedTechStack } = req.body;

        // Validation
        const sanitizedDescription = DOMPurify.sanitize(description);
        const plainTextDescription = striptags(sanitizedDescription, [], '\n');

        switch (true) {
            case !jobTitle:
                return res.status(500).send({ error: "Job Title is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !location:
                return res.status(500).send({ error: "Location is Required" });
            case !workAuthorization:
                return res.status(500).send({ error: "workAuthorization is Required" });
            case !company:
                return res.status(500).send({ error: "Company is Required" });
            case !employmentType:
                return res.status(500).send({ error: "EmploymentType is Required" });
            case !experience:
                return res.status(500).send({ error: "EmploymentType is Required" });
            case !selectedTechStack:
                return res.status(500).send({ error: "Tech Stack is Required" });
            case !selectedSkills:
                return res.status(500).send({ error: "Skills is Required" });
        }

        const job = new Job({
            jobTitle,
            slug: generateUniqueSlug(jobTitle),
            location,
            employmentType,
            workAuthorization,
            company,
            salary,
            experience,
            description,
            selectedSkills,
            selectedTechStack,
            employer: req.params._id
        });

        await job.save();
        res.status(201).send({
            success: true,
            message: "Job Created Successfully",
            job,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating job",
        });
    }
};

//get all Jobs
module.exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job
            .find({})
            // .populate("category")

            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            counTotal: jobs.length,
            message: "ALLProducts ",
            jobs,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
};
// get single product
module.exports.getSingleJob = async (req, res) => {
    try {
        const job = await Job
            .findOne({ slug: req.params.slug })
        // .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            job,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
};

//delete controller
module.exports.deletejobController = async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params._id);
        res.status(200).send({
            success: true,
            message: "Product Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};

// //upate producta
module.exports.updatejobController = async (req, res) => {
    try {
        const { jobTitle, location, employmentType, workAuthorization, company, salary, experience, description } = req.body;
        //alidation
        switch (true) {
            case !jobTitle:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !location:
                return res.status(500).send({ error: "Price is Required" });
            case !employmentType:
                return res.status(500).send({ error: "Category is Required" });
            case !workAuthorization:
                return res.status(500).send({ error: "Quantity is Required" });
            case !company:
                return res.status(500).send({ error: "Quantity is Required" });
            case !experience:
                return res.status(500).send({ error: "Quantity is Required" });
        }

        const job = await Job.findByIdAndUpdate(
            req.params._id,
            {
                jobTitle,
                slug: generateUniqueSlug(jobTitle),
                location,
                employmentType,
                workAuthorization,
                company,
                salary,
                experience,
                description,
                employer: req.params._userId
            },
            { new: true }
        );
        await job.save();
        res.status(201).send({
            success: true,
            message: "Job Updated Successfully",
            job,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};



module.exports.applyJob = async (req, res) => {
    try {
        
        const jobId = req.params._id;
        const job = await Job.findOne({ _id: jobId });  // Correct usage of findOne
        const user = req.params.userId;
        const jobSeeker = await UserModel.findById(user);

        if (job.applicants.includes(user)) {
            return res.status(400).json({ error: 'You have already applied for this job.' });
        }

        if (!user || !jobId) {
            return res.status(400).json({ error: 'Invalid user or job ID.' });
        }



        job.applicants.push(user);
        jobSeeker.myJob.push(jobId);
        await job.save();
        await jobSeeker.save();

        return res.status(200).json({ message: 'Apply Job Successfully.' });
    } catch (error) {
        console.error('Error applying Job:', error);
        return res.status(500).json({ error: 'Error Not Applying Job.' });
    }
}

module.exports.applicant = async (req, res) => {
    try {
        const job = await Job.findById(req.params._id);
        if (!job) {
            return res.status(404).json({ error: 'User not found' });
        }

        const applicant = job.applicants; // Assuming resumes is an array field in your user model
        res.status(200).json({ applicant });
    } catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ error: 'Error fetching resumes.' });
    }
};



module.exports.getMyJob = async (req, res) => {
    const userId = req.params._id;

    try {
        const user = await UserModel.findById(userId).populate('myJob');
        const appliedJobs = user.myJob;

        res.status(200).json({ appliedJobs });
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ message: 'Server Error' });
    }

};

module.exports.jobapplicants = async (req, res) => {
    try {
        

        const job = await Job.find({}).populate('applicants')

        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }

        res.status(200).json(job);
    } catch (error) {
        console.error('Error fetching job details:', error);
        res.status(500).json({ error: 'Server Error' });
    }

}


// filters
module.exports.jobFiltersController = async (req, res) => {

    try {
        const { selectSkills, selectedTechStack, experience } = req.body;
        let args = {};

        // Check if selectedSkills has items
        if (selectSkills.length > 0) {
            args['selectedSkills.name'] = { $in: selectSkills.map(skill => skill.name) };
        }

        // Check if selectedTechStack has items
        if (selectedTechStack.length > 0) {
            args['selectedTechStack.name'] = { $in: selectedTechStack.map(stack => stack.name) };
        }
        if (experience) {
            args['experience'] = { $in: experience }
        }
        const jobs = await Job.find(args);
        res.status(200).send({
            success: true,
            jobs,

        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error while filtering jobs",
            error,
        });
    }
};




// search product
module.exports.searchjobController = async (req, res) => {

    try {
        const { keyword } = req.params;
        const results = await Job
            .find({
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                ],
            })

        
        res.json(results);
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error In Search Product API",
            error,
        });
    }
};

// // similar products
exports.realtedjobController = async (req, res) => {
    try {
        const experience = req.params.experience;
        // You can adjust the tolerance based on your definition of similarity

        const jobs = await Job.find({
            experience: { $gte: experience }
        }).limit(3);

        res.status(200).send({
            success: true,
            jobs,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: "Error while getting related jobs",
            error,
        });
    }
};




