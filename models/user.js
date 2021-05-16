const mongoose = require("mongoose");
const uuidv1 = require("uuid/v1");
const crypto = require("crypto");
const { ObjectId } = mongoose.Schema;
const Post = require("./post");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true, //On inserting name if user have space ' ' e.g. ' tej' in the begining by mistake that will be removed
        required:true
     },
 
     email:{
        type:String,
        trim: true, //On inserting email if user have space ' ' in the begining by mistake that will be removed
        required:true
     },
 
     hashed_password:{
        type:String,
        required:true
     },
     salt:String, //salt will be a long randomly generated complicated string for security purpose e.g. gfhskshsf%3:kfkf
     created:{
       type:Date,
       default:Date.now //In JS  we use Date.now() but in mongoose we use Date.now
     },
     updated:Date,
     photo:{
       data:Buffer,
       contentType:String //this will store the value of image type
     },
     about:{
       type:String,
       trim: true //On inserting about info if user have space ' ' e.g. ' tej' in the begining by mistake that will be removed
     },
     //following & followers will be a list of {{type:ObjectId,ref:"User"}}
     //when we follow another user we want to reference that user based on the Objectid e.g.Object id of User model.
     following:[{type:ObjectId,ref:"User"}],
     followers:[{type:ObjectId,ref:"User"}],
    resetPasswordLink: {
        data: String,
        default: ""
    },
    role: {
        type: String,
        default: "subscriber"
    }
});

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field
userSchema
    .virtual("password")
    .set(function(password) {
        //This function will take the password, hash the password & then will save hashed password
        // create temporary variable called _password
        this._password = password;
        //generate a timestamp for salt so that we can generate encrypted password
        this.salt = uuidv1();// ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'  this wil give us a unique timestamp
        // encryptPassword()
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;//this is also a plane password
    });//so this virtual field will get plane password and will set it to hashed password

//Just like Virtual fields we can also add methods to our schema
// methods
userSchema.methods = {
    authenticate: function(plainText) { //function will take plainText which wiil be password
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if (!password) return "";
        try {
            //this is going to create a hash version with salt and password
            return crypto
                .createHmac("sha1", this.salt)
                .update(password) // we want to update password
                .digest("hex");
        } catch (err) {
            return "";
        }
    }
};

// pre middleware
userSchema.pre("remove", function(next) {
    Post.remove({ postedBy: this._id }).exec();
    next();
});

module.exports = mongoose.model("User", userSchema);

/*  The difference between Date.now() and Date.now is that Date.now() calls the function and
 returns the result, while Date.now returns the function itself. */
//
//ObjectId is the part of mongoose.Schema, each mongoose.Schema is assigned an ObjectId by mongDB.
