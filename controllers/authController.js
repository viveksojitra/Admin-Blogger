const User = require('../model/userModel');
const cookieController = require('./cookieController');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
  res.render('change-password');
}

// Forget Password
const forgetPasswordController = (req, res) => {
  res.render('forget-password');
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
  forgetPasswordController
};
