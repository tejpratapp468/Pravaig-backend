const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    hasAuthorization
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

//Router is a method from express is used when you want to create a new router object in your program
//to handle requests.
const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

//this route(to show all the users) is accessible for everyone we don't want authentication
router.get("/users", allUsers);

//getUser() will return req.profile & profile will be available bcz userById() method has already run
//anything we pass after user/ will be captured as userId e.g user/5cthehrtt987 i.e. user/userId & with this we will be able to grab userId
router.get("/user/:userId", requireSignin, getUser);

//to update info we use http route put
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);

//to delete info we use http route delete
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);

// to show user photo
router.get("/user/photo/:userId", userPhoto);

// to show the people whom a user can follow
router.get("/user/findpeople/:userId", requireSignin, findPeople);

// any route containing :userId, our app will first execute userByID()
/*we are looking for the parameter 'userId' in the incoming request url by using param() method,
so any route containing parameter called 'userId' our app will first execute a method  userById()*/
router.param("userId", userById);

module.exports = router;

