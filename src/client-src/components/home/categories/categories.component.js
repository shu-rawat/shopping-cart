import { Component } from  '../../../base/component';
import './categories.component.scss';
import hbsTemplate from '../../../views/shared/prodCategs.html';

export class CategoriesComponent extends Component{
    constructor(router){
        super(router);
        //component selector.
        this.selector = "app-categories";
        //hbs template
        this.hbsTemplate = hbsTemplate;
    }

    //Lifecycle hook
    //gets called after component instantiation.
    init(){
        //data required that is passed to hbs tempalte.
        this.state = {
            categories:this.data.categories.filter(categ=>categ.enabled).map((categ,ind)=>({...categ,even:ind%2==1}))
        };
    }

}