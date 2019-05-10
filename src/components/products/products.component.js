import hbsTemplate from '../../views/shared/products.html';
import prodItemsTemplate from '../../views/shared/product_items.html';
import { Component } from  '../../base/component';
import subject from '../../base/subject';


export class ProductsComponent extends Component{
    constructor(){
        super();
        this.selector = "app-products";
        this.hbsTemplate = hbsTemplate;
    }

    init(){     
        this.state = {};
        this.onBuyNowListener = this.onBuyNow.bind(this);

        this.state.products = this.data.products;
        this.state.empty = this.data.products.length == 0;

        this.state.categories = this.data.categories.map(category=>{
            return {...category, active:this.routeParams.id == category.id};
        });        
    }

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
    
    afterViewInit(){
        Array.from(this.querySelector(".js-add-item"),(item)=>{
            item.addEventListener("click",this.onBuyNowListener);
        });
    }

    onBuyNow(e){
      let cartItem = window.cartModel.addItemCount(this.getItemId(e.target));
      //new item added
      if(cartItem.quantity == 1){
          subject.next("onCartItemAdded",cartItem);
      }
      else{
          //cart item updated
        subject.next("cartUpdated",cartItem);
      }
    }

    getItemId(el){
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    destroy(){
        Array.from(this.querySelector(".js-add-item"),(item)=>{
            item.removeEventListener("click",this.onBuyNowListener);
        });
    }
}