const express = require('express'), router = express.Router();
const studentController = require("../controllers/students");
router.post('/register', studentController.register);
router.post('/login', studentController.login);

module.exports = router;