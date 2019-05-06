import { Component } from  '../../base/component';
import subject from '../../base/subject';
import hbsTemplate from '../../../views/shared/cart.html';
import cartItemRowTemp from '../../../views/shared/cartItemRow.html';

export class CartComponent extends Component{

    constructor(){
        super();
        this.selector = "app-cart";
        this.hbsTemplate = hbsTemplate;
        this.onCartItemAddedListener = this.onCartItemAdded.bind(this);
        this.onAddItemElListener =  this.onAddItemEl.bind(this);
        this.onRemoveItemElListener = this.onRemoveItemEl.bind(this);
        this.cartUIUpdateListener = this.updateCartUI.bind(this);
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
            totalAmount:window.cartModel.getTotalAmount(),
        };
        this.state.showEmptyCart  = this.state.totalQuantity == 0;
        subject.subscribe("onCartItemAdded",this.onCartItemAddedListener);
        subject.subscribe("cartUpdated",this.cartUIUpdateListener);        
    }

    onCartItemAdded(cartItem){
        let ulWrapperEl = this.querySelector(".my-cart-items-wrapper ul")[0];
        let liEl = document.createElement("li");
        liEl.innerHTML = cartItemRowTemp(cartItem);
        ulWrapperEl.appendChild(liEl);
        let addBtnEl = this.getAddItemBtnEl(cartItem.id);
        this.addItemElEvent(addBtnEl);
        let rmvBtnEl = this.getRemoveItemBtnEl(cartItem.id);
        this.removeItemElEvent(rmvBtnEl);        
        subject.next("cartUpdated",cartItem);
    }

    

    addItemElEvent(addItemEl){
        addItemEl.addEventListener("click",this.onAddItemElListener);
    }

    onAddItemEl(e){
        let cartItemId = this.getItemId(e.target);
        let cartItem = window.cartModel.addItemCount(cartItemId);
        if(cartItem.quantity == 1){
            window.cartModel.addCartItem(cartItem);
        }
        subject.next("cartUpdated",cartItem);
    }

    removeItemElEvent(removeItemEl){
        removeItemEl.addEventListener("click",this.onRemoveItemElListener);
    }

    onRemoveItemEl(e){
        let cartItemId = this.getItemId(e.target);
        let cartItem = window.cartModel.removeItemCount(cartItemId);
        if(cartItem.quantity == 0){
            let WrapperEl = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}']`)[0];
            let liEl = WrapperEl.parentElement;
            liEl.parentNode.removeChild(liEl);
        }
        subject.next("cartUpdated",cartItem);
    }


    afterViewInit(){
        let addItemEls = this.getAddItemBtnEls();
        let removeItemEls = this.getRemoveItemBtnEls();

        Array.from(addItemEls,(item)=>{this.addItemElEvent(item)});
        Array.from(removeItemEls,(item)=>{this.removeItemElEvent(item)});
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

    getAddItemBtnEl(cartItemId){
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-add-item`)[0];
    }
    
    getRemoveItemBtnEls(){
        return this.querySelector(".js-remove-item");
    }

    getRemoveItemBtnEl(cartItemId){
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-remove-item`)[0];
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
        subject.unsubscribe("onCartItemAdded",this.onCartItemAddedListener);
        subject.unsubscribe("cartUpdated",this.cartUIUpdateListener);
        let addBtns = this.querySelector(".js-add-item");
        let remvBtns = this.querySelector(".js-remove-item");
        Array.from(addBtns,(btn)=>{
            btn.removeEventListener("click",this.onAddItemElListener);
        });
        
        Array.from(remvBtns,(btn)=>{
            btn.removeEventListener("click",this.onRemoveItemElListener);
        });
    }
}