import hbsTemplate from '../../../views/shared/home.html';
import { Component } from  '../../base/component';
export class HomeComponent extends Component{
    constructor(){
        super();
    }

    init(){
        this.selector = "app-home";
        this.hbsTemplate = hbsTemplate;
    }
    

    afterViewInit(){

    }

    render(){

    }

    destroy(){

    }
}