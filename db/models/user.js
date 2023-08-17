"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    
    static associate(models) {
      
      this.hasMany(models.Contact, {
        foreignKey: {
          name: "user_id",
          allowNull: false,
          type: DataTypes.INTEGER,
        },
      });
    }
  }
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: "User",
    }
  );
  return User;
};
