const mongoose =  require('mongoose');

const cartItemSchema = new mongoose.Schema({
  name: String,
  imageURL: String,
  description: String,
  price: Number,
  quantity:{type: Number, default: 0},
  stock: Number,
  category: String,
  sku: String,
  id:{
    type: String,
    unique: true
  }
});

const CartItem = mongoose.model('CartItem', cartItemSchema );

module.exports =  CartItem;