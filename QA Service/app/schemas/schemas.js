const zod = require('zod');

const inquietudSchema = zod.object({
    titulo: zod.string().max(150, "El título no puede exceder 150 caracteres"),
    descripcion: zod.string().max(500).nullable().optional(),
    imagen: zod.string().max(500).nullable().optional(),
    video: zod.string().max(500).nullable().optional(),
    estado: zod.boolean().optional(),
    persona: zod.string().uuid("Debe ser un UUID válido"),
    perfiles: zod.array(zod.string().uuid("Debe ser un UUID válido")).optional()
});


const respuestaSchema = zod.object({
    descripcion: zod.string(),
    imagen: zod.string().nullable().optional(),
    video: zod.string().nullable().optional(),
    estado: zod.boolean().optional(),
    inquietud: zod.string().uuid(),
    persona: zod.string().uuid()
});

module.exports = {
    inquietudSchema,
    respuestaSchema,
};