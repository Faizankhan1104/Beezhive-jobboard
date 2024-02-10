const express = require("express");
const { registerController, loginController, uploadResume, getResumes, downloadResume, applicantDownloadResume, addProfilePicture, getUpdatedUser, profilePhoto, getUser, updateSkills } = require('../controllers/authController');
const { verifyToken, requireSignIn } = require("../middlewares/authMiddleware");
const { upload, uploadProfile } = require("../middlewares/multer.middleware")
const { getJobDetails } = require('../controllers/jobFormController');
const File = require('../models/file.model');
const jwt = require('jsonwebtoken');
const UserModel = require("../models/UserModel")
const multer = require("multer");

const router = express.Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.post("/upload/:_id", verifyToken, upload, uploadResume);

// router.post('/postjob', createJob);


// Protected routes
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get('/get-User/:_id',  getUser);
router.get('/download/:fileName/:_id', verifyToken, downloadResume);
router.get('/download-applicant-resume/:_id', applicantDownloadResume);


router.get("/register", (req, res) => {
  res.render("register")
})

router.get('/protected-route', verifyToken, (req, res) => {

  res.json({ message: 'This is a protected route', user: req.user });
});
// router.get('/getjob/:jobId', getJobDetails);s
router.get('/resumes/:_id', verifyToken, getResumes);
router.get('/get-updated-user', verifyToken, getUpdatedUser);
router.get("/profile-photo/:_id", profilePhoto);
router.put("/update-user-profile/:_id", updateSkills);
router.put('/add-profile-picture/:_id', verifyToken, uploadProfile, addProfilePicture);




module.exports = router;

