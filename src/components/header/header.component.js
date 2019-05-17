import { Component } from  '../../base/component';
import './header.component.scss';
import subject from '../../base/subject';
import hbsTemplate from '../../views/shared/header.html';


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
        this.carteUpdateListener = this.carteUpdate.bind(this);
        this.navMobDropDwnEl = this.querySelector(".js-nav-dropdown")[0];
        this.navIconEl = this.querySelector(".js-nav-icon")[0];
        this.carteUpdateObservable = subject.subscribe("cartUpdated",this.carteUpdateListener);
        this.navMobDropDwnEl.addEventListener("click",()=>{
            this.navMobDropDwnEl.classList.remove("show");
            this.navIconEl.classList.toggle("open");
        });
        this.navIconEl.addEventListener("click",()=>{
            this.navMobDropDwnEl.classList.toggle("show");
            this.navIconEl.classList.toggle("open");
        });
        this.querySelector(".cart-icon--desk .cart-link")[0].addEventListener("click",this.modalAction.bind(this,true));
    }

    carteUpdate(){
        let totalItems = window.cartModel.getTotalQty();
        Array.from(this.querySelector(".js-cart-count"),item=>{
            item.textContent = totalItems;
        }); 
    }

    modalAction(show){
        if(show){
            this.querySelector(".cart-wrapper--modal")[0].classList.remove("d-none");
            document.querySelector(".overlay").classList.remove("d-none");
            document.querySelector("body").classList.add("no-scroll");
        }
        else{
            this.querySelector(".cart-wrapper--modal")[0].classList.add("d-none");
            document.querySelector(".overlay").classList.add("d-none");
            document.querySelector("body").classList.remove("no-scroll");
        }
    }

    //lifecycle hook before component will unmount.
    destroy(){
        subject.unsubscribe(this.carteUpdateListener);
    }
}