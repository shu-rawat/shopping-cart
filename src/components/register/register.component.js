import hbsTemplate from '../../../views/shared/register.html';
import { Component } from  '../../base/component';

export class RegisterComponent extends Component{
    constructor(){
        super();
    }

    init(){
        this.selector = "app-register";
        this.hbsTemplate = hbsTemplate;
    }
    

    afterViewInit(){

    }

    render(){

    }

    destroy(){

    }
}