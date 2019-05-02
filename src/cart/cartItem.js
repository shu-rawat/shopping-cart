export default function Item(id,price,quantity=0){
    this.id = id;   // item unique id
    this.price = price;    // individual item  price
    this.quantity = quantity;  // item quantity
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
    return price*quantity;
}

