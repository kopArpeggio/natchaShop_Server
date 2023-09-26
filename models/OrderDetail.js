module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "OrderDetail",
    {
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
      paranoid: true,
      tableName: "orderDetail",
    }
  );

  OrderDetail.associate = (models) => {
    OrderDetail.belongsTo(models.Order, {
      foreignKey: "order_id",
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
    OrderDetail.belongsTo(models.Product, {
      foreignKey: "product_id",
      onUpdate: "RESTRICT",
      onDelete: "RESTRICT",
    });
  };

  return OrderDetail;
};
