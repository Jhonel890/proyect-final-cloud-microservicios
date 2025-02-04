module.exports = (sequelize, DataTypes) => {
  const CuentaInquietud = sequelize.define(
    "cuenta_inquietud",
    {
      id_cuenta: {
        type: DataTypes.UUID,
        allowNull: false,
        onDelete: "CASCADE",
      },
      id_inquietudes: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: [],
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return CuentaInquietud;
};
