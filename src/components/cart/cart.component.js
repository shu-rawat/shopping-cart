import { Component } from  '../../base/component';
import subject from '../../base/subject';
import hbsTemplate from '../../../views/shared/cart.html';
import cartItemRowTemp from '../../../views/shared/cartItemRow.html';

export class CartComponent extends Component{

    constructor(){
        super();
        this.selector = "app-cart";
        this.hbsTemplate = hbsTemplate;
    }

    init(){
        //reads cart from storage
        window.cartModel.readStorage();  
        this.state = {
            items:window.cartModel.items.map(item=>{
                item.totalPrice = item.getTotalAmount();
                return item;
            }),
            totalQuantity:window.cartModel.getTotalQty(),
            totalAmount:window.cartModel.getTotalAmount()
        };
    }

    addItemElListener(addItemEl){
        let test = addItemEl;
        addItemEl.addEventListener("click",(e)=>{
            let cartItemId = this.getItemId(e.target);
            let cartItem = window.cartModel.addItemCount(cartItemId);
            if(cartItem.quantity == 1){
                window.cartModel.addCartItem(cartItem);
            }
            subject.next("cartUpdated");
            this.updateCartUI(cartItem);
        });
    }

    removeItemElListener(removeItemEl){
        removeItemEl.addEventListener("click",(e)=>{
            let cartItemId = this.getItemId(e.target);
            let cartItem = window.cartModel.removeItemCount(cartItemId);
            subject.next("cartUpdated");
            this.updateCartUI(cartItem);
        });
    }


    afterViewInit(){
        let addItemEls = this.getAddItemBtnEls();
        let removeItemEls = this.getRemoveItemBtnEls();

        Array.from(addItemEls,(item)=>{this.addItemElListener(item)});
        Array.from(removeItemEls,(item)=>{this.removeItemElListener(item)});
    }

    updateCartTotalCount(cartTotalItems){            
        Array.from(this.getCartCountEls(),(cartCountEl)=>{
            cartCountEl.textContent = cartTotalItems;
        });                   
    }

    
    updateCartTotalAmount(cartAmount){
        this.getCartTotalAmtEl().textContent = cartAmount;
    }

    
    updateCartItemCount(cartItemId,itemCount){
        let el = this.getItemCountEl(cartItemId);
        el?el.textContent = itemCount:null;
    }

    
    updateCartItemAmount(cartItemId,itemPrice){
        let el = this.getItemTotalAmountEl(cartItemId);
        el?el.textContent = itemPrice:null;
    }


    updateCartUI(cartItem){
        let itemTotalCount = cartItem.quantity;
        let itemTotalAmount = cartItem.getTotalAmount();
        let cartTotalCount = cartModel.getTotalQty();
        let cartTotalAmount = cartModel.getTotalAmount();

        this.updateCartItemCount(cartItem.id,itemTotalCount);
        this.updateCartItemAmount(cartItem.id,itemTotalAmount);
        this.updateCartTotalCount(cartTotalCount);
        this.updateCartTotalAmount(cartTotalAmount);
    }

    
    addCartItem(cartItem){
        document.querySelector(".my-cart-items-wrapper>ul").innerHTML += cartTemplates.getCartItemRowHtml(cartItem);
    }

    getCartCountEls(){
        return this.querySelector(".js-cart-count")
    }

    getAddItemBtnEls(){
        return this.querySelector(".js-add-item");
    }
    
    getRemoveItemBtnEls(){
        return this.querySelector(".js-remove-item");
    }

    getItemCountEl(cartItemId){
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-count`);
        return els?els[0]:null;
    }

    getItemTotalAmountEl(cartItemId){
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-total`);
        return els?els[0]:null;
    }

    getItemId(el){
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    getCartItemRowHtml(data){
        return cartItemRowTemp(data);
    }

    getCartTotalAmtEl(){
        let el = this.querySelector(".js-cart-final");
        return el?el[0]:null;
    }

    destroy(){

    }
}