import subject from '../base/subject';
import hbsTemplate from '../views/shared/header.html';
import { Component } from  '../base/component';

export class HeaderComponent extends Component{
    init(){
        this.carteUpdateObservable = null;
    }
    
    constructor(){
        super();
        this.hbsTemplate = hbsTemplate;
        this.state = {
            cartCount:window.cartModel.getTotalQty()
        }
    }

    afterViewInit(){
        this.carteUpdateObservable = subject.subscribe("cartUpdated",()=>{
            let totalItems = window.cartModel.getTotalQty();
            Array.from(this.querySelector(".js-cart-count"),item=>{
                item.textContent = totalItems;
            }); 
        });
    }

    destroy(){
        subject.unsubscribe(this.carteUpdateObservable);
    }
}