
import { cartElements, cartView } from './cartView.js';
import CartModel from './cartModel.js';

let cartModel = new CartModel();

(function(){
    let eventListeners = {
        addItemElListener : function(addItemEl){
            let test = addItemEl;
            addItemEl.addEventListener("click",function(e){
                let cartItemId = cartElements.getItemId(e.target);
                let cartItem = cartModel.addItemCount(cartItemId);
                updateCartUI(cartItem);
            });
        },
        removeItemElListener : function(removeItemEl){
            removeItemEl.addEventListener("click",function(e){
                let cartItemId = cartElements.getItemId(e.target);
                let cartItem = cartModel.removeItemCount(cartItemId);
                updateCartUI(cartItem);
            });
        }
    }

    window.onload = function(){        
        let addItemEls = cartElements.getAddItemBtnEls();
        let removeItemEls = cartElements.getRemoveItemBtnEls();

        Array.from(addItemEls,eventListeners.addItemElListener.bind(cartModel));

        Array.from(removeItemEls,eventListeners.removeItemElListener.bind(cartModel));

    };

    function updateCartUI(cartItem){
        let itemTotalCount = cartItem.quantity;
        let itemTotalAmount = cartItem.getTotalAmount();
        let cartTotalCount = cartModel.getTotalQty();
        let cartTotalAmount = cartModel.getTotalAmount();

        cartView.updateCartItemCount(cartItem.id,itemTotalCount);
        cartView.updateCartItemAmount(cartItem.id,itemTotalAmount);
        cartView.updateCartTotalCount(cartTotalCount);
        cartView.updateCartTotalAmount(cartTotalAmount);
    }

})();

