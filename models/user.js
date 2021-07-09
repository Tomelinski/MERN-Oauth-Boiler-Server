const mongoose = require("mongoose");
const PassportLocalSchema = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: String,
    emailAddress: String,
    displayName: String,
    created: {
      type: Date,
      default: Date.now(),
    },
    updated: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    collection: "users",
  }
);

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
