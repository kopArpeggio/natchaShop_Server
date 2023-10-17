module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "Order",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },

      totalPrice: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slipPicture: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      shippingTrack: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: false,
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

  // Order.associate = (models) => {
  //   Order.hasMany(models.OrderDetail, {
  //     foreignKey: "order_id",
  //     onDelete: "CASCADE",
  //     onUpdate: "CASCADE",
  //   });
  // };
  Order.associate = (models) => {
    Order.hasMany(models.OrderDetail, {
      foreignKey: "order_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    Order.belongsTo(models.Member, {
      foreignKey: "order_by",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };
  return Order;
};
