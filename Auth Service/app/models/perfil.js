"use strict";

module.exports = (sequelize, DataTypes) => {
  const Perfil = sequelize.define(
    "perfil",
    {
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      external_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      id_inquietud: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Perfil.associate = function (models) {
    Perfil.belongsToMany(models.persona, {
      through: "persona_perfil",
      foreignKey: "id_perfil",
      as: "personas",
    });

    // La relación con inquietud se manejará a través de llamadas a un API externo
  };

  return Perfil;
};