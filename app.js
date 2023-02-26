

//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose= require("mongoose");
var encrypt = require('mongoose-encryption');



const app= express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.set('strictQuery', true);
app.use(bodyParser.urlencoded({
    extented:true
}))



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/userDB');
  
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/userDB');` if your database has auth enabled
}




var userSchema = new mongoose.Schema({
    email: String,
    password: String,

});


userSchema.plugin(encrypt, { secret: process.env.SECRET , encryptedFields: ['password'] });

const User= new mongoose.model("User", userSchema);


app.get("/", function(req,res){
    res.render("home");
});

app.get("/login", function(req,res){
    res.render("login");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res) {
    const newUser = new User({
        email: req.body.username,
        password:req.body.password
    });

  newUser.save(function(err){
    if (err){
        console.log(err)
    } else {
        res.render("secrets");
    }

  });

});


app.listen(3000, function(){
    console.log("server started on port 3000");
})