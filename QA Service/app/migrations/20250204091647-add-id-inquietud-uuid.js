'use strict';

/** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   up: async (queryInterface, Sequelize) => {
//     await queryInterface.addColumn("respuesta", "id_inquietud", {
//       type: Sequelize.UUID,
//       allowNull: false,
//     });

//     await queryInterface.addConstraint("respuesta", {
//       fields: ["id_inquietud"],
//       type: "foreign key",
//       name: "respuesta_inquietud_fk",
//       references: {
//         table: "inquietud",
//         field: "external_id",
//       },
//       onDelete: "CASCADE",
//       onUpdate: "CASCADE",
//     });
//   },

//   down: async (queryInterface, Sequelize) => {
//     await queryInterface.removeConstraint("respuesta", "respuesta_inquietud_fk");
//     await queryInterface.removeColumn("respuesta", "id_inquietud");
//   },
// };

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("respuesta", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      descripcion: { type: Sequelize.STRING(500), allowNull: false },
      imagen: { type: Sequelize.STRING(500), allowNull: true },
      video: { type: Sequelize.STRING(500), allowNull: true },
      external_id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, allowNull: false, unique: true },
      estado: { type: Sequelize.BOOLEAN, defaultValue: true },
      external_persona: { type: Sequelize.UUID, allowNull: false },
      id_inquietud: { type: Sequelize.UUID, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addConstraint("respuesta", {
      fields: ["id_inquietud"],
      type: "foreign key",
      name: "respuesta_inquietud_fk",
      references: {
        table: "inquietud",
        field: "external_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("respuesta");
  },
};
