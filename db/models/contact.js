"use strict";
const { Model } = require("sequelize");
const { decryptNumber, encryptNumber, generateBlindIndex } = require("../../utils/encUtils");

module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: {
          name: "user_id",
          allowNull: false,
          type: DataTypes.INTEGER,
        },
      });
    }
  }
  Contact.init(
    {
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,

        set(value) {
          this.setDataValue("number", encryptNumber(value));
          this.setDataValue("bindIndex", generateBlindIndex(value));
        },

        get() {
          const encryptedNumber = this.getDataValue("number");
          return decryptNumber(encryptedNumber);
        },
      },
      bindIndex: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "User",
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "Contact",
    }
  );
  return Contact;
};
