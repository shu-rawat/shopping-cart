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
        return document.querySelector(`#js-item-wrapper[data-item-id='${cartItemId}'] .js-item-count`)[0];
    },
    getItemTotalAmountEl:function(cartItemId){
        return document.querySelector(`#js-item-wrapper[data-item-id='${cartItemId}'] .js-item-total`)[0];   
    },
    getItemId:function(element){
        return element.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    },
    cartTotalAmtEl:document.getElementsByClassName("js-cart-final")[0]
}


export default cartView = (function(){
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
            cartElements.getItemCountEl(cartItemId).textContent = itemCount;
        },
        updateCartItemAmount: function(cartItemId,itemPrice){
            cartElements.getItemTotalAmountEl(cartItemId).textContent = itemPrice;
        }
    }
})();