const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware')
const {emailVerificationController, forgetPasswordController, verifiedEmail, resetPassword, changeEmail} = require('../controllers/email.verify');


router.post('/send-verification-email', verifyToken, emailVerificationController);
router.post('/forgot-password', forgetPasswordController);

router.put('/verified-email/:email', verifiedEmail);
router.put('/reset-password', resetPassword);
router.put('/change-email/:_id', verifyToken, changeEmail);
module.exports = router;
