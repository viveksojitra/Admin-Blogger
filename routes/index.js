const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cookieController = require('../controllers/cookieController');
const authControllers = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const passport = require('../config/passport.js');
const isAuthenticated = require('../config/isAuth');
const otpGenerator = require('otp-generator');

// Default route
router.get('/', authControllers.defaultController);

// Auth routes
router.get('/signup', authControllers.registerController);
router.post('/signupPost', authControllers.registerPostController);
router.get('/signin', authControllers.loginController);
router.post('/signinPost', passport.authenticate('local', { failureRedirect: '/signin' }), authControllers.loginPostController);
router.get('/logout', authControllers.logoutController);
router.get('/change-password', isAuthenticated, authControllers.changePasswordController);
router.post('/change-password-post', isAuthenticated, authControllers.changePasswordPostController);

// Forget Password Validate
router.get('/forget-password-validate', authControllers.forgetPasswordValidateController);
router.post('/forget-password-post-validate', authControllers.forgetPasswordValidatePostController);

// OTP Validate [ Not Used ]
// router.get('/otp-validate', authControllers.otpValidateController);
// router.post('/otp-post-validate', authControllers.otpValidatePostController);

// Forget Password
// router.get('/forget-password', authControllers.forgetPasswordController); [ Not Used ]
// router.post('/forget-password-post', authControllers.forgetPasswordPostController); [ Not Used ]
router.get('/forget-password/:id', authControllers.forgetPasswordController); // [ Link Route ]
router.post('/forget-password-post/:id', authControllers.forgetPasswordPostController); // [ Link Route ]

// Page404
router.get('/page404', authControllers.page404Controller);

// Cookie routes
router.get('/setcookie', cookieController.setCookie);
router.get('/getcookie', cookieController.getCookie);
router.get('/clearcookie', cookieController.clearCookie);

// User Pages routes
router.get('/dashboard', isAuthenticated, authControllers.dashboardController);
router.get('/profile', isAuthenticated, authControllers.profileController);

// Blog Topic Routes
router.get('/topic', isAuthenticated, blogController.topicController);
router.post('/topic-post', isAuthenticated, blogController.topicPostController);
router.get('/delete-topic/:id', isAuthenticated, blogController.deleteTopicController);


// Blog Routes
router.get('/explore', isAuthenticated, blogController.viewAllBlogs);
router.get('/my-blogs', isAuthenticated, blogController.viewMyBlogs);
router.get('/create-blog', isAuthenticated, blogController.addBlogForm);
router.post('/add', isAuthenticated, upload.single('image'), blogController.addBlog);
router.get('/edit/:id', isAuthenticated, blogController.editBlogForm);
router.post('/update-blog/:id', isAuthenticated, upload.single('image'), blogController.updateBlog);
router.get('/delete/:id', isAuthenticated, blogController.deleteBlog);

module.exports = router;
