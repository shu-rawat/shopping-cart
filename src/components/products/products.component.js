import hbsTemplate from '../../../views/shared/products.html';
import products from '../../../server/products/index.get.json';
import { Component } from  '../../base/component';

export class ProductsComponent extends Component{
    constructor(){
        super();
        this.selector = "app-products";
        this.hbsTemplate = hbsTemplate;
    }

    init(){
        this.state = {
            products
        };
    }
    

    afterViewInit(){

    }

    render(){

    }

    destroy(){

    }
}