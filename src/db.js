require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Configuración de variables de entorno
const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB_NAME
} = process.env;

// URL de conexión a MongoDB
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB_NAME}`;

// Opciones de configuración de conexión
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
};

// Conexión a MongoDB
mongoose.connect(mongoUrl, mongooseOptions)
  .then(() => console.log('Conexión exitosa a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Definición de esquemas y modelos
const modelDefiners = [];

// Leer y cargar todos los archivos de modelos desde la carpeta 'Models'
fs.readdirSync(path.join(__dirname, 'Models'))
  .filter(file => file.endsWith('.js'))
  .forEach(file => {
    const modelDefiner = require(path.join(__dirname, 'Models', file));
    modelDefiners.push(modelDefiner);
  });

// Inyectar la conexión de mongoose a todos los modelos
modelDefiners.forEach(modelDefiner => modelDefiner(mongoose));

// Capitalizar nombres de modelos (opcional)
const capitalizedModels = modelDefiners.map(modelDefiner => {
  const modelName = modelDefiner.modelName.charAt(0).toUpperCase() + modelDefiner.modelName.slice(1);
  return [modelName, mongoose.model(modelDefiner.modelName)];
});

// Crear objetos con los modelos capitalizados
const models = Object.fromEntries(capitalizedModels);

// Definir relaciones entre modelos (ejemplo hipotético)
// Aquí debes definir las relaciones según la lógica de tu aplicación y el esquema de tu base de datos MongoDB

// Ejemplo de relaciones hipotéticas entre modelos
// models.Product.hasMany(models.Image);
// models.Product.belongsTo(models.Category);

// Exportar modelos y la conexión de mongoose
module.exports = {
  ...models,
  mongooseConnection: mongoose.connection
};
