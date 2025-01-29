module.exports = (sequelize, DataTypes) => {
  const Inquietud = sequelize.define(
    "inquietud",
    {
      titulo: { type: DataTypes.STRING(150), allowNull: false },
      descripcion: { type: DataTypes.STRING(500), allowNull: true },
      imagen: { type: DataTypes.STRING(500), allowNull: true },
      video: { type: DataTypes.STRING(500), allowNull: true },
      external_id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
      estado: { type: DataTypes.BOOLEAN, defaultValue: true },
      id_persona : { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  Inquietud.associate = function (models) {
    Inquietud.hasMany(models.respuesta, {
      foreignKey: "id_inquietud",
      as: "respuestas",
    });
    
    Inquietud.belongsToMany(models.perfil, {
      through: "inquietud_perfil",
      foreignKey: "id_inquietud",
      as: "perfiles",
    });
  };

  return Inquietud;
};
