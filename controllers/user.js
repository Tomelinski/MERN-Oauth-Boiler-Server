const passport = require("passport");
const User = require("../models/user");

const login = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    // Check for Server Errors
    if (err) {
      console.error(err);
      return next(err);
    }
    // Check for Login Errors
    if (!user) {
      return res.redirect("/login");
    }

    req.login(user, (err) => {
      // Check for Database Errors
      if (err) {
        console.error(err);
        return next(err);
      }

      return res.redirect("/");
    });
  })(req, res, next);
};

const register = (req, res, next) => {
  // Instantiate a User object
  let newUser = new User({
    username: req.body.Username,
    emailAddress: req.body.EmailAddress,
  });

  User.register(newUser, req.body.Password, (err) => {
    // Check for Server Errors
    if (err) {
      console.error("Error: Inserting New User");
      if (err.name == "UserExistsError") {
        console.error("Error: User Already Exists");
      }
      return res.redirect("/login");
    }
    // Automatically Authenticate the User
    return passport.authenticate("local")(req, res, () => {
      return res.redirect("/");
    });
  });
};

const logout = (req, res, next) => {
  req.logout();
  console.log("User Logged Out.");
  res.redirect("/login");
};

//exports.getusers = getusers;
exports.login = login;
exports.register = register;
exports.logout = logout;
