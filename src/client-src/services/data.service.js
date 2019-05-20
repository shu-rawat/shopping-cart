export default class DataService {
    constructor() {

    }

    static getProducts() {
        return fetch("/products")
            .then(resp => resp.json());
    }

    static getCategories() {
        return fetch("/categories")
            .then(resp => resp.json());
    }

    static getBanners(){
        return fetch("/banners")
        .then(resp => resp.json());
    }

    static postAddToCart(productId){
        let data = {productId};
        return fetch("/addToCart",{method: 'POST',body:JSON.stringify(data)})
        .then(resp=>resp.json());
    }
}