const mongoose =  require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  description: String,
  price: Number,
  stock: Number,
  category: String,
  sku: String,
  id:{
    type: String,
    unique: true
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports =  Product;