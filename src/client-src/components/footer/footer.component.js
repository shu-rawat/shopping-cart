import { Component } from  '../../base/component';
import './footer.component.scss';
import hbsTemplate from '../../views/shared/footer.html';

export class FooterComponent extends Component{

    constructor(){
        super();
        //component hbs template view.
        this.hbsTemplate = hbsTemplate;
    }
}