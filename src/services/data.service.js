export default class DataService {
    constructor() {

    }

    static getProducts() {
        return fetch("/products/index.get.json")
            .then(resp => resp.json());
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