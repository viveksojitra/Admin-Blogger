const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cookieController = require('../controllers/cookieController');
const authControllers = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const passport = require('../config/passport.js');
const isAuthenticated = require('../config/isAuth');
const otpGenerator = require('otp-generator');

// Default Route
router.get('/', authControllers.defaultController);

// Auth Routes
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

// Cookie Routes
router.get('/setcookie', cookieController.setCookie);
router.get('/getcookie', cookieController.getCookie);
router.get('/clearcookie', cookieController.clearCookie);

// User Pages Routes
router.get('/dashboard', isAuthenticated, authControllers.dashboardController);
router.get('/profile', isAuthenticated, authControllers.profileController);

// View Topics
router.get('/view-topics', isAuthenticated, blogController.viewTopicsSubtopicsController);


// Blog Topic Routes
router.get('/add-topic', isAuthenticated, blogController.addTopicController);
router.post('/add-topic-post', isAuthenticated, blogController.addTopicPostController);
router.get('/delete-add-topic/:id', isAuthenticated, blogController.deleteaddTopicController);

// Blog Subtopic Routes
router.get('/add-subtopic', isAuthenticated, blogController.addSubtopicController);
router.post('/add-subtopic-post', isAuthenticated, blogController.addSubtopicPostController);
router.get('/delete-add-subtopic/:id', isAuthenticated, blogController.deleteSubtopicController);

// Add Comments Routes
router.post('/add-comments/:id', isAuthenticated, blogController.addCommentsController);


// Blog Routes
router.get('/explore', isAuthenticated, blogController.viewAllBlogs);
router.get('/my-blogs', isAuthenticated, blogController.viewMyBlogs);
router.get('/create-blog', isAuthenticated, blogController.addBlogForm);
router.post('/add', isAuthenticated, upload.single('image'), blogController.addBlog);
router.get('/edit/:id', isAuthenticated, blogController.editBlogForm);
router.post('/update-blog/:id', isAuthenticated, upload.single('image'), blogController.updateBlog);
router.get('/delete/:id', isAuthenticated, blogController.deleteBlog);

module.exports = router;
