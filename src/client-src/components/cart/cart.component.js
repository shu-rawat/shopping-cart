import { Component } from '../../base/component';
import './cart.component.scss';
import subject from '../../base/subject';
import hbsTemplate from '../../views/shared/cart.html';
import cartItemRowTemp from '../../views/shared/cartItemRow.html';
import DataService from '../../services/data.service';
import toasterType from '../../models/toasterType';
import ToasterService from '../../services/toaster.service';

export class CartComponent extends Component {

    constructor() {
        super();
        //component selector
        this.selector = "app-cart";
        //component view hbs template
        this.hbsTemplate = hbsTemplate;

        //binding functions so that this can be used.
        this.onCartItemUpdateListener = this.onCartItemUpdate.bind(this);
        this.onAddItemElListener = this.onAddItemEl.bind(this);
        this.onRemoveItemElListener = this.onRemoveItemEl.bind(this);
        this.modalCloseActionListener = this.modalCloseAction.bind(this);
        //listening to changes from any other components.
        subject.subscribe("cartItemUpdated", this.onCartItemUpdateListener);
    }

    //Component Lifecycle hook
    //it gets called after Component has been instantiated, used for initializing Component
    init() {
        let totalQuantity = window.cartModel.getTotalQty();
        let totalAmount = window.cartModel.getTotalAmount(); 
        //setting data inside state for data to be provided for template.
        this.state = {
            items: window.cartModel.items.map(item => {
                item.totalPrice = item.getTotalAmount();
                return {...item};
            }),
            totalQuantity,
            totalAmount,
            showEmptyCart: totalQuantity==0,
            showAdvt: totalQuantity!=0
        };
    }

    // Component lifecycle hook
    // functions gets called After component view has been rendered in dom Component lifecycle hook
    afterViewInit() {
        this.initData();
        this.attachEvents();
    }

    initData() {
        this.addItemEls = Array.from(this.querySelector(".js-add-item"));
        this.removeItemEls = Array.from(this.querySelector(".js-remove-item"));
        this.closeIconEl = this.querySelector(".close")[0];
        this.cartItemsWrpEl = this.querySelector(".cart-items")[0];
        this.cartTotalCountEl = this.querySelector(".js-cart-count")[0];
        this.cartTotalAmtEl = this.querySelector(".js-cart-final")[0];
        this.cartModalEl = document.querySelector(".cart-wrapper--modal");
        this.overlayEl = document.querySelector(".overlay");
        this.bodyEl = document.querySelector("body");
    }

    attachEvents() {
        //initial add and remove event listeners binding.
        this.addItemEls.forEach(item => { this.addItemElEvent(item) });
        this.removeItemEls.forEach(item => { this.removeItemElEvent(item) });
        this.closeIconEl.addEventListener("click", this.modalCloseActionListener);
    }

    modalCloseAction() {
        this.cartModalEl.classList.add("d-none");
        document.querySelector(".overlay").classList.add("d-none");
        document.querySelector("body").classList.remove("no-scroll");
    }

    addItemElEvent(addItemEl) {
        //adds click event listening on cart item add btn
        addItemEl.addEventListener("click", this.onAddItemElListener);
    }

    removeItemElEvent(removeItemEl) {
        //minus button event listener attaching
        removeItemEl.addEventListener("click", this.onRemoveItemElListener);
    }

    onAddItemEl(e) {
        //updates added item in cart model and notifies for cart updation.
        let cartItemId = this.getItemId(e.target);
        DataService.postAddToCart(cartItemId).then((resp)=>{
            if(resp.response === "Failure"){
                ToasterService.showToaster(toasterType.error, resp.responseMessage);
            }
            else{
                let cartItem = window.cartModel.addItemCount(cartItemId);
                subject.next("cartItemUpdated", cartItem);
                ToasterService.showToaster(toasterType.success, resp.responseMessage);
            }
        },()=>{
            ToasterService.showToaster(toasterType.error, "Something went wrong");
        });        
    }

    onRemoveItemEl(e) {
        //removes or decrement cart item count in model and notifies for views updated by deleteCartItem and cartUpdated
        let cartItemId = this.getItemId(e.target);
        DataService.postRemoveFromCart(cartItemId).then((resp)=>{

            if(resp.response === "Failure"){
                ToasterService.showToaster(toasterType.error, resp.responseMessage);
            }
            else{
                let cartItem = window.cartModel.removeItemCount(cartItemId);
                subject.next("cartItemUpdated", cartItem);
                ToasterService.showToaster(toasterType.success, resp.responseMessage);
            }
        },()=>{
            ToasterService.showToaster(toasterType.error, "Something went wrong");
        });        
    }

    //updated cartItem to the cart view
    onCartItemUpdate(cartItem, isNewItem) {
        let cartTotalCount = cartModel.getTotalQty();
        let cartTotalAmount = cartModel.getTotalAmount();

        if (isNewItem) {
            //new item
            this.insertNewItemInDOM(cartItem);
        }
        else if(cartItem.quantity == 0){
            //deleted item
            this.deleteCartItemView(cartItem);
        }
        else{
            //changed item count
            this.updateCartItemView(cartItem);
        }
        
        //checking for cart empty 
        this.checkEmptyCart(window.cartModel.getTotalQty());
        this.cartTotalCountEl.textContent = cartTotalCount;
        this.cartTotalAmtEl.textContent = cartTotalAmount;
    }

    insertNewItemInDOM(cartItem) {
        //inserting in new cart row in dom
        //using partials
        this.cartItemsWrpEl.insertAdjacentHTML('beforeend', cartItemRowTemp({...cartItem, totalPrice:cartItem.getTotalAmount()}));
        //attaching events for new add and remove btns inserted in DOM
        let addBtnEl = this.getAddItemBtnEl(cartItem.id);
        let rmvBtnEl = this.getRemoveItemBtnEl(cartItem.id);
        this.addItemElEvent(addBtnEl);
        this.addItemEls.push(addBtnEl);
        this.removeItemElEvent(rmvBtnEl);
        this.removeItemEls.push(rmvBtnEl);
    }

    updateCartItemView(cartItem){
        let itemCountEl = this.getItemCountEl(cartItem.id);
        let itemFinalAmtEl = this.getItemTotalAmountEl(cartItem.id);

        itemCountEl ? itemCountEl.textContent = cartItem.quantity : null;
        itemFinalAmtEl ? itemFinalAmtEl.textContent = cartItem.getTotalAmount() : null;
    }

    deleteCartItemView(cartItem) {
        let WrapperEl = this.querySelector(`.js-item-wrapper[data-item-id='${cartItem.id}']`)[0];
        let addBtnEl = this.getAddItemBtnEl(cartItem.id);
        let rmvBtnEl = this.getRemoveItemBtnEl(cartItem.id);

        this.addItemEls.splice(this.addItemEls.indexOf(addBtnEl),1);
        this.removeItemEls.splice(this.removeItemEls.indexOf(rmvBtnEl),1);
        addBtnEl.removeEventListener("click",this.onAddItemElListener);
        rmvBtnEl.removeEventListener("click",this.onRemoveItemElListener);
        this.cartItemsWrpEl.removeChild(WrapperEl);
    }

    checkEmptyCart(cartTotalCount) {
        //function for show/hiding empty and advt info divs
        if (cartTotalCount == 0) {
            this.querySelector(".js-advt-cart")[0].classList.remove("d-flex");
            this.querySelector(".js-empty-cart")[0].classList.add("d-flex");
            this.querySelector(".cart-footer")[0].classList.add("d-none");
        }
        else {
            this.querySelector(".js-advt-cart")[0].classList.add("d-flex");
            this.querySelector(".js-empty-cart")[0].classList.remove("d-flex");
            this.querySelector(".cart-footer")[0].classList.remove("d-none");
        }
    }

    getAddItemBtnEl(cartItemId) {
        //returns add item btn for cart item
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-add-item`)[0];
    }

    getRemoveItemBtnEl(cartItemId) {
        //returns particular remove btn for cart item
        return this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-remove-item`)[0];
    }


    getItemCountEl(cartItemId) {
        //returns items count element for cart item
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-count`);
        return els ? els[0] : null;
    }

    getItemTotalAmountEl(cartItemId) {
        //return total amoutn element for cart item
        let els = this.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-total`);
        return els ? els[0] : null;
    }

    getItemId(el) {
        //returns wrapper element for passed inner child element.
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    //Component Lifecycle hook
    //it gets called when component is destroyed.
    destroy() {
        //unsubscribing events and removing event listeners from dom for this component elements.
        this.closeIconEl.removeEventListener("click", this.modalCloseActionListener);
        subject.unsubscribe("cartItemUpdated", this.onCartItemUpdateListener);
        this.addItemEls.forEach(btn=>{
            btn.removeEventListener("click", this.onAddItemElListener);
        });

        this.removeItemEls.forEach((btn)=>{
            btn.removeEventListener("click", this.onRemoveItemElListener);
        });
    }
}