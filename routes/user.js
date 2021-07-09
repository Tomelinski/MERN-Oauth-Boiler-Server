const express = require("express");

const usersControllers = require("../controllers/user");

const router = express.Router();

router.post("/signup", usersControllers.register);

router.post("/login", usersControllers.login);

router.get("/logout", usersControllers.logout);

module.exports = router;
