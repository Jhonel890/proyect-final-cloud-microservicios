'use strict';

const { persona, cuenta, rol, sequelize, perfil } = require('../models');
const { personaSchema, completarPerfil } = require('../schemas/schemas');
const uuid = require('uuid');
const axios = require('axios');
class PersonaControl {

    async obtener(req, res) {
        const external = req.params.external;

        try {
            const lista = await persona.findOne({
                where: { external_id: external },
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['correo'] },
                    { model: rol, as: 'rol', attributes: ['nombre'] }
                ]
            });

            if (!lista) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async obtenerPorID(req, res) {
        const id = req.params.id;

        try {
            const lista = await persona.findOne({
                where: { id: id },
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['correo'] },
                    { model: rol, as: 'rol', attributes: ['nombre'] }
                ]
            });

            if (!lista) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async listar(req, res) {
        try {
            const lista = await persona.findAll({
                include: [
                    { model: cuenta, as: 'cuenta', attributes: ['correo'] },
                    { model: rol, as: 'rol', attributes: ['nombre'] }
                ]
            });

            res.status(200);
            res.json({ message: "Éxito", code: 200, data: lista });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async guardar(req, res) {
        const safeBody = personaSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });

        } else {
            try {
                let rolA = await rol.findOne({ where: { nombre: "user" } });

                if (!rolA) {
                    rolA = await rol.create({ nombre: "user" });
                }

                const cuentaA = await cuenta.findOne({ where: { correo: req.body.cuenta.correo } });

                if (cuentaA) {
                    res.status(400);
                    return res.json({ message: "Error de solicitud", tag: "Correo ya existente", code: 400 });
                }

                const data = {
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    cedula: req.body.cedula,
                    direccion: req.body.direccion,
                    external_id: uuid.v4(),
                    id_rol: rolA.id,
                    cuenta: {
                        correo: req.body.cuenta.correo,
                        clave: req.body.cuenta.clave,
                    },
                };

                const transaction = await sequelize.transaction();

                try {
                    const result = await persona.create(data, { include: [{ model: cuenta, as: "cuenta" }], transaction });

                    await transaction.commit();

                    if (!result) {
                        res.status(401);
                        return res.json({ message: "Error de autenticación", tag: "No se puede crear", code: 401 });
                    }

                    res.status(200);
                    res.json({ message: "Éxito", code: 200 });
                } catch (error) {
                    await transaction.rollback();
                    res.status(203);
                    res.json({ message: "Error de procesamiento", code: 203, error: error.message });
                }
            } catch (error) {
                res.status(500);
                res.json({ message: "Error interno del servidor", code: 500, error: error.message });
            }
        }
    }

    async modificar(req, res) {
        const safeBody = personaSchema.safeParse(req.body);

        if (safeBody.error) {
            res.status(400);
            return res.json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
        } else {
            try {

                const rolA = await rol.findOne({ where: { nombre: "user" } });

                if (!rolA) {
                    const rolA = await rol.create({ nombre: "user" });
                }

                const cuentaA = await cuenta.findOne({ where: { correo: req.body.cuenta.correo } });

                if (cuentaA) {
                    res.status(400);
                    return res.json({ message: "Error de solicitud", tag: "Correo ya existente", code: 400 });
                }

                const transaction = await sequelize.transaction();

                try {

                    const updatedPersona = await persona.update(
                        {
                            nombres: req.body.nombres,
                            apellidos: req.body.apellidos,
                            cedula: req.body.cedula,
                            direccion: req.body.direccion,
                            id_rol: rolA.id,
                        },
                        { where: { external_id: req.params.external }, transaction }
                    );

                    if (!updatedPersona[0]) {
                        await transaction.rollback();
                        res.status(401);
                        return res.json({ message: "Error de autenticación", tag: "No se puede modificar", code: 401 });
                    }

                    const cuentaAsociada = await cuenta.findOne({
                        where: { id_persona: updatedPersona[0] },
                        transaction,
                    });

                    if (cuentaAsociada) {
                        await cuentaAsociada.update(
                            {
                                correo: req.body.cuenta.correo,
                                clave: req.body.cuenta.clave,
                            },
                            { transaction }
                        );
                    }

                    await transaction.commit();

                    res.status(200);
                    res.json({ message: "Éxito", code: 200 });
                } catch (error) {
                    await transaction.rollback();
                    res.status(203);
                    res.json({ message: "Error de procesamiento", code: 203, error: error.message });
                }
            } catch (error) {
                res.status(500);
                res.json({ message: "Error interno del servidor", code: 500, error: error.message });
            }
        }
    }

    async cambiarPerfiles(req, res) {
        const external = req.params.external;
        const perfilesUUID = req.body.perfiles;
    
        try {
            const personaA = await persona.findOne({ where: { external_id: external } });
            if (!personaA) {
                return res.status(404).json({ message: "Recurso no encontrado", code: 404 });
            }
    
            console.log("Persona encontrada:", personaA);
    
            console.log("UUIDs de perfil recibidos:", perfilesUUID);
    
            if (!Array.isArray(perfilesUUID) || perfilesUUID.length === 0) {
                return res.status(400).json({ message: "UUIDs de perfil no válidos", code: 400 });
            }
    
            const requests = perfilesUUID.map(uuid =>
                axios.post('http://localhost:3000/qa/perfil/asignarPerfil', {
                    id_persona: personaA.id,
                    perfil_uuid: uuid
                }).catch(error => {
                    console.error(`Error al asignar perfil UUID ${uuid}:`, error.message);
                    throw error; // Lanza el error para que Promise.all lo capture
                })
            );
    
            console.log("Requests a enviar:", requests);
    
            await Promise.all(requests);
            res.status(200).json({ message: "Éxito", code: 200 });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
            console.log(error.message);
        }
    }

    async isPerfilCompleto(req, res) {
        const external = req.params.external;
        try {
            const personaA = await persona.findOne({ where: { external_id: external } });
            if (!personaA) {
                return res.status(404).json({ message: "Recurso no encontrado", code: 404 });
            }

            const response = await axios.get(`http://localhost:3000/qa/perfil/misPerfiles/${external}`);
            const status = response.data.data.length > 0;
            res.status(200).json({ message: status ? "Perfil completo" : "Perfil incompleto", status, code: 200 });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
            console.log(error.message);
        }
    }

    async completarPerfil(req, res) {
        const external = req.params.external;
        const safeBody = completarPerfil.safeParse(req.body);

        if (safeBody.error) {
            return res.status(400).json({ message: safeBody.error, tag: "Datos incorrectos", code: 400 });
        }

        try {
            const personaA = await persona.findOne({ where: { external_id: external } });
            if (!personaA) {
                return res.status(404).json({ message: "Recurso no encontrado", code: 404 });
            }

            console.log("Persona encontrada:", personaA);

            const perfilUUIDs = safeBody.data.tipo_perfil;
            console.log("UUIDs de perfil recibidos:", perfilUUIDs);

            if (!Array.isArray(perfilUUIDs) || perfilUUIDs.length === 0) {
                return res.status(400).json({ message: "UUIDs de perfil no válidos", code: 400 });
            }

            const requests = perfilUUIDs.map(uuid =>
                axios.post('http://localhost:3000/qa/perfil/asignarPerfil', {
                    id_persona: personaA.id,
                    perfil_uuid: uuid
                }).catch(error => {
                    console.error(`Error al asignar perfil UUID ${uuid}:`, error.message);
                    throw error; // Lanza el error para que Promise.all lo capture
                })
            );

            console.log("Requests a enviar:", requests);

            await Promise.all(requests);
            await personaA.update({ descripcion: safeBody.data.descripcion });

            res.status(200).json({ message: "Éxito", code: 200 });
        } catch (error) {
            res.status(500).json({ message: "Error interno del servidor", code: 500, error: error.message });
            console.log(error.message);
        }
    }
    
    async misCoins(req, res) {
        const external = req.params.external;

        try {
            const personaA = await persona.findOne({
                where: { external_id: external },
                attributes: ['monedas'],
            });

            if (!personaA) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200, monedas: personaA.monedas });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

    async subir5Coins(req, res) {
        const external = req.params.external;

        try {
            const personaA = await persona.findOne({
                where: { external_id: external },
                attributes: ['monedas'],
            });

            if (!personaA) {
                res.status(404);
                return res.json({ message: "Recurso no encontrado", code: 404, data: {} });
            }

            const updatedPersona = await persona.update(
                { monedas: personaA.monedas + 5 },
                { where: { external_id: external } }
            );

            if (!updatedPersona[0]) {
                res.status(401);
                return res.json({ message: "Error de autenticación", tag: "No se puede modificar", code: 401 });
            }

            res.status(200);
            res.json({ message: "Éxito", code: 200 });
        } catch (error) {
            res.status(500);
            res.json({ message: "Error interno del servidor", code: 500, error: error.message });
        }
    }

}

module.exports = PersonaControl;