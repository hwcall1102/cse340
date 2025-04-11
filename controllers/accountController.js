const accountModel = require('../models/account-model')
const detModel = require('../models/detail-model')
const utilities = require('../utilities');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver register view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* **************************
*  deliver message view
* ************************* */
async function buildMessage(req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await detModel.getInventoryById(inv_id)
  const inventoryName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  let nav = await utilities.getNav()
  res.render("account/message", {
    title: "Message -" + inventoryName,
    nav,
    errors: null,
    inv_id,
  })
}

/* *****************************************
* build view message view
* *************************************** */
async function buildViewMessages(req, res, next) {
  let nav = await utilities.getNav()
  const showMessages = await accountModel.getAllMessages()
  if (!showMessages) {
    req.flash("notice", "No messages to display.")
  }
  res.render("account/view-messages", {
    title: "Messages",
    nav,
    errors: null,
    showMessages
  })
}


/* ****************************************
process registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  // Hash the password before storing
  let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
      })
    }

  const regResult = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword)
  
  if (regResult) {
    req.flash("notice",`Congratulations, you\'re registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    })
  }
  
}

/* *********************
*  Unit 5 Login Process
********************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password))
    {
      delete accountData.account_password
      
      utilities.updateCookie(accountData, res)

      return res.redirect("/account")
    } else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    return new Error("Access Forbidden")
  }
}

/* *************
* unit 5 Account Mangement View 
************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Managment",
    nav,
    errors: null,
  })
}

/* ****************************************
* process logout request
* *************************************** */
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  delete res.locals.accountData;
  res.locals.loggedin = 0;
  req.flash("notice", "Logout successful.")
  res.redirect("/");
  return
}

/* ****************************************
* Deliver account update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.params.account_id)
  const {account_id, account_firstname, account_lastname, account_email} = accountData
    res.render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
}

/* ****************************************
* process account update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;

  const regResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  )

  if(regResult) {
    req.flash("notice", `Congratulations you've updated your account, ${account_firstname}.`)
  
    const accountData = await accountModel.getAccountById(account_id)
    delete accountData.account_password
    res.locals.accountData.account_firstname = accountData.account_firstname
    utilities.updateCookie(accountData, res)

    res.status(201).render("account/account-management", {
      title: "Account Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    req.status(501).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }
}
/* *********************
* process password update
* ********************* */
async function updatePassword(req, res) {
  let nav = await utilities.getNav();

  const { account_id, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "sorry, there was an error processing the password update.")
    res.status(500).render("account/account-update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.updatePassword(account_id, hashedPassword);

  if (regResult) {
    req.flash("notice", `Congratulations, you've updated your password.`)
    res.status(201).render("account/account-management", {
      title: "Account Management",
      errors: null,
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    req.status(501).render("account/account-update", {
      Title: "Update Account",
      nav,
      errors: null,
    })
  }

}

/* *************************
* process send message
* ************************ */
async function sendMessage(req, res) {
  let nav = await utilities.getNav()
  
  const  { 
    message_email, 
    message_message, 
    inv_id
  } = req.body
  const regResult = await accountModel.sendMessage(
    message_email,
    message_message,
    inv_id
  )
  if (regResult) {
    req.flash("notice",`Congratulations, your message has been sent. A representitive will reply via email soon.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the message failed to send. Please try again.")
    res.status(501).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  }
}
  
module.exports = {  buildLogin, buildRegister, buildMessage, buildViewMessages, registerAccount, accountLogin, buildAccountManagement, accountLogout, buildUpdate, updateAccount, updatePassword, sendMessage };