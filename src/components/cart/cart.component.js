import { Component } from  '../../base/component';
import './cart.component.scss';
import subject from '../../base/subject';
import hbsTemplate from '../../views/shared/cart.html';
import cartItemRowTemp from '../../views/shared/cartItemRow.html';

export class CartComponent extends Component{

    constructor(){
        super();
        //component selector
        this.selector = "app-cart"; 
         //component view hbs template
        this.hbsTemplate = hbsTemplate;

        //binding functions so that this can be used.
        this.onCartItemAddedListener = this.onCartItemAdded.bind(this);
        this.onAddItemElListener =  this.onAddItemEl.bind(this);
        this.onCartDeleteListener = this.deleteCartItem.bind(this);
        this.onRemoveItemElListener = this.onRemoveItemEl.bind(this);
        this.cartUIUpdateListener = this.updateCartUI.bind(this);
    }

    //Component Lifecycle hook
    //it gets called after Component has been instantiated, used for initializing Component
    init(){
        
       //setting data inside state for data to be provided for template.
        this.state = {
            items:window.cartModel.items.map(item=>{
                item.totalPrice = item.getTotalAmount();
                return item;
            }),
            totalQuantity:window.cartModel.getTotalQty(),
            totalAmount:window.cartModel.getTotalAmount(),
        };
        this.state.showEmptyCart  = (this.state.totalQuantity == 0);
        this.state.showAdvt = !this.state.showEmptyCart;

        //listening to changes from any other components.
        subject.subscribe("onCartItemAdded",this.onCartItemAddedListener);
        subject.subscribe("cartUpdated",this.cartUIUpdateListener);
        subject.subscribe("deleteCartItem",this.onCartDeleteListener);
    }
 //adds new cartItem to the cart view
    onCartItemAdded(cartItem){
        let ulWrapperEl = this.querySelector(".my-cart-items-wrapper ul")[0];
        let liEl = document.createElement("li");
        liEl.innerHTML = cartItemRowTemp(cartItem);

        //attaching events for new add and remove btns inserted in DOM
        ulWrapperEl.appendChild(liEl);
        let addBtnEl = this.getAddItemBtnEl(cartItem.id);
        this.addItemElEvent(addBtnEl);
        let rmvBtnEl = this.getRemoveItemBtnEl(cartItem.id);
        this.removeItemElEvent(rmvBtnEl);        

        //notifing for cart item update so that other components can be notified.
        subject.next("cartUpdated",cartItem);
    }

    

    addItemElEvent(addItemEl){
        //adds click event listening on cart item add btn
        addItemEl.addEventListener("click",this.onAddItemElListener);
    }

    onAddItemEl(e){
        //updates added item in cart model and notifies for cart updation.
        let cartItemId = this.getItemId(e.target);
        let cartItem = window.cartModel.addItemCount(cartItemId);
        if(cartItem.quantity == 1){
            window.cartModel.addCartItem(cartItem);
        }
        subject.next("cartUpdated",cartItem);
    }

    removeItemElEvent(removeItemEl){
        //minus button event listener attaching
        removeItemEl.addEventListener("click",this.onRemoveItemElListener);
    }

    onRemoveItemEl(e){
        //removes or decrement cart item count in model and notifies for views updated by deleteCartItem and cartUpdated
        let cartItemId = this.getItemId(e.target);
        let cartItem = window.cartModel.removeItemCount(cartItemId);
        subject.next("deleteCartItem",cartItem);
        subject.next("cartUpdated",cartItem);
    }

    deleteCartItem(cartItem){
        //checks for item quantity if zero removes from DOM
        if(cartItem.quantity == 0){
            let WrapperEl = this.querySelector(`.js-item-wrapper[data-item-id='${cartItem.id}']`)[0];
            let liEl = WrapperEl.parentElement;
            liEl.parentNode.removeChild(liEl);
        }

        //calling function for showing no cart item present in cart 
        this.checkEmptyCart(window.cartModel.getTotalQty());
    }

    // Component lifecycle hook
    // functions gets called After component view has been rendered in dom Component lifecycle hook
    afterViewInit(){
        let addItemEls = this.getAddItemBtnEls();
        let removeItemEls = this.getRemoveItemBtnEls();
        
        //initial add and remove event listeners binding.
        Array.from(addItemEls,(item)=>{this.addItemElEvent(item)});
        Array.from(removeItemEls,(item)=>{this.removeItemElEvent(item)});
    }

    updateCartTotalCount(cartTotalItems){    
        //updated cart total items count wherever in cart component required.        
        Array.from(this.getCartCountEls(),(cartCountEl)=>{
            cartCountEl.textContent = cartTotalItems;
        });                   
    }

    
    //updated cart total amount
    updateCartTotalAmount(cartAmount){
        this.getCartTotalAmtEl().textContent = cartAmount;
    }

    //updated cart item count for particular cart item in dom
    updateCartItemCount(cartItemId,itemCount){
        let el = this.getItemCountEl(cartItemId);
        el?el.textContent = itemCount:null;
    }

    //updated cart item amount for particular cart item in dom
    updateCartItemAmount(cartItemId,itemPrice){
        let el = this.getItemTotalAmountEl(cartItemId);
        el?el.textContent = itemPrice:null;
    }

    //updates cart ui based on cart changed in cart item.
    updateCartUI(cartItem){
        let itemTotalCount = cartItem.quantity;
        let itemTotalAmount = cartItem.getTotalAmount();
        let cartTotalCount = cartModel.getTotalQty();
        let cartTotalAmount = cartModel.getTotalAmount();

        this.updateCartItemCount(cartItem.id,itemTotalCount);
        this.updateCartItemAmount(cartItem.id,itemTotalAmount);
        this.updateCartTotalCount(cartTotalCount);
        this.updateCartTotalAmount(cartTotalAmount);
        this.checkEmptyCart(cartTotalCount);       
    }

    checkEmptyCart(cartTotalCount){
        //function for show/hiding empty and advt info divs
        if(cartTotalCount == 0){
            this.querySelector(".js-advt-cart")[0].classList.remove("d-block");
            this.querySelector(".js-empty-cart")[0].classList.add("d-block");
        }
        else{
            this.querySelector(".js-advt-cart")[0].classList.add("d-block");
            this.querySelector(".js-empty-cart")[0].classList.remove("d-block");
        }
    }

    //inserts new cart item row.
    addCartItem(cartItem){
        document.querySelector(".my-cart-items-wrapper>ul").innerHTML += cartTemplates.getCartItemRowHtml(cartItem);
    }

    getCartCountEls(){
        //returns cart count elements.
        return this.querySelector(".js-cart-count")
    }

    getAddItemBtnEls(){
        //returns all add btn elements
        return this.querySelector(".js-add-item");
    }

    getAddItemBtnEl(cartItemId){
        //returns add item btn for cart item
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-add-item`)[0];
    }
    
    getRemoveItemBtnEls(){
        //returns all remove btn
        return this.querySelector(".js-remove-item");
    }

    getRemoveItemBtnEl(cartItemId){
        //returns particular remove btn for cart item
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-remove-item`)[0];
    }


    getItemCountEl(cartItemId){
         //returns items count element for cart item
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-count`);
        return els?els[0]:null;
    }

    getItemTotalAmountEl(cartItemId){
        //return total amoutn element for cart item
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-total`);
        return els?els[0]:null;
    }

    getItemId(el){
        //returns wrapper element for passed inner child element.
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    getCartItemRowHtml(data){
        // returns html for cart item row.
        return cartItemRowTemp(data);
    }

    getCartTotalAmtEl(){
        //returns final cart amoutn Element.
        let el = this.querySelector(".js-cart-final");
        return el?el[0]:null;
    }
    
    //Component Lifecycle hook
    //it gets called when component is destroyed.
    destroy(){
        //unsubscribing events and removing event listeners from dom for this component elements.
        subject.unsubscribe("onCartItemAdded",this.onCartItemAddedListener);
        subject.unsubscribe("cartUpdated",this.cartUIUpdateListener);
        let addBtns = this.querySelector(".js-add-item");
        let remvBtns = this.querySelector(".js-remove-item");
        subject.unsubscribe("deleteCartItem",this.onCartDeleteListener);
        Array.from(addBtns,(btn)=>{
            btn.removeEventListener("click",this.onAddItemElListener);
        });
        
        Array.from(remvBtns,(btn)=>{
            btn.removeEventListener("click",this.onRemoveItemElListener);
        });
    }
}