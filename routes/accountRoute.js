// needed resources
const express = require('express');
const router = new express.Router();
const accountController = require('../controllers/accountController');
const regValidate = require('../utilities/account-validation');
const utilities = require('../utilities');

// route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

router.get(
  "/register", 
  utilities.handleErrors(accountController.buildRegister)
)

router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

router.get(
  "/message/:inventoryId",
  utilities.handleErrors(accountController.buildMessage)
)
router.post(
  "/message",
  regValidate.messageRules(),
  regValidate.checkMessageData,
  utilities.handleErrors(accountController.sendMessage)
)

router.get(
  "/view-messages",
  utilities.handleErrors(accountController.buildViewMessages),
  utilities.handleErrors(accountController.showMessages)
)

// Process the login attempt
router.get(
  "/",
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
)

router.post(
  "/",
  utilities.handleErrors(accountController.buildAccountManagement)
)

// logout route

router.get(
  "/logout",
  utilities.handleErrors(accountController.accountLogout)
)

// update account routes

router.get(
  "/update/:account_id",
  utilities.handleErrors(accountController.buildUpdate)
)
router.post(
  "/update",
  regValidate.updateRules(),
  utilities.handleErrors(accountController.updateAccount)
)
router.post(
  "/update-password",
  regValidate.updatePasswordRules(),
  regValidate.checkUpdatePasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;

