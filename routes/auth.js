const express = require("express");
const passport = require("passport");
//const jwt = require("jsonwebtoken");
const { isUserAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.get("/user", isUserAuthenticated, (req, res) => {
  res.json(req.user);
});

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get("/logout", (req, res) => {
  req.session = null;
  req.logout();
  console.log("User Logged Out.");
  res.redirect("/auth/user");
});

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    successRedirect: "http://localhost:3000/login/success",
    //successRedirect: "http://localhost:8080/auth/user",
  }),
  (req, res) => {
    //res.send(req.user);
    console.log("User has logged in.: " + req.user);

    res.send("You have been logged in");
  }
);

module.exports = router;
