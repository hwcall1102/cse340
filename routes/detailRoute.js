// needed resources
const express = require('express');
const router = new express.Router();
const detController = require('../controllers/detController');
const utilities = require('../utilities');

// route to build inventory detail view
router.get("/detail/:inventoryId", utilities.handleErrors(detController.buildInventoryDetail));

module.exports = router;