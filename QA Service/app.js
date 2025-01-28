var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const routerInquietud = require('./routes/inquietud');
const routerRespuesta = require('./routes/respuesta');
var app = express();
app.use(cors({ origin: '*' })); 

app.use(express.json());

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/inquietud', routerInquietud);
app.use('/respuesta', routerRespuesta);

console.log("Ruta de modelos:", path.resolve(__dirname, 'app', 'models'));
let models = require('./app/models');
models.sequelize.sync({ force: false, logging: false }).then(() => {
  console.log("Se ha sincronizado la base de datos");
}).catch(err => {
  console.log(err, 'Hubo un error al sincronizar la base de datos');
});

// Middleware para manejar errores 404
app.use(function(req, res, next) {
  res.status(404).json({
    message: 'No se encontró la ruta solicitada',
    error: 'Not Found',
  });
});

// Middleware para manejar otros errores
app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}, // Solo en modo desarrollo
  });
});

module.exports = app;
