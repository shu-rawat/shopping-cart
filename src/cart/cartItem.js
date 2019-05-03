export default function Item(id,price,quantity=0,name,imageURL,description,stock,category,sku){
    this.id = id;   // item unique id
    this.price = price;    // individual item  price
    this.quantity = quantity;  // item quantity
    this.name = name;
    this.imageURL = imageURL;
    this.description = description;
    this.stock = stock;
    this.category = category;
    this.sku = sku;
}


//increases item count and returns updated item count
Item.prototype.increaseCount = function(){
    ++this.quantity;
    return this.quantity;
}

//decreases item count and returns updated item count
Item.prototype.decreaseCount = function(){
    --this.quantity;
    return this.quantity;
}


//returns total price of item based on number of item and price
Item.prototype.getTotalAmount = function(){
    return this.price*this.quantity;
}

