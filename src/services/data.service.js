export default class DataService {
    constructor() {

    }

    static getProducts(categId) {
        return fetch("/products/index.get.json")
            .then(resp => resp.json())
            .then(products => {
                if (!categId) {
                    return products;
                }
                else {
                    return products.filter(product => product.category == categId);
                }
            });
    }

    static getCategories() {
        return fetch("/categories/index.get.json")
            .then(resp => resp.json()).then(categ=>{
                return categ;
            });
    }

    static getBanners(){
        return fetch("/banners/index.get.json")
        .then(resp => resp.json()).then(banners=>{
            return banners;
        });
    }
}