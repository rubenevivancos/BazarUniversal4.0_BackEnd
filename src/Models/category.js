const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = (mongoose) => {
  const categorySchema = new Schema({
    name: {
      type: String
    }
  },{
    collection: 'Category'  // Aquí se especifica que el nombre en la BD Mongo sera exactamente Category
  });

  return mongoose.model('Category', categorySchema);
};
