"use strict";

module.exports = (sequelize, DataTypes) => {
  const persona = sequelize.define(
    "persona",
    {
      nombres: { type: DataTypes.STRING(150), allowNull: false },
      apellidos: { type: DataTypes.STRING(150), allowNull: false },
      direccion: { type: DataTypes.STRING(300), allowNull: true },
      cedula: { type: DataTypes.STRING(15), allowNull: false },
      monedas: { type: DataTypes.DOUBLE, defaultValue: 0 },
      descripcion: { type: DataTypes.STRING(500), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  persona.associate = function (models) {
    persona.hasOne(models.cuenta, {
      foreignKey: "id_persona",
      as: "cuenta",
    });
    persona.belongsTo(models.rol, {
      foreignKey: "id_rol",
    });
  };

  return persona;
};