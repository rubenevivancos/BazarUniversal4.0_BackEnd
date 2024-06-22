const mongoose = require('mongoose');
const Schema = mongoose.Schema;



module.exports = (mongoose) => {
  const imageSchema = new Schema({
    url: {
      type: String,
      required: true
    },
    product_id: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  },{
    collection: 'Image'  // Aquí se especifica que el nombre en la BD Mongo sera exactamente Image
  }
  );

  return mongoose.model('Image', imageSchema);
};