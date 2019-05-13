import DataService from '../services/data.service';

export default class CategoryResolver{
    constructor(){
    }

    resolve(){
       return DataService.getCategories();
    }
}