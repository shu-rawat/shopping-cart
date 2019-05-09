import hbsTemplate from '../../views/shared/home.html';
import { Component } from  '../../base/component';
export class HomeComponent extends Component{
    constructor(router){
        super(router);
    }

    init(){
        this.selector = "app-home";
        this.hbsTemplate = hbsTemplate;
    }    

    afterViewInit(){

    }

    destroy(){

    }
}