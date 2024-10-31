require("dotenv").config({});

const { DB_HOST, DB_USER, DB_PASS, DB_DATABASE } = process.env;

const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
});

module.exports = sequelize;
