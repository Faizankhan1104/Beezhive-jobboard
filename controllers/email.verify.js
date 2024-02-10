const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { hashPassword } = require("../helpers/authHelpers.js");
dotenv.config();

exports.emailVerificationController = async (req, res) => {
  try {
    const { email } = req.body;

    const verificationCode = generateVerificationCode();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Email Verification',
      text: `Your verification code is: ${verificationCode}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Verification email sent successfully', verificationCode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

function generateVerificationCode() {
  // Implement your code to generate a random verification code (e.g., 6-digit code)
  return Math.floor(100000 + Math.random() * 900000);
}

function generateVerificationCode() {
  // Implement your code to generate a random verification code (e.g., 6-digit code)
  return Math.floor(100000 + Math.random() * 900000);
};


const crypto = require('crypto');

module.exports.forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email: email }).exec();
    if (!user) {
      res.status(400).send("User not found");
    } else {
      const resetToken = generateResetToken(email);

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: email,
        subject: 'Reset Password',
        text: `Click the following link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
      };

      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: 'Password reset email sent successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

function generateResetToken(email) {
  return jwt.sign({ email }, 'itsasecret', {
    expiresIn: '1h',
  });
}


exports.verifiedEmail = async (req, res) => {
  
  try {
    const email = req.params.email; // Corrected line
    await UserModel.findOneAndUpdate(
      { email }, // Use an object to specify the query
      { $set: { verified: true } },
      { new: true }
    );

    res.status(200).json({ message: 'Email verified successfully', verified: true }); // Corrected value
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify the JWT token
    const decodedToken = jwt.verify(token, 'itsasecret');
    if (!decodedToken.email) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    const hashedPassword = await hashPassword(password);
    email = decodedToken.email
    // Find the user with the valid reset token and matching email
    const user = await UserModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true } // Return the updated document

    );


    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

};

const generateToken = (userId, email) => {
  const payload = {
    userId,
    email,
    // Add other relevant payload information as needed
  };

  const options = {
    expiresIn: '1h',  // Token expiration time (adjust as needed)
  };

  const secretKey = process.env.REFRESH_TOKEN_SECRET;  // Replace with your actual secret key
  return jwt.sign(payload, secretKey, options);
};


exports.changeEmail = async (req, res) => {
  
  const userId = req.params._id;
  try {
    const { newEmail, currentPassword } = req.body;

    // Fetch the user from the database
    const user = await UserModel.findById(userId);

    // Check if the provided password is correct
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Incorrect password. Email not changed.' });
    }

    // Update the user's email and set 'verified' to false
    user.email = newEmail;
    user.verified = false;

    // Save the updated user to the database
    await user.save();

    // Reissue JWT token with the updated email
    const newToken = generateToken(user._id, newEmail);

    res.status(200).send({
      success: true,
      message: 'Email changed successfully. Please verify your new email.',
      token: newToken,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};