import subject from '../base/subject';
import hbsTemplate from '../../views/shared/header.html';
import { Component } from  '../base/component';

export class HeaderComponent extends Component{
    init(){
        this.carteUpdateObservable = null;
    }
    
    constructor(){
        super();
        this.hbsTemplate = hbsTemplate;
    }

    afterViewInit(){
        this.carteUpdateObservable = subject.subscribe("cartUpdated",function(){
            console.log("cart Updated listener in header");
        });
    }

    destroy(){
        subject.unsubscribe(this.carteUpdateObservable);
    }
}