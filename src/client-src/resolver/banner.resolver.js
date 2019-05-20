import DataService from '../services/data.service';

export default class BannerResolver{
    constructor(){
    }

    resolve(){
       return DataService.getBanners();
    }
}