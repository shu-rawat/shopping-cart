let products = [];
let categories = [];
let banners = [];

export default class DataService {
    constructor() {

    }

    static getProducts() {
        if(products.length){
            return Promise.resolve(products);
        };

        return fetch("/products")
            .then(resp => resp.json())
            .then(_products=>{
                products = _products;
                return products;
            });
    }

    static getCategories() {
        if(categories.length){
            return Promise.resolve(categories);
        }

        return fetch("/categories")
            .then(resp => resp.json())
            .then(_categories=>{
                categories = _categories;
                return categories;
            });
    }

    static getCartItems(){
        return fetch("/cartItems")
        .then(resp => resp.json());
    }

    static getBanners(){
        if(banners.length){
            return Promise.resolve(banners);
        }

        return fetch("/banners")
        .then(resp => resp.json())
        .then(_banners=>{
            banners = _banners;
            return banners;
        });
    }

    static postAddToCart(productId){
        let data = {productId, decreaseCount:false};

        return fetch("/addToCart",{method: 'POST', headers: {
            'Content-Type': 'application/json'},body:JSON.stringify(data)})
        .then(resp=>resp.json());
    }

    static postRemoveFromCart(productId){
        let data = {productId, decreaseCount: true };
        
        return fetch("/addToCart",{method: 'POST', headers: {
            'Content-Type': 'application/json'},body:JSON.stringify(data)})
        .then(resp=>resp.json());
    }
}