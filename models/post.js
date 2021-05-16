const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema; //we can refer to the object id of any of the schema

//method to make new Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
          // minlength: 4, :we get rid of this because we have validation in validator
          // maxlength: 150
    },
    body: {
        type: String,
        required: true
       // minlength: 4,
       // maxlength: 2000
    },
    photo: {
        data: Buffer, /*buffer is used to store binary data like img,videos which are big in size,when we upload img it go from
        fontend to backend in request.body.So it takes some time to receive entire img,until it is fully received by backend
        it is avaialable in buffer.In buffer we store data  in binary format.*/
        contenType: String
    },
    postedBy: {  //this field buids relationship b/w user & post i.e. 'This post created by this user'
        type: ObjectId,
        ref: 'User' //based on User's ObjectId postedBy will be decided
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    likes: [{ type: ObjectId, ref: 'User' }], //based on user's ObjectId likes will be counted by the size of list
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: 'User' }
        }
    ]
}); 

module.exports = mongoose.model('Post', postSchema);
