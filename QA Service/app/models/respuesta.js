"use strict";

module.exports = (sequelize, DataTypes) => {
  const Respuesta = sequelize.define(
    "respuesta",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  
        allowNull: false,
      },      
      descripcion: { type: DataTypes.STRING(500), allowNull: false },
      imagen: { type: DataTypes.STRING(500), allowNull: true },
      video: { type: DataTypes.STRING(500), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      external_persona: { type: DataTypes.UUID, allowNull: false },
      id_inquietud: { type: DataTypes.UUID, allowNull: false },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Respuesta.associate = function (models) {
    Respuesta.belongsTo(models.inquietud, {
      foreignKey: "id_inquietud",
      targetKey: "external_id",
      as: "inquietud",
    });
  };

  return Respuesta;
};