const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get inventory details
 * ************************** */
async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * from public.inventory
      WHERE inv_id = $1`,
      [inv_id]
    )
    console.log(data.rows)
    return data.rows
  } catch (error) {
    console.error("getInventoryByid error " + error)
  }
}

module.exports = {getInventoryById, getClassifications}