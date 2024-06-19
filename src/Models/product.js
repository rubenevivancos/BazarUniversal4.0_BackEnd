const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (mongoose) => {
  const productSchema = new Schema({
    name: {
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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    images: [{
      type: Schema.Types.ObjectId,
      ref: 'Image'
    }]
  });

  return mongoose.model('Product', productSchema);
};
