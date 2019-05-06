import hbsTemplate from '../../../views/shared/login.html';
import { Component } from  '../../base/component';

export class LoginComponent extends Component {
    constructor(){
        super();
    }

    init(){
        this.selector = "app-login";
        this.hbsTemplate = hbsTemplate;
    }
    
    afterViewInit(){

    }
    
    destroy(){

    }
}