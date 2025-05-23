// needed resources
const express = require('express');
const router = new express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const invValidate = require('../utilities/inventory-validation');
const invCont = require('../controllers/invController');

// route middleware
router.use(["/add-classification", "/add-inventory", "/edit/:inv_id", "/delete/:inv_id", "/update", "/delete/",], utilities.checkLogin)
router.use(["/add-classification", "/add-inventory", "/edit/:inv_id", "/update", "/delete/:inv_id", "/delete/"], utilities.checkAuthorizationManager)

// route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/", utilities.handleErrors(invController.buildInventoryManagement));

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassData,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));
router.post(
  "/add-inventory",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.buildEditInventory)
)
router.post(
  "/update/",
  invValidate.inventoryRules(),
  invValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

router.get(
  "/delete/:inv_id",
  utilities.handleErrors(invController.buildDeleteInventory)
)
router.post(
  "/delete",
  utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;