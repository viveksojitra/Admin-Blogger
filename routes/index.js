const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const cookieController = require('../controllers/cookieController');
const authControllers = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const passport = require('../config/passport.js');
const isAuthenticated = require('../config/isAuth');

// Default route
router.get('/', authControllers.defaultController);

// Auth routes
router.get('/signup', authControllers.registerController);
router.post('/signupPost', authControllers.registerPostController);
router.get('/signin', authControllers.loginController);
router.post('/signinPost', passport.authenticate('local', { failureRedirect: '/signin' }), authControllers.loginPostController);
router.get('/logout', authControllers.logoutController);
router.get('/change-password', isAuthenticated, authControllers.changePasswordController);
// router.post('/change-password-post', isAuthenticated, authControllers.changePasswordPostController);
router.get('/forget-password', authControllers.forgetPasswordController);
// router.post('/forget-password-post', authControllers.forgetPasswordPostController);

// Cookie routes
router.get('/setcookie', cookieController.setCookie);
router.get('/getcookie', cookieController.getCookie);
router.get('/clearcookie', cookieController.clearCookie);

// User routes
router.get('/dashboard', isAuthenticated, authControllers.dashboardController);
router.get('/profile', isAuthenticated, authControllers.profileController);

// Blog Routes
router.get('/explore', isAuthenticated, blogController.viewAllBlogs);
router.get('/my-blogs', isAuthenticated, blogController.viewMyBlogs);
router.get('/create-blog', isAuthenticated, blogController.addBlogForm);
router.post('/add', isAuthenticated, upload.single('image'), blogController.addBlog);
router.get('/edit/:id', isAuthenticated, blogController.editBlogForm);
router.post('/update-blog/:id', isAuthenticated, upload.single('image'), blogController.updateBlog);
router.get('/delete/:id', isAuthenticated, blogController.deleteBlog);

module.exports = router;
