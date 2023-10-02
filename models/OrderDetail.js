module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "OrderDetail",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      quantity: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: false,
      tableName: "orderDetail",
    }
  );

  OrderDetail.associate = (models) => {
    OrderDetail.belongsTo(models.Order, {
      foreignKey: "order_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
    OrderDetail.belongsTo(models.Product, {
      foreignKey: "product_id",
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  };

  return OrderDetail;
};
