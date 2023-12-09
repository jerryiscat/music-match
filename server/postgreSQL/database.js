const { Pool } = require('pg');
require('dotenv').config()

const database = process.env.DATABASE
const password = process.env.PASSWORD 
const user = process.env.DATABASE_USER
const port = 5432
const host = process.env.HOST

const pool = new Pool({
  user: user,
  password: password,
  host: host,
  port: port,
  database: database
});


module.exports = {
  query: async (text, params) => {
    const { rows } = await pool.query(text, params)
    return rows;
  }
};