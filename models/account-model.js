const pool = require("../database/")

async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
        const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    } catch (error) {
        return error.message
    }
}
/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email, exludedEmail = null){
    try {
        if (exludedEmal) {
            const sql = "SELECT * FROM account WHERE account_email = $1 AND account_email != $2"
            const email = await pool.query(sql, [account_email, exludedEmail])
            return email.rowCount
        } else {
            const sql = "SELECT * FROM account WHERE account_email = $1"
            const email = await pool.query(sql, [account_email])
            return email.rowCount
        }
    } catch (error) {
      return error.message
    }
}

/* **********************
* return account data using email address
* unit 5 Login activity 
************************ */
async function getAccountByEmail (account_email) {
    try {
        const result = await pool.query(
            'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
            [account_email])
        return result.rows[0]
    } catch (error) {
        return new Error("No matching email found")
    }
}

/* **********************
* get account by account_id
* ********************* */
async function getAccountById(account_id) {
    try {
        const result = await pool.query(
            "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1", [account_id]
        )
        return result.rows[0];
    } catch (error) {
        return new Error("No matching account found with ID.")
    }
}

async function updateAccount(account_id, account_firstname, account_lastname, account_email) {
    try {
        const sql = "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4"
        const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
        return result
    } catch (error) {
        return new Error("Update failed")
    }
}

async function updatePassword(account_id, hashed_password) {
    try {
        const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2"
        const result = await pool.query(sql, [hashed_password, account_id])
        return result
    } catch (error) {
        return new Error("Password update failed.")
    }
}
module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccount, updatePassword };