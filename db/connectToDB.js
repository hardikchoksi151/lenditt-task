require("dotenv").config();
const { encryptNumber } = require("../utils/encUtils");
const { sequelize } = require("./models");

const connect = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log("Connection to DB has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connect;
