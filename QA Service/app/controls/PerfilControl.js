'use strict';

const { perfil, persona_perfil } = require('../models');
const { perfilSchema } = require('../schemas/schemas');
const uuid = require('uuid');
const { default: axios } = require('axios');
require('dotenv').config();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

class PerfilControl {
    async listar(req, res) {
        try {
            const lista = await perfil.findAll({
                attributes: ['nombre', 'external_id']});
            res.status(200).json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtener(req, res) {
        try {
            const result = await perfil.findOne({
                where: {
                    external_id: req.params.external
                },
                attributes: ['nombre', 'external_id']
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

    async obtenerPerfilesPorPersona(req, res) {
        try {
            const external_id = req.params.external_id;
            const persona = await axios.get(AUTH_SERVICE_URL+`/persona/${external_id}`);
            
            if (persona.status !== 200) {
                res.status(404).json({ message: "ERROR", tag: "Persona no encontrada", code: 404 });
            }

            const persona_perfile = await persona_perfil.findAll({
                where: {
                    id_persona: persona.data.data.id
                },
            });

            const perfiles = await perfil.findAll({
                where: {
                    id: persona_perfile.map(pp => pp.id_perfil)
                },
                attributes: ['nombre', 'external_id']
            });

            res.status(200).json({ message: "EXITO", code: 200, data: perfiles || [] });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
            console.log("Error detallado:", error.message);
        }
    }

    
    
    async añadirPerfilesAPersona(req, res) {
        try {
            console.log("Cuerpo de la solicitud:", req.body);
            const { id_persona, perfil_uuid } = req.body; 
    
            if (!perfil_uuid) {
                throw new Error("El campo 'perfil_uuid' es obligatorio.");
            }
    
            // Verificar si la persona existe
            const personaExiste = await axios.get(AUTH_SERVICE_URL+`/persona/getbyID/${id_persona}`);
            if (personaExiste.status !== 200) {
                throw new Error(`Persona con UUID ${id_persona} no encontrada`);
            }
    
            console.log("Perfil UUID recibido:", perfil_uuid);
    
            // Verificar si el perfil existe
            const perfilExiste = await perfil.findOne({ where: { external_id: perfil_uuid } });
            if (!perfilExiste) {
                throw new Error(`Perfil con UUID ${perfil_uuid} no encontrado`);
            }
    
            console.log(`Asignando perfil ID: ${perfilExiste.id} a persona ID: ${id_persona}`);
    
            // Eliminar los perfiles anteriores relacionados con la id_persona
            await persona_perfil.destroy({
                where: {
                    id_persona: id_persona
                }
            });
    
            // Asignar el nuevo perfil a la persona
            await persona_perfil.create({ id_persona, id_perfil: perfilExiste.id });
            
            res.status(201).json({ message: "Perfil asignado exitosamente", code: 201 });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
            console.log("Error detallado:", error);
        }
    }
    

    async guardar(req, res) {
        const safeBody = perfilSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            
        } else {
            const data = { ...safeBody.data };

            data.external_id = uuid.v4();

            await perfil.create(data);
            res.status(201).json({ message: "EXITO", code: 201 });
        }
    }

    async modificar(req, res) {
        const safeBody = perfilSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
            
        } else {
            const data = { ...safeBody.data };

            await perfil.update(data, {
                where: {
                    external_id: req.params.external
                }
            });
            res.status(200).json({ message: "EXITO", code: 200 });
        }
    }

}

module.exports = PerfilControl;