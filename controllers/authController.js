const User = require('../model/userModel');
const cookieController = require('./cookieController');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const otpGenerator = require('otp-generator');

let OTP = null;
let existingUserId = null;

// DEFAULT CONTROLLER
const defaultController = async (req, res) => {
  try {
    if (!req.cookies.userId) {
      return res.redirect('/signup');
    } else {
      const user = await User.findOne({ _id: req.cookies.userId }).select('name');
      if (!user) {
        return res.redirect('/signup');
      }
      return res.render('dashboard', { username: user.name });
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
};

// AUTH CONTROLLERS -----------------------------------------------------------------------------------------------------------------------------------------------------
// Register controller
const registerController = (req, res) => {
  return res.render('sign-up');
};

const registerPostController = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  console.log('User registration started:', { name, email });

  if (!name || !email || !password || !confirmPassword) {
    console.log('Missing fields during registration');
    return res.redirect('/signup');
  }

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.redirect('/signup');
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('User already exists with email:', email);
    return res.redirect('/signup');
  }

  try {
    console.log('Hashing password:', password);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log('User created successfully:', newUser);

    res.cookie('userId', newUser._id.toString());

    return res.redirect('/signin');
  } catch (error) {
    console.error('Error during registration:', error);
    return res.redirect('/signup');
  }
};


// Login controller
const loginController = (req, res) => {
  return res.render('sign-in');
}

// Login post controller
const loginPostController = async (req, res) => {
  const userId = req.user._id.toString();
  res.cookie('userId', userId);

  // if user not found
  if (!req.user) {
    console.log('User not found:', req.user);
    return res.redirect('/signup');
  }

  // if password not matched
  if (!await bcrypt.compare(req.body.password, req.user.password)) {
    console.log('Password did not match');
    return res.redirect('/signin');
  }

  // Set Cookie
  await cookieController.setCookie(req, res, userId);

  console.log('User logged in successfully:', req.user);
  res.redirect('/');
};

// Logout controller
const logoutController = (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.clearCookie('userId');
    console.log('User has been logged out!');
    res.redirect('/signin');
  });
};

// Change Password
const changePasswordController = (req, res) => {
  return res.render('change-password');
}

const changePasswordPostController = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (!oldPassword || !newPassword || !confirmPassword) {
    console.log('Missing fields during password change');
    return res.redirect('/change-password');
  }

  if (newPassword !== confirmPassword) {
    console.log('Passwords do not match');
    return res.redirect('/change-password');
  }

  // Check if user exists
  const existingUser = req.user;
  if (!existingUser) {
    console.log('User not found');
    return res.redirect('/signup');
  }

  try {
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      console.log('Incorrect old password');
      return res.redirect('/change-password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    existingUser.password = hashedPassword;

    await existingUser.save();

    console.log('Password changed successfully', existingUser);
    res.redirect('/dashboard');
  } catch (err) {
    console.log('Error during password change:', err);
    res.redirect('/change-password');
  }
};

// Forget Password Controllers
const forgetPasswordValidateController = (req, res) => res.render('forget-password-validate');

const forgetPasswordValidatePostController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log('Email is required');
    return res.redirect('/forget-password-validate');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log('User not found');
      return res.redirect('/signup');
    }

    // Generate and send OTP (implementation for sending the OTP via email is needed)
    OTP = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    existingUserId = existingUser._id;
    console.log('OTP generated:', OTP);

    res.redirect('/otp-validate');
  } catch (err) {
    console.log('Error finding user:', err);
    return res.redirect('/forget-password-validate');
  }
};

// OTP Validate
const otpValidateController = (req, res) => res.render('otp-validate');

const otpValidatePostController = (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    console.log('OTP is required');
    return res.redirect('/otp-validate');
  }

  if (otp !== OTP) {
    console.log('Invalid OTP');
    return res.redirect('/otp-validate');
  }

  console.log('OTP validated successfully');
  res.redirect('/forget-password');
};

// Forget Password
const forgetPasswordController = (req, res) => res.render('forget-password');

const forgetPasswordPostController = async (req, res) => {
  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    console.log('Missing fields during password change');
    return res.redirect('/forget-password');
  }

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    return res.redirect('/forget-password');
  }

  try {
    const existingUser = await User.findById(existingUserId);
    if (!existingUser) {
      console.log('User not found');
      return res.redirect('/signin');
    }

    existingUser.password = await bcrypt.hash(password, saltRounds);
    await existingUser.save();
    console.log('Password changed successfully', existingUser);
    res.redirect('/signin');
  } catch (err) {
    console.log('Error during password change:', err);
    return res.redirect('/forget-password');
  }
};

// USER CONTROLLERS -----------------------------------------------------------------------------------------------------------------------------------------------------
// Dashboard
const dashboardController = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.redirect('/signin');
    }

    res.render('dashboard', { username: user.name });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.redirect('/signin');
  }
};

// Profile
const profileController = (req, res) => {
  res.render('profile');
}

module.exports = {
  defaultController,
  registerController,
  registerPostController,
  loginController,
  loginPostController,
  logoutController,
  dashboardController,
  profileController,
  changePasswordController,
  changePasswordPostController,
  forgetPasswordValidateController,
  forgetPasswordValidatePostController,
  otpValidateController,
  otpValidatePostController,
  forgetPasswordController,
  forgetPasswordPostController
};
