import { Component } from  '../../base/component';
import './toaster.component.scss';
import hbsTemplate from '../../views/shared/toaster.html';

export class ToasterComponent extends Component{

    constructor(){
        super();
        //component selector
        this.selector = "app-toaster"
        //component hbs template view.
        this.hbsTemplate = hbsTemplate;
    }
}