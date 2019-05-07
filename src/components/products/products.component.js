import hbsTemplate from '../../../views/shared/products.html';
import prodItemsTemplate from '../../../views/shared/product_items.html';
import { Component } from  '../../base/component';
import subject from '../../base/subject';


export class ProductsComponent extends Component{
    constructor(){
        super();
        this.selector = "app-products";
        this.hbsTemplate = hbsTemplate;
    }

    init(){
        this.state = {
            categories:window.cartModel.categories
        };

        this.onBuyNowListener = this.onBuyNow.bind(this);
        if(this.routeParams && this.routeParams.id){
            this.state.products = window.cartModel.products.filter(product=>{
                return product.category == this.routeParams.id;
            })
        }
        else{
            this.state.products = window.cartModel.products;
        }
    }

    routePramsChanged(routeParams){
            super.routePramsChanged(routeParams);
            //for detaching events on previous products
            this.destroy();
            this.init();
            this.querySelector(".items-ul")[0].innerHTML = prodItemsTemplate(this.state);
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