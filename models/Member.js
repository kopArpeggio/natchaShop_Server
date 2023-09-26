module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    "Member",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("member", "admin"),
        defaultValue: "member",
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profilePic: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      tableName: "member",
    }
  );

  Member.associate = (models) => {
    Member.hasMany(models.Order, {
      foreignKey: "orderBy",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Member;
};
