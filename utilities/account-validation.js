const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
        
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists) {
            throw new Error("Email exists. Please log in or use different email")
            }
        }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

validate.loginRules = () => {
    return [
      // email is required and must be valid
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (!emailExists) {
            throw new Error("Email not found. Please register or use different email")        
            }
        }),
    ]
}

validate.updateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2})
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .escape()
      .normalizeEmail()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        console.log("REQ!!!!")
        console.dir(req.body)
        const emailExists = await accountModel.checkExistingEmail(account_email, req.body.old_email)
        if (emailExists) {
          throw new Error("Email exists. Please uee a different email.")
        }
      })  
  ]
}

validate.updatePasswordRules = () => {
  return [
    body("account_password")
    .trim()
    .notEmpty()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements.")
  ]
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.messageRules = () => {
  return [
    
    // valid email is required and cannot already exist in the DB
    body("message_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
        errors,
        title: "Login",
        nav,
        account_email,
      })
      return
    }
    next()
}

validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email} = req.body
  let errors = []
  erros = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.checkUpdatePasswordData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/update", {
          errors,
          title: "Update",
          nav,
      });
      return;
  }
  next();
};

validate.checkMessageData = async (req, res, next) => {
  let errors = [];
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("account/message", {
          errors,
          title: "Message",
          nav,
      });
      return;
  }
  next();
};

module.exports = validate;