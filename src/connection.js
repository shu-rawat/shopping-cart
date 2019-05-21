const mongoose = require("mongoose");
const products = require('./data/products/index.get.json');
const Product = require("./entities/product");

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true }).then(()=>{
    console.log("inseid")
    return Product.find({}).then((data)=>{
      if(!data.length){
        Product.collection.insert(products, (err, docs)=>{
         console.log("inserted records");
        });
      }
      else{
        console.log("records already present");
      }
    });
  },(err)=>{
    console.log(err);
  });
};

module.exports = connectDb;