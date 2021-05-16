const express=require("express");
const app=express();
const mongoose=require("mongoose");
const morgan=require("morgan");
const bodyParser=require("body-parser");
const cookieParser=require('cookie-parser');
const expressValidator=require("express-validator");
//'fs'=file-system is a core nodejs module which gives access to file system on yuor pc
const fs=require("fs");
//for separate domain API and separate domain frontend we 'cors' package
const cors=require("cors");

const dotenv=require("dotenv");
//we use  dotenv npm package to access environment variables
// to use this dotenv we need to invoke a config method
dotenv.config();

//config DB to connect wih DB
//mongodb://localhost/nodeapi
mongoose.connect(process.env.MONGO_URI,
  {useNewUrlParser:true, useUnifiedTopology:true})
  .then(() => console.log("DB connected Successfully")) //if success .then() will run
  .catch((error) => console.log(error.message));// this method is used to check error

//this method will be called upon error occured
mongoose.connection.on("error",err => {
  console.log(`DB connection error: ${err.message}`);
});
mongoose.set('bufferCommands', false);


//bring in routes
const postRoutes=require("./routes/post");
const authRoutes=require("./routes/auth");
const userRoutes=require("./routes/user");

//apiDocs
app.get("/", (req, res) => {
  //to serve the data to anyone making request to '/'
  fs.readFile("docs/apiDocs.json", (err, data) => {
      if(err){
        res.status(400).json({
          error:err
        })
      }
      //using JSON.parse() method to Parse the data which is read from file
      const docs=JSON.parse(data);
      res.json(docs);
  })

})

//<-------------------------------middleware-section---------------------------------------->

app.use(cors());//we have invoked 'cors' with cors();

//Any Incoming request's body will be parsed to jason format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Morgan is used for logging request details
app.use(morgan("dev"));

//'cookie-parser' will help us to parse request cookie to authenticate login users
app.use(cookieParser())

//This is used for giving proper error message to user which makes sense
app.use(expressValidator());


//app.get is changed to app.use() since we are using this route as middleware to handle get request
//request on '/api' will get passed postRoutes
app.use("/api",postRoutes);//to avoid conflict we should give distict names to routes
app.use("/api",authRoutes);//we can leave app.use("/api") as it is if we  handle them properly in routes folder
app.use("/api",userRoutes);

//this method is from express-jwt package
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error:'Unauthorized User!'});
  }
});
//<-------------------------------middleware-section---------------------------------------->


const port=process.env.PORT || 8080;
app.listen(port,() => {
  console.log(`A Node Js API is listening on port: ${port}`);
}) ;
