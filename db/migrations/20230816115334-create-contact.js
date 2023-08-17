"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Contacts", {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      bindIndex: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Contacts");
  },
};
