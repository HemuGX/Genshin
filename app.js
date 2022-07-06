const env = require('dotenv').config()
const express = require ("express");
const ejs = require ("ejs")
const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")


const app = express()

app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: true
}))

// Mongoose


const oneDay = 1000 * 60 * 60 * 24;

app.use(session({ //Letting express use express-session.
  secret: "My big secret",
  resave: false,
  cookie: {
    maxAge: oneDay
  }, //Cookies will last for one day
  saveUninitialized: false
}))

app.use(passport.initialize()); //we are initilaizing passport
app.use(passport.session()); //We are telling passport to use session.


mongoose.connect(process.env.MONGODB_SERVER)


const userSchema = new mongoose.Schema({
    username: String,
    password: String,
  })

  userSchema.plugin(passportLocalMongoose);
  
  const User = mongoose.model("User", userSchema)
  
  passport.use(User.createStrategy());
  
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

// ENds   Mongoose

app.get("/register", (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect("/")
    } else {
      res.render("register")
    }
  })

app.post("/register", (req, res) => {
    User.register({
      username: req.body.username
    }, req.body.password, (err, newUser) => {
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/")
        })
      }
    })
  })



  app.get("/login", (req, res) => {


    if (req.isAuthenticated()) {
      
      res.redirect("/")
      console.log("logged in");
    } else {
      res.render("login")
    }
  
  })
  
  
  app.post("/login", (req, res) => {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
  
    req.login(user, (err) => {
      if (!err) {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/")
        })
      }
    })
  })
//////LOG OUT//////


app.get("/logout", (req, res) => {
  req.logout(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/")
    }
  })

})


app.get("/",(req,res) => {
  if (req.isAuthenticated()) {
    res.render("home",{user:"loggedIn"})
  } else {
    res.render("home",{user:"notLoggedIn"})
  }
})

app.get("/primogems",(req,res) => {
    res.render("primogems")
})
app.get("/resin",(req,res) => {
    res.render("resin")
})
app.get("/events",(req,res) => {
    res.render("events")
})


app.listen(process.env.PORT||3000,(req,res) => {
    console.log("Server is running!");
})