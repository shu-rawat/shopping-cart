import subject from '../base/subject';
import hbsTemplate from '../views/shared/header.html';
import { Component } from  '../base/component';

export class HeaderComponent extends Component{
    //Lifecycle hook
    //for component initializing
    init(){
        this.carteUpdateObservable = null;
    }
    
    constructor(){
        super();
        //comopnent hbs template
        this.hbsTemplate = hbsTemplate;
        //data needs to be passed to hbs template.
        this.state = {
            cartCount:window.cartModel.getTotalQty()
        }
    }

    //Lifecycle hook gets called component mounted.
    afterViewInit(){
        this.carteUpdateObservable = subject.subscribe("cartUpdated",()=>{
            let totalItems = window.cartModel.getTotalQty();
            Array.from(this.querySelector(".js-cart-count"),item=>{
                item.textContent = totalItems;
            }); 
        });
    }

    //lifecycle hook before component will unmount.
    destroy(){
        subject.unsubscribe(this.carteUpdateObservable);
    }
}