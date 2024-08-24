"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "vendor",
        as: "ven",
      });

      this.belongsTo(models.User, {
        foreignKey: "customer",
        as: "cust",
      });

      this.belongsTo(models.Material, {
        foreignKey: "material",
        as: "mat",
      });
    }
  }
  Transaction.init(
    {
      vendor: DataTypes.INTEGER,
      customer: DataTypes.INTEGER,
      material: DataTypes.STRING,
      transaction_date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
