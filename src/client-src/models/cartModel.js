import Item from './cartItem';
import DataService from '../services/data.service';


export default function CartModel() {
    this.products = []; // all products list
    this.items = []; //cart items list
    this.categories = [];   
}

CartModel.prototype.init = function () {
    return Promise.all([
        DataService.getCategories().then((categories) => {
            this.categories = categories;
            return true;
        }),
        DataService.getProducts().then((products) => {
            this.products = products;            
            return products;
        }).then(()=>{
           return DataService.getCartItems().then((cartItems)=>{
            this.items = this.getSavedCart(cartItems);
            });
        })                        
    ]);
}

CartModel.prototype.addItemCount = function (id) {
    //finding item from cart.    
    let item = this.getItem(id);
    if (!item) {
        //item not present in cart
        //finding product by it's id in product list
        let product = this.findProductById(id);
        if (!product) {
            //item with particular id not present in products list
            alert("Could not find this product!");
            return null;
        }
        else {
            //item created and added to cart
            item = new Item(product.id, product.price, 1, product.name, product.imageURL, product.description, product.stock,
                product.category, product.sku);
            this.items.push(item);
        }
    }
    else {
        // item present in cart
        item.increaseCount();
    }
    return item;
}

CartModel.prototype.getTotalAmount = function () {
    //returns total amount of cart
    return this.items.reduce((sum, item) => {
        return sum + item.getTotalAmount();
    }, 0);
}

CartModel.prototype.getTotalQty = function () {
    //return total number of items quanity present in cart
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
}

CartModel.prototype.removeItemCount = function (id) {
    //finding item in cart
    let item = this.getItem(id);
    if (!item) {
        //item not found in cart
        alert("Can not remove. Item not found in cart!");
        return null;
    }
    else {
        //decreases item count and removes item from cart if  quantiy is 0
        if (item.decreaseCount() == 0) {
            this.removeItem(item.id);
        }
    }
    return item;
}

CartModel.prototype.removeItem = function (id) {
    //finding index of item in items array
    let itemIndex = this.items.findIndex((item) => {
        return item.id == id;
    });

    if (itemIndex >= 0) {
        //removing item from items.
        this.items.splice(itemIndex, 1);
    }
    else {
        alert("Item Not found in Cart. Can't remove");
    }
}

CartModel.prototype.getItem = function (id) {
    return this.items.find((item) => item.id == id);
}

CartModel.prototype.findProductById = function (id) {
    return this.products.find(product => product.id == id);
}

CartModel.prototype.getSavedCart = function (itemsList) {
    let items = []
    if (!itemsList) {
        items = [];
    }
    else {
        items = itemsList.map(item => {
            return new Item(item.id, item.price, item.quantity, item.name, item.imageURL, item.description, item.stock, item.category, item.sku);
        });
    }
    return items;
}
