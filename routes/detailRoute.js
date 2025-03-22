// needed resources
const express = require('express');
const router = new express.Router();
const detController = require('../controllers/detController');

// route to build inventory detail view
router.get("/detail/:inventoryId", detController.buildInventoryDetail);

module.exports = router;