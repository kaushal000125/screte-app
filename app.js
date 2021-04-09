//jshint esversion:6
require("dotenv").config();        //alwaya put env file require on top
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt=require("mongoose-encryption");
const app = express();


console.log(process.env.API_KEY); //parsing API_KEY from .env file
app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});




//<------used when no encrytion is needed----->
/*const userSchema={
  email:String,
  password:String
}*/



//<-----use when encryption is needed---->
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

//const secret="ThisismylittleSecret.";   //secret=encryption key



userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password'] });           //encrypting the password only



const User=new mongoose.model("User",userSchema);

app.get("/",function(req,res){
  res.render("home");
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

//<--------------for registeration page-->
app.post("/register",function(req,res){
  const user1=new User({
    email:req.body.username,
    password:req.body.password
  });
  user1.save(function(err){
    if(err)
    console. log(err);
    else
    res.render("secrets"); //going to secrets page to store registered content
  });

});
//<-------for login page------------------>
app.post("/login",function(req,res){
  const email=req.body.username;
  const password=req.body.password;
  User.findOne({email:email},function(err,foundUser){
    if(err)
    console.log(err);
    else{
       if(foundUser&&foundUser.password===password)
       {
         res.render("secrets");
       }
    }
  });
});





app.listen(3000, function() {
  console.log("Server started on port 3000");
});
