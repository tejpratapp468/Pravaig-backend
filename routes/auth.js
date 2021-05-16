//this file will have all auth routes like login,signup
const express = require('express');
const { signup, signin, signout, forgotPassword, resetPassword, socialLogin } = require('../controllers/auth');

// import password reset validator
const { userSignupValidator, userSigninValidator, passwordResetValidator } = require('../validator');
const { userById } = require('../controllers/user');

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router = express.Router();

//this is a post request bcz from frontend we are going to post to backend
//userSignupValidator will apply validation, if all those validation pass only then flow will go to controller signup
router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);

//Signout is a get request bcz we are not posting anything
router.get('/signout', signout);

// password forgot and reset routes
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);

// then use this route for social login
router.post('/social-login', socialLogin);

// any route containing :userId, our app will first execute userByID()
router.param('userId', userById);

module.exports = router;
