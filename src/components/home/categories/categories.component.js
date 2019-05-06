import hbsTemplate from '../../../../views/shared/prodCategs.html';
import categories from '../../../../server/categories/index.get.json';
import { Component } from  '../../../base/component';

export class CategoriesComponent extends Component{
    constructor(){
        super();
        this.selector = "app-categories";
        this.hbsTemplate = hbsTemplate;
    }

    init(){
        this.state = {
            categories
        };
    }
    

    afterViewInit(){

    }


    destroy(){

    }
}