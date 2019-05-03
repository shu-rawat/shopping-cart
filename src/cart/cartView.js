export const cartElements = {
    getCartCountEls:function(){
        return document.getElementsByClassName("js-cart-count")
    },
    getAddItemBtnEls:function(){
        return document.getElementsByClassName("js-add-item");
    },
    getRemoveItemBtnEls:function(){
        return document.getElementsByClassName("js-remove-item");
    },
    getItemCountEl:function(cartItemId){
        let els = document.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-count`);
        return els?els[0]:null;
    },
    getItemTotalAmountEl:function(cartItemId){
        let els = document.querySelector(`.js-item-wrapper[data-item-id='${cartItemId}'] .js-item-total`);
        return els?els[0]:null;   
    },
    getItemId:function(el){
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    },
    cartTotalAmtEl:function(){
        let el = document.getElementsByClassName("js-cart-final");
        return el?el[0]:null;
    }
}


export const cartView = (function(){
    return {
        updateCartTotalCount: function(cartTotalItems){            
            Array.from(cartElements.getCartCountEls(),(cartCountEl)=>{
                cartCountEl.textContent = cartTotalItems;
            });                   
        },
        updateCartTotalAmount: function(cartAmount){
            cartElements.cartTotalAmtEl.textContent = cartAmount;
        },
        updateCartItemCount: function(cartItemId,itemCount){
            let el = cartElements.getItemCountEl(cartItemId);
            el?el.textContent = itemCount:null;
        },
        updateCartItemAmount: function(cartItemId,itemPrice){
            let el = cartElements.getItemTotalAmountEl(cartItemId);
            el?el.textContent = itemPrice:null;
        }
    }
})();