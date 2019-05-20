import hbsTemplate from '../../views/shared/home.html';
import { Component } from  '../../base/component';
export class HomeComponent extends Component{
    constructor(router){
        super(router);
    }

    //Lifecyle hook
    //gets called after comopnent has been instantiated.
    init(){
        //component selector in the dom
        this.selector = "app-home";
        //component view hbs template.
        this.hbsTemplate = hbsTemplate;
    }
     
    //Lifecyle hook
    //Called when view has been rendered to DOM
    afterViewInit(){

    }

    
    //Lifecyle hook
    //gets called when component is destroyed.
    destroy(){

    }
}