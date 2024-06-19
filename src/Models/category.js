const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = (mongoose) => {
  const categorySchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  });

  return mongoose.model('Category', categorySchema);
};
