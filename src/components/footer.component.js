import hbsTemplate from '../views/shared/footer.html';
import { Component } from  '../base/component';
export class FooterComponent extends Component{

    constructor(){
        super();
        //component selector
        this.selector = "app-footer"
        //componetn hbs template view.
        this.hbsTemplate = hbsTemplate;
    }
}