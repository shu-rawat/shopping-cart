import Item from './cartItem';
import categories from '../../server/categories/index.get.json';
import products from '../../server/products/index.get.json';


export default function CartModel(){
    this.products = products; // all products list
    this.items = []; //cart items list
    this.categories = categories;
    //reads local storage for saved cart items

    this.readStorage();
}

CartModel.prototype.addItemCount = function(id){
    //finding item from cart.    
    let item = this.getItem(id);
    if(!item){
        //item not present in cart
        //finding product by it's id in product list
        let product = this.findProductById(id);
        if(!product){
            //item with particular id not present in products list
            alert("Sorry could not find this product!"); 
            return;          
        }
        else{
            //item created and added to cart
            item = new Item(product.id,product.price,1,product.name,product.imageURL,product.description,product.stock,
                product.category,product.sku);
            this.items.push(item);
        }
    }
    else{
        // item present in cart
        item.increaseCount();    
    }
    this.saveCart();

    return item;
}

CartModel.prototype.getTotalAmount = function(){
    //returns total amount of cart
    return this.items.reduce((sum,item)=>{
        return  sum+item.getTotalAmount();
    },0);
}

CartModel.prototype.getTotalQty = function(){
    //return total number of items quanity present in cart
    return this.items.reduce((sum,item)=>sum+item.quantity,0);
}

CartModel.prototype.removeItemCount = function(id){
    //finding item in cart
    let item = this.getItem(id);
    if(!item){
        //item not found in cart
        alert("Can not remove. Item not found in cart!");
        return;
    }
    else{
        //decreases item count and removes item from cart if  quantiy is 0
        if(item.decreaseCount() == 0){
            this.removeItem(item.id);
        }
    }
    this.saveCart();
    return item;
}

CartModel.prototype.removeItem = function(id){
    //finding index of item in items array
    let itemIndex = this.items.findIndex((item)=>{
        return item.id == id;
    });
    
    if(itemIndex >= 0){
        //removing item from items.
        this.items.splice(itemIndex,1);
    }
    else{
        alert("Item Not found in Cart. Can't remove");
    }
}

CartModel.prototype.getItem = function(id){
    return this.items.find((item)=>item.id == id);
}

CartModel.prototype.findProductById = function(id){
    return this.products.find(product=>product.id==id);
}

CartModel.prototype.saveCart = function(){
    localStorage.setItem("items",JSON.stringify(this.items));
}

CartModel.prototype.getSavedCart = function(){
    let itemsString = localStorage.getItem("items");
    let itemsObject  = JSON.parse(itemsString);
    let items = []
    if(!itemsObject){
        items = [];
    }   
    else{
        items = itemsObject.map(item=>{
            return new Item(item.id,item.price,item.quantity,item.name,item.imageURL,item.description,item.stock,item.category,item.sku);
        });
    }
    return items;
}

CartModel.prototype.readStorage = function(){
    this.items = this.getSavedCart();
}
