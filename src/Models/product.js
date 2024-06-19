const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (mongoose) => {
  const productSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      required: true
    },
    discountPercentage: {
      type: Number,
      required: true
    },
    rating: {
      type: Number,
      required: true
    },
    stock: {
      type: Number,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }
  });

  return mongoose.model('Product', productSchema);
};
