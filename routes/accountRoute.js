// needed resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const utilities = require('../utilities');

// route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post(
    "/register",
    utilities.handleErrors(accountController.registerAccount)
)

module.exports = router;

