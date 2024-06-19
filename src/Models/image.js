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
  });

  return mongoose.model('Image', imageSchema);
};
