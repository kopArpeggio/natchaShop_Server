module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      orderBy: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      totalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slipPicture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: "order",
    }
  );

  //   Order.associate = (models) => {
  //     Order.hasOne(models.OrderDetial, {
  //       foreignKey: "order_id",
  //       onUpdate: "cascade",
  //       onDelete: "cascade",
  //     });
  //   };

  Order.associate = (models) => {
    Order.hasMany(models.OrderDetail, {
      foreignKey: "order_id", // foreign key in OrderDetail that associates it with Order
      onDelete: "CASCADE", // or any other action on delete
      onUpdate: "CASCADE", // or any other action on update
    });
    Order.belongsTo(models.Member, {
      foreignKey: "orderBy",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Order;
};
