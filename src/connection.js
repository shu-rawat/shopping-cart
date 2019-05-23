const mongoose = require("mongoose");
const products = require('./data/products/index.get.json');
const Product = require("./entities/product");

const connectDb = () => {
  console.log("inside connect", process.env.DATABASE_URL);
  return mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true }).then(()=>{
    console.log("connecion established");
    return Product.find({});
  })
  .then((data)=>{
    if(!data || !data.length){
      return Product.collection.insert(products, (err, docs)=>{
       console.log("inserted records");
      });
    }
    else{        
      console.log("records already present");
      return true;
    }
  })
};

module.exports = connectDb;