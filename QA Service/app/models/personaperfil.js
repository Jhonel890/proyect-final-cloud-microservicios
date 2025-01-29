"use strict";

module.exports = (sequelize, DataTypes) => {
  const PersonaPerfil = sequelize.define(
    "persona_perfil",
    {
      id_persona: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onDelete: "CASCADE",
      },
      id_perfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "perfil",
          key: "id",
        },
        onDelete: "CASCADE",
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  return PersonaPerfil;
};
