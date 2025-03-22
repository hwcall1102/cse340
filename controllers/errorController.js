// errorController.js

const errorController = {};

// This controller is used to intentionally throw an error
errorController.triggerError = async function (req, res, next) {
    // Throwing an intentional error to trigger the middleware
    const error = new Error('Intentional 500 error');
    error.status = 500; // Setting the status to 500
    next(error); // Passing the error to the next middleware (which will handle it)
};

module.exports = errorController

