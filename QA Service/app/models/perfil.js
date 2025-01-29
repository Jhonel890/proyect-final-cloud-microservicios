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
      }
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Perfil.associate = function (models) {
    Perfil.hasMany(models.persona_perfil, {
      foreignKey: "id_perfil",
      as: "personaPerfiles",
    });

    Perfil.belongsToMany(models.inquietud, {
      through: "inquietud_perfil",
      foreignKey: "id_perfil",
      as: "inquietudes",
    });
  };

  return Perfil;
};
