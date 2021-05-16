const express = require('express');
const {
    getPosts,
    createPost,
    postsByUser,
    postById,
    isPoster,
    updatePost,
    deletePost,
    photo,
    singlePost,
    like,
    unlike,
    comment,
    uncomment,
    updateComment
} = require('../controllers/post');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { createPostValidator } = require('../validator');//we don't need to write validator/index.js bcz
//index.js file will be loaded automatically by using name of folder, this is the  Benefit of creating index file

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router = express.Router();

router.get('/posts', getPosts);

// like unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

// comments
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);
router.put('/post/updatecomment', requireSignin, updateComment);

// post routes

//to create a post
/*currently create post is handled by formidable package,so this package i.e.createPost should run first before we go for validator*/
//this is a post request bcz from frontend we are going to post to backend
/*requiredSignin will check for secret if secret is not found access to "/post" route will not be given, To create a new post user must be signed in*/
router.post('/post/new/:userId', requireSignin, createPost, createPostValidator);

//to get all the posts of a particular user
router.get('/posts/by/:userId', requireSignin, postsByUser);

//to get a single post
router.get('/post/:postId', singlePost);

//method to update post to update info we use http route put
router.put('/post/:postId', requireSignin, isPoster, updatePost);

//method to delete a post
//User must be signed in and user should be correct user(i.e. he must be same who created post)
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// to get post photo
router.get('/post/photo/:postId', photo);

// any route containing :userId, our app will first execute userById()
router.param('userId', userById);
// any route containing :postId, our app will first execute postById()
router.param('postId', postById);

module.exports = router;

//we put like & unlike routes on top,bcz below routes has post/:postId so to avoid conflict we have put these routes on top 