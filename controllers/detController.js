const detModel = require("../models/detail-model")
const utilities = require("../utilities/")

const detCont = {}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
detCont.buildInventoryDetail = async function (req, res, next) {
  const inv_id = req.params.inventoryId
  const data = await detModel.getInventoryById(inv_id)
  const grid = await utilities.buildIndividualGrid(data)
  let nav = await utilities.getNav()
  const inventoryName = data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model
  res.render("./inventory/detail", {
    title: inventoryName,
    nav,
    grid,
  })
}


module.exports = detCont