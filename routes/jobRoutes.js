const express = require("express");
const { requireSignIn, verifyToken, isEmployer, isJobOwner } = require("../middlewares/authMiddleware");
const { createNewJob, getJobs, getSingleJob, deletejobController, updatejobController, applyJob, applicant, getMyJob, jobapplicants, jobFiltersController, searchjobController, realtedjobController } = require('../controllers/jobCreateController');
const { uploadResume } = require("../controllers/authController");
// const formidable = require("express-formidable");

const router = express.Router();

//routes
router.post(
  "/postjob/:_id",
  verifyToken,
  isEmployer,
  createNewJob
);

router.post(
  "/apply-job/:_id/:userId",
  requireSignIn,
  applyJob,
)
//routes
router.put(
  "/update-job/:_id/:userId",
  requireSignIn,
  // verifyToken,
  isJobOwner,
  // formidable(),
  updatejobController
);

//get jobs
router.get("/getjobs", getJobs);
router.get("/job-applicant/:_id", applicant);


// //single job
router.get("/get-job/:slug", getSingleJob);
router.get("/get-my-jobs/:_id", verifyToken, getMyJob);
router.get("/job-applicants", jobapplicants);


// //delete rjob
router.delete("/delete-job/:_id", verifyToken, isJobOwner, deletejobController);

// //filter job
router.post("/job-filters", jobFiltersController);


//search job
router.get("/search/:keyword", searchjobController);

// //similar job
router.get("/related-job/:experience", realtedjobController);


module.exports = router;
