require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuración de variables de entorno
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_DB_NAME
} = process.env;

// URL de conexión a MongoDB en Desarrollo
//const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

// URL de conexión a MongoDB en Atlas
const mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DB_NAME}`;

// Opciones de configuración de conexión
const mongooseOptions = {};

// Conexión a MongoDB
const mongooseConnection = mongoose.connect(mongoUrl, mongooseOptions)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definición de esquemas y modelos
const modelDefiners = [];

// Leer y cargar todos los archivos de modelos desde la carpeta 'Models'
fs.readdirSync(path.join(__dirname, 'Models'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    try {
      const modelDefiner = require(path.join(__dirname, 'Models', file));
      // Inyectar la conexión de mongoose a cada modelo
      modelDefiners.push(modelDefiner(mongoose));
    } catch (err) {
      console.error(`Error al cargar el archivo ${file}:`, err);
    }
  });

// Capitalizar nombres de modelos (opcional)
const capitalizedModels = modelDefiners.map(modelDefiner => {
  const modelName = modelDefiner.modelName.charAt(0).toUpperCase() + modelDefiner.modelName.slice(1);
  return [modelName, modelDefiner];
});

// Crear objetos con los modelos capitalizados
const models = Object.fromEntries(capitalizedModels);

// Exportar modelos y la conexión de mongoose
module.exports = {
  ...models,  // para poder importar los modelos así: const { Product, Category } = require('./db.js');
  mongooseConnection  // para importar la conexión así: const { mongooseConnection } = require('./db.js');
};
