'use strict';

const { Model, where } = require('sequelize');
const { inquietud, respuesta, sequelize } = require('../models');
const { inquietudSchema } = require('../schemas/schemas');
const uuid = require('uuid');


class InquietudControl {
    //obtener perfiles asociado a mi perfil guardado en inquietud desde mi otro microsrvicio
    async obtenerPerfilPersona(external_id) {
        try {
            console.log("External ID Persona:", external_id);
            const response = await fetch(`http://localhost:3007/persona/${external_id}`);
            //console.log("Respuesta completa:", response);
    
            if (!response.ok) {
                console.error("Error al obtener la persona, estado:", response.status);
                return null;
            }
    
            const body = await response.json();
            //console.log("Cuerpo de la respuesta:", body);
    
            // Corrige la extracción de datos
            return body && body.data ? body.data : null;
            console.log("Persona encontrada:", personaA);
        } catch (error) {
            console.error("Error al procesar la respuesta:", error);
            return null;
        }
    }

    async listar(req, res) {
        try {
            const lista = await inquietud.findAll({
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id','id_external_persona','external_id_perfil'],
                include: { model: respuesta, as: 'respuestas', attributes: ['descripcion', 'external_id'] },
            });
    
            // Obtener perfiles para cada inquietud
            const listaConPerfiles = await Promise.all(lista.map(async (inq) => {
                const perfiles = await this.obtenerPerfilPersona(inq.id_external_persona);
                return { ...inq.toJSON(), perfiles };
            }));
    
            res.status(200).json({ message: "Éxito", code: 200, data: listaConPerfiles });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await inquietud.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id'],
                include: { model: respuesta, as: 'respuestas', attributes: ['descripcion', 'external_id'] }
            });
            if (!result) {
                res.status(404).json({ message: "ERROR", tag: "No encontrado", code: 404 });
            } else {
                res.status(200).json({ message: "EXITO", code: 200, data: result });
            }
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        const safeBody = inquietudSchema.safeParse(req.body);
      
        // Validación de datos
        if (safeBody.error) {
          return res.status(400).json({
            message: "Datos inválidos",
            errors: safeBody.error.errors,
            tag: "Validación fallida",
            code: 400,
          });
        }
      
        const transaction = await sequelize.transaction(); // Inicia la transacción
      
        try {
          const data = { ...safeBody.data };
      
          // Obtener persona desde el microservicio externo
          console.log("External ID Persona:", data.external_id_persona);
          const personaA = await this.obtenerPersona(data.external_id_persona);
      
          // Verifica si la persona fue encontrada
          if (!personaA || !personaA.external_id) {
            await transaction.rollback();
            return res.status(404).json({
              message: "Persona no encontrada",
              tag: "ERROR",
              code: 404,
            });
          }
      
          // Asignar ID de persona a la inquietud
          data.id_external_persona = personaA.external_id;  // Asignamos el valor correctamente
      
          console.log("Persona encontrada:", personaA);
      
          // Asignar los perfiles directamente al campo 'external_id_perfil'
          if (req.body.perfiles && Array.isArray(req.body.perfiles) && req.body.perfiles.length > 0) {
            data.external_id_perfil = req.body.perfiles[0]; // Asumimos que el primer perfil es el que se debe asociar
          } else {
            await transaction.rollback();
            return res.status(400).json({
              message: "Perfiles no proporcionados",
              tag: "ERROR",
              code: 400,
            });
          }
      
          // Crear la inquietud en la base de datos
          const nuevaInquietud = await inquietud.create(data, { transaction });
          console.log("Inquietud creada:", nuevaInquietud);
      
          // Confirmar la transacción
          await transaction.commit();
      
          return res.status(200).json({
            message: "Inquietud creada con éxito",
            data: nuevaInquietud,
            code: 200,
          });
        } catch (error) {
          // Revertir la transacción en caso de error
          await transaction.rollback();
          console.error("Error en guardar inquietud:", error);
          return res.status(500).json({
            message: "Error interno del servidor",
            code: 500,
            error: error.message,
          });
        }
      }     
      

    async obtenerPersona(external_id) {
        try {
            const response = await fetch(`http://localhost:3007/persona/${external_id}`);
            //console.log("Respuesta completa:", response);
    
            if (!response.ok) {
                console.error("Error al obtener la persona, estado:", response.status);
                return null;
            }
    
            const body = await response.json();
            //console.log("Cuerpo de la respuesta:", body);
    
            // Corrige la extracción de datos
            return body && body.data ? body.data : null;
        } catch (error) {
            console.error("Error al procesar la respuesta:", error);
            return null;
        }
    }
    
    
    async modificar(req, res) {
        const transaction = await sequelize.transaction(); // Inicia la transacción

        try {
            const safeBody = inquietudSchema.safeParse(req.body);

            if (safeBody.error) {
                return res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            }

            const data = safeBody.data;

            // Buscar la inquietud existente
            const inquietudA = await inquietud.findOne({
                where: { external_id: req.params.external },
            });

            if (!inquietudA) {
                await transaction.rollback();
                return res.status(404).json({ message: "ERROR", tag: "Inquietud no encontrada", code: 404 });
            }

            // Actualizar los datos de la inquietud dentro de la transacción
            await inquietudA.update(data, { transaction });

            // Manejar la asociación de perfiles
            if (req.body.perfiles && Array.isArray(req.body.perfiles)) {
                const perfiles = await perfil.findAll({
                    where: {
                        external_id: req.body.perfiles, // Buscar perfiles por sus UUIDs
                    },
                });

                if (perfiles.length) {
                    await inquietudA.setPerfiles(perfiles, { transaction }); // Actualizar la relación con los perfiles
                }
            }

            await transaction.commit(); // Confirma la transacción
            return res.status(200).json({ message: "EXITO", code: 200 });
        } catch (error) {
            await transaction.rollback(); // Revertir la transacción en caso de error
            return res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }


    async inquietudesSegunPerfil(req, res) {
        try {
            const external_id = req.params.external;
    
            // Buscar la persona por su `external_id`
            const personaA = await persona.findOne({
                where: { external_id },
            });
    
            if (!personaA) {
                return res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }
    
            // Obtener los perfiles asociados a la persona
            const perfiles = await personaA.getPerfiles();
    
            if (!perfiles.length) {
                return res.status(404).json({ message: "ERROR", tag: "La persona no tiene perfiles asociados", code: 404 });
            }
    
            const inquietudes = await inquietud.findAll({
                attributes: ['titulo', 'descripcion', 'imagen', 'video', 'estado', 'external_id'], // Atributos de la inquietud
                include: [
                    {
                        model: perfil,
                        as: 'perfiles',
                        attributes: ['nombre', 'external_id'], // Atributos del perfil
                        where: {
                            external_id: perfiles.map((perfil) => perfil.external_id), // Filtrar por los perfiles asociados
                        },
                    },
                    {
                        model: respuesta,
                        as: 'respuestas',
                        attributes: ['descripcion', 'external_id'], // Atributos de la respuesta
                    },
                ],
                where: {
                    estado: true, // Filtrar inquietudes activas
                },
            });
    
            if (!inquietudes.length) {
                return res.status(404).json({ message: "No hay inquietudes para los perfiles de la persona", code: 404 });
            }
    
            const inquietudesFiltradas = inquietudes.filter((inquietud) =>
                inquietud.perfiles.length === 1 && perfiles.some((perfil) => perfil.external_id === inquietud.perfiles[0].external_id)
            );
    
            return res.status(200).json({ message: "Éxito", code: 200, data: inquietudesFiltradas });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }
    
}

module.exports = InquietudControl;