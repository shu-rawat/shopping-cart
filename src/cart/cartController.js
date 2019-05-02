
import { cartElements } from ',/cartView.js';
import CartModel from './cartModel.js';
import  cartView from './cartView.js';

(function(){

    window.onload = function(){
        let cartModel = new CartModel();
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
        
        Array.from(cartElements.getAddItemBtnEls(),(addItemEl)=>{
            addItemEl.addEventListener("click",function(e){
                let cartItemId = cartElements.getItemId(e.target);
                let cartItem = cartModel.addItemCount(cartItemId);
                updateCartUI(cartItem);
            });
        });

        Array.from(cartElements.getRemoveItemBtnEls(),(removeItemEl)=>{
            removeItemEl.addEventListener("click",function(e){
                let cartItemId = cartElements.getItemId(e.target);
                let cartItem = cartModel.removeItemCount(cartItemId);
                updateCartUI(cartItem);
            });
        });

    };

})();

