const User = require('../model/userModel');
const cookieController = require('./cookieController');
const bcrypt = require('bcrypt');
const saltRounds = 10;
// const otpGenerator = require('otp-generator');
const transporter = require('../config/nodeMailer');
const randomstring = require("randomstring");

// let OTP = null; // Not Used

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
    req.flash('error', 'Missing fields during registration');
    return res.redirect('/signup');
  }

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    req.flash('error', 'Passwords do not match');
    return res.redirect('/signup');
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log('User already exists with email:', email);
    req.flash('error', 'User already exists with email');
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
    req.flash('success', 'User created successfully');

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

  // Check if email exist in database
  if (!req.user.email) {
    console.log('User not found:', req.user);
    req.flash('error', 'User not found');
    return res.redirect('/signup');
  }

  // if password not matched
  if (!await bcrypt.compare(req.body.password, req.user.password)) {
    console.log('Password did not match');
    req.flash('error', 'Password did not match');
    return res.redirect('/signin');
  }

  // Set Cookie
  await cookieController.setCookie(req, res, userId);

  console.log('User logged in successfully:', req.user);

  req.flash('success', 'User logged in successfully');
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
    req.flash('success', 'User has been logged out!');
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
    req.flash('error', 'Missing fields during password change');
    return res.redirect('/change-password');
  }

  if (newPassword !== confirmPassword) {
    console.log('Passwords do not match');
    req.flash('error', 'Passwords do not match');
    return res.redirect('/change-password');
  }

  // Check if user exists
  const existingUser = req.user;
  if (!existingUser) {
    console.log('User not found');
    req.flash('error', 'User not found');
    return res.redirect('/signup');
  }

  try {
    const isMatch = await bcrypt.compare(oldPassword, existingUser.password);
    if (!isMatch) {
      console.log('Incorrect old password');
      req.flash('error', 'Incorrect old password');
      return res.redirect('/change-password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    existingUser.password = hashedPassword;

    await existingUser.save();

    console.log('Password changed successfully', existingUser);

    req.flash('success', 'Password changed successfully');
    res.redirect('/dashboard');
  } catch (err) {
    console.log('Error during password change:', err);
    req.flash('error', 'Error during password change');
    res.redirect('/change-password');
  }
};

// Forget Password Controllers
const forgetPasswordValidateController = (req, res) => {
  return res.render('forget-password-validate');
}

const forgetPasswordValidatePostController = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log('Email is required');
    req.flash('error', 'Email is required');
    return res.redirect('/forget-password-validate');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      console.log('User not found');
      req.flash('error', 'User not found');
      return res.redirect('/signup');
    }

    const resetLink = `http://localhost:3002/forget-password/${existingUser._id}`; // Instead of OTP

    const token = randomstring.generate(10);
    existingUser.token = token;
    await existingUser.save();
    console.log('User token:', existingUser.token);

    // Generate and send OTP [ Not Used ]
    // OTP = otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
    // console.log('OTP generated:', OTP);

    console.log('Reset Link: ', resetLink);

    let mailOptions = {
      from: 'viveksojitra1110@gmail.com',
      to: existingUser.email,
      subject: 'Password Reset Link',
      text: `Please! Nevigate to this link to reset your password:
        <a href="${resetLink}">Reset Password</a>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {

        console.log("Please check your email", error);
        req.flash('error', 'Please check your email');
        return res.redirect('/forget-password-validate');
      }
      console.log(`Message is sent on ${existingUser.email}`);
      req.flash('success', 'Please check your email');

    });

    return res.redirect(`/forget-password-validate`);
  } catch (err) {
    console.log('Error finding user:', err);
    req.flash('error', 'User not exists');
    return res.redirect('/forget-password-validate');
  }
};

// OTP Validate [ Not Used ]
// const otpValidateController = (req, res) => res.render('otp-validate');

// const otpValidatePostController = (req, res) => {
//   const { otp } = req.body;

//   if (!otp) {
//     console.log('OTP is required');
//     return res.redirect('/otp-validate');
//   }

//   if (otp !== OTP) {
//     console.log('Invalid OTP');
//     return res.redirect('/otp-validate');
//   }

//   console.log('OTP validated successfully');
//   res.redirect('/forget-password');
// };

// Forget Password Page
const forgetPasswordController = async (req, res) => {
  const userId = req.params.id;

  try {
    const existingUser = await User.findById(userId);

    //Check if token is valid and not null
    if (!existingUser.token) {
      console.log('Token is not valid or expired');
      req.flash('error', 'Link is not valid or expired');
      return res.redirect('/page404');
    }
    console.log('Token Validated:', existingUser.token);


    if (!existingUser) {
      console.log('User not found');
      req.flash('error', 'User not found');
      return res.redirect('/page404');
    }

    return res.render('forget-password', { userId });
  } catch (err) {
    console.log('Error finding user:');
    req.flash('error', 'User not found');
    return res.redirect('/page404');
  }
};

// Forget Password Post Controller
const forgetPasswordPostController = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const userId = req.params.id;

  if (!password || !confirmPassword) {
    console.log('Missing fields during password change');
    req.flash('error', 'Missing fields during password change');
    return res.redirect(`/forget-password/${userId}`);
  }

  if (password !== confirmPassword) {
    console.log('Passwords do not match');
    req.flash('error', 'Passwords do not match');
    return res.redirect(`/forget-password/${userId}`);
  }

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      console.log('User not found');
      req.flash('error', 'User not found');
      return res.redirect('/signin');
    }

    // Now set token to null
    existingUser.token = null;
    console.log('Token Expired:', existingUser.token);

    existingUser.password = await bcrypt.hash(password, saltRounds);
    await existingUser.save();

    console.log('Password changed successfully', existingUser);
    req.flash('success', 'Password changed successfully');
    res.redirect('/signin');
  } catch (err) {
    console.log('Error during password change:', err);
    req.flash('error', 'Error during password change');
    return res.redirect(`/forget-password/${userId}`);
  }
};

// Page404 Controller
const page404Controller = (req, res) => {
  req.flash('error', 'Page not found');
  res.render('page404');
}

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
const profileController = async (req, res) => {

  const user = await User.findOne({ _id: req.cookies.userId }).select('name').select('email');
  res.render('profile', { username: user.name, email: user.email });
}

// Topic Page
const topicController = (req, res) => {
  res.render('topic');
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
  // otpValidateController, [ Not Used ]
  // otpValidatePostController, [ Not Used ]
  forgetPasswordController,
  forgetPasswordPostController,
  page404Controller,
  topicController,
};
