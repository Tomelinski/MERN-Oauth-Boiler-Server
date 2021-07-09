const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const User = require("../models/user");
const DBConfig = require("../config/db");

passport.use(
  new GoogleStrategy(
    {
      clientID: DBConfig.google.clientID,
      clientSecret: DBConfig.google.clientSecret,
      callbackURL: "http://localhost:8080/auth/google/redirect",
      passReqToCallback: true,
    },
    (req, accessToken, refreshToken, profile, done) => {
      // passport callback function
      //check if user already exists in our db with the given profile ID
      //console.log(profile);
      User.findOne({ emailAddress: profile.emails[0].value }).then(
        (currentUser) => {
          if (currentUser) {
            //if we already have a record with the given profile ID
            done(null, currentUser);
          } else {
            //if not, create a new user
            new User({
              username: profile.name.givenName + profile.name.familyName,
              emailAddress: profile.emails[0].value,
              displayName: profile.displayName,
            })
              .save()
              .then((newUser) => {
                done(null, newUser);
              });
          }
        }
      );
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
