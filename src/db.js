require('dotenv').config();
const { Sequelize } = require('sequelize');
const { CA_CERTIFICATE, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env;
const pg = require('pg'); //ES OBLIGATORIO PARA VERCEL

// Configuración para Sequelize para utilizar el cliente de PostgreSQL de pg: VERCEL NECESITA USAR PG
pg.defaults.ssl = {
    require: true,
    rejectUnauthorized: false, //En true verifica que el certificado sea valido, en produccion debe ser true
    ca: CA_CERTIFICATE
};


const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`, {
  dialect: 'postgres', // Especifica que estamos utilizando PostgreSQL
  dialectModule: pg, // Utiliza el cliente de PostgreSQL de pg: VERCEL NECESITA USAR PG
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  define: {
    freezeTableName: true //El valor true hace que el nombre del modelo sea igual al de la tabla
  }
});


module.exports = {
  conn: sequelize     // para importar la conexión { conn } = require('./db.js');
};
