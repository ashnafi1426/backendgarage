const express = require('express');
const router = express.Router();
const loginControllers = require("../../controllers/loginControllers/login.controller");

router.post("/api/employee/login", loginControllers.logIn);

module.exports = router;
