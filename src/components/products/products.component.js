import hbsTemplate from '../../views/shared/products.html';
import prodItemsTemplate from '../../views/shared/product_items.html';
import { Component } from  '../../base/component';
import subject from '../../base/subject';


export class ProductsComponent extends Component{
    constructor(){
        super();
        //component selector
        this.selector = "app-products";
        //hbs template for component view
        this.hbsTemplate = hbsTemplate;
    }
    
    //Lifecycle hook
    //for initializing component
    init(){     
        
        this.onBuyNowListener = this.onBuyNow.bind(this);
        
        //state data required for hbs template
        this.state = {};
        this.state.products = this.data.products;
        this.state.empty = this.data.products.length == 0;
        this.state.categories = this.data.categories.map(category=>{
            return {...category, active:this.routeParams.id == category.id};
        });        
    }


    //Lifecycle hooks it gets called after route parameters gets changed and it is part of routing.
    //it is passed routeParams which is object with key value pairs, where key is route param and value is route param value.
    //here it is used when product category gets changed so routeParams.id is different now.
    routePramsChanged(routeParams){
            super.routePramsChanged(routeParams);
            //for detaching events on previous products
            this.destroy();
            this.init();
            this.querySelector(".items-ul")[0].innerHTML = prodItemsTemplate(this.state);
            Array.from(this.querySelector(".plp-catg-wrapper li"),ele=>{
                ele.classList.remove("visible");
            });
            if(this.routeParams && this.routeParams.id){
                let liCateg = this.querySelector(`.plp-catg-wrapper li[data-categ-id='${this.routeParams.id}']`)[0];
                liCateg.classList.add('visible');
            }
            else{
                this.querySelector(".plp-catg-wrapper li.all").classList.add('visible');
            }
           
            this.afterViewInit();
    }
    

    //Lifecycle hook
    //gets Called after component views rendered to dom.
    afterViewInit(){
        //attaching events for buy now
        Array.from(this.querySelector(".js-add-item"),(item)=>{
            item.addEventListener("click",this.onBuyNowListener);
        });
    }

    onBuyNow(e){
      let cartItem = window.cartModel.addItemCount(this.getItemId(e.target));
      //when new item gets added 
      if(cartItem.quantity == 1){
          subject.next("onCartItemAdded",cartItem);
      }
      else{
        //cart item updated
        subject.next("cartUpdated",cartItem);
      }
    }

    //returns product id based on child product element
    getItemId(el){
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    //Lifecycle hook
    //before component is destroyed.
    destroy(){
        Array.from(this.querySelector(".js-add-item"),(item)=>{
            item.removeEventListener("click",this.onBuyNowListener);
        });
    }
}