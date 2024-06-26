const mongoose = require('mongoose');
const Schema = mongoose.Schema;


module.exports = (mongoose) => {
  const productSchema = new Schema({
    _id: Number,
    title: {
      type: String
    },
    description: {
      type: String
    },
    price: {
      type: Number
    },
    discountPercentage: {
      type: Number
    },
    rating: {
      type: Number
    },
    stock: {
      type: Number
    },
    brand: {
      type: String
    },
    thumbnail: {
      type: String
    },
    category_id: {
      type: Number,
      ref: 'Category'
    }
  },{
    collection: 'Product'  // Aquí se especifica que el nombre en la BD Mongo sera exactamente Product
  }
  );

  return mongoose.model('Product', productSchema);
};
