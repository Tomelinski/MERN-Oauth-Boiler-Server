const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");

const passport = require("passport");
//const passportLocal = require("passport-local");

require("./auth/googleUser");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const DBConfig = require("./config/db");
const HttpError = require("./models/http-error");

// set port, listen for requests
const PORT = 8080;
//let localStrategy = passportLocal.Strategy; // Alias

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(express.json());

/**
 *  Express Setup
 */
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [DBConfig.secret],
    name: "session",
  })
);

/**
 *  Passport Initialization
 */
app.use(passport.initialize());
app.use(passport.session());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured" });
});

mongoose
  .connect(DBConfig.remoteURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT);
    console.log("listening on " + PORT);
  })
  .catch((err) => {
    console.log(err);
  });
