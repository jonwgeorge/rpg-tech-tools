var uuid = require("uuid");
var moment = require("moment");
var database = require("../db/connection");
var helper = require("../models/Helpers");

const User = {
  /**
   * Create a User
   * @param {object} req
   * @param {string} hash
   * @param {object} res
   * @returns {object} user object
   */
  async create(req, res) {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send({"message": "Some values are missing"});
    }
    if (!helper.isValidEmail(req.body.email)) {
      return res.status(400).send({"message": "Please enter a valid email address"});
    }
    const hashPassword = helper.hashPassword(req.body.password);

    const text = `INSERT INTO
      users(id, email, username, password, created_at, modified_at)
      VALUES($1, $2, $3, $4, $5, $6)
      returning *`;
    const values = [
      uuid(),
      req.body.email,
      req.body.username,
      hashPassword,
      moment(new Date()),
      moment(new Date())
    ];

    try {
      console.log("Trying query...");
      const { rows } = await database.query(text, values);
      return res.status(201).send(rows[0]);
    } catch (error) {
      if (error.routine === "_bt_check_unique") {
        return res.status(400).send({"message": "User with that email already exist"});
      }
      return;
    }
  }
}

module.exports = User;