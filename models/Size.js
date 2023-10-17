module.exports = (sequelize, DataTypes) => {
  const Size = sequelize.define(
    "Size",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      size: {
        type: DataTypes.ENUM("s", "m", "l", "x", "xl", "freeSize"),
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      s: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      m: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      l: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      x: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      xl: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      freeSize: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: false,
      tableName: "size",
    }
  );

  // OrderDetail.associate = (models) => {
  //   OrderDetail.belongsTo(models.Order, {
  //     foreignKey: "order_id",
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  //   OrderDetail.belongsTo(models.Product, {
  //     foreignKey: "product_id",
  //     onUpdate: "CASCADE",
  //     onDelete: "CASCADE",
  //   });
  // };

  Size.associate = (models) => {
    Size.belongsTo(models.Product, {
      foreignKey: "product_id",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Size;
};
