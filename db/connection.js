const { Pool } = require("PG");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

module.exports = {
  /**
   * DB Query
   * @param {object} req
   * @param {object} res
   * @returns {object} object
   */
  query(text, params){
    return new Promise((resolve, reject) => {
      console.log(text);
      console.log(params);
      pool.query(text, params)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        })
    })
  }
};