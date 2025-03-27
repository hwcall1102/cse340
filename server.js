/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const detailRoute = require("./routes/detailRoute")
const utilities = require("./utilities/index")
const errorRoute = require("./routes/errorRoute")
const session = require("express-session")
const pool = require("./database/")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")

/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})
// unit 4, process registration
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true})) // for parsing applicatino/ x-www-form-urlencoded


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", utilities.handleErrors(inventoryRoute))
// Detail routes
app.use("/det", utilities.handleErrors(detailRoute))
// Account routes
app.use("/account", utilities.handleErrors(accountRoute))
// 500 error 
app.use("/trigger-error", errorRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


/* 500 error trigger middleware */

module.exports = (err, req, res, next) => {
  if (err.status === 500) {
    // Log the error (you can log to a file or a service in real applications)
    console.error('Internal Server Error:', err.message);

    // Redirect to error view with the error message
    res.status(500).render('error', { error: err.message });
  } else {
    // Pass the error to the default Express error handler if it's not a 500 error
    next(err);
  }
};

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})