import DataService from '../services/data.service';

export default class ProductsResolver{
    constructor(){
    }

    resolve(routePath,routeParams){
       return DataService.getProducts(routeParams.id);
    }
}