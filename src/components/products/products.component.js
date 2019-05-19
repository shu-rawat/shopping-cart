import { Component } from '../../base/component';
import './products.component.scss';
import hbsTemplate from '../../views/shared/products.html';
import subject from '../../base/subject';
import toasterType from '../../models/toasterType';
import ToasterService from '../../services/toaster.service';

export class ProductsComponent extends Component {
    
    constructor() {
        super();
        // component selector
        this.selector = "app-products";
        // hbs template for component view
        this.hbsTemplate = hbsTemplate;
    }

    // Lifecycle hook
    // for initializing component
    init() {
        this.onBuyNowListener = this.onBuyNow.bind(this);
        // state data required for hbs template
        this.state = {
            products: this.data.products.map(product => {
                return { ...product }
            }),
            empty: this.data.products.length == 0,
            allSelected: !this.routeParams.id || this.routeParams.id.length == 0,
            categories: this.data.categories.map(category => {
                return { ...category, active: this.routeParams.id == category.id };
            })
        };
    }

    // Lifecycle hooks it gets called after route parameters gets changed and it is part of routing.
    // it is passed routeParams which is object with key value pairs, where key is route param and value is route param value.
    // here it is used when product category gets changed so routeParams.id is different now.
    routePramsChanged(routeParams) {
        super.routePramsChanged(routeParams);
        this.showSelectedProducts();
    }

    // Lifecycle hook
    // gets Called after component views rendered to dom.
    afterViewInit() {
        this.allProdWrperItems = Array.from(this.querySelector(`.js-item-wrapper`));
        this.allLiEle = this.querySelector("li.js-all")[0];
        this.categUlEle = this.querySelector(".js-aside-categ")[0];
        this.allBuyBtnEle = Array.from(this.querySelector(".js-add-item"));

        // showing selected category products
        this.showSelectedProducts();
        this.attachBuyEvents();
        this.attachSelectCategEvent();
    }

    showSelectedProducts(){
        this.allProdWrperItems.forEach((prodWrapperEl) => {
            let hideEle = this.routeParams.id && prodWrapperEl.getAttribute("data-categ-id") != this.routeParams.id;
            prodWrapperEl.style.display = hideEle?'none':'flex';
        });
    }

    attachSelectCategEvent(){
        let prevSelectedEle = this.querySelector(".js-aside-categ li.visible")[0];
        this.categUlEle.addEventListener("click",e=>{
            prevSelectedEle.classList.remove("visible");
            e.target.parentNode.classList.add("visible");
            e.currentTarget.classList.toggle("list-open");
            prevSelectedEle = e.target.parentNode;
        });
    }

    attachBuyEvents() {
        // attaching events for buy now
        this.allBuyBtnEle.forEach(buyBtnEle => {
            buyBtnEle.addEventListener("click", this.onBuyNowListener);
        });
    }

    onBuyNow(e) {
        let cartItem = window.cartModel.addItemCount(this.getItemId(e.target));
        // when new item gets added 
        if (cartItem.quantity == 1) {
            subject.next("onCartItemAdded", cartItem);
            subject.next("cartUpdated", cartItem);
            ToasterService.showToaster(toasterType.success, `${cartItem.name} added in cart`);
        }
        else {
            // cart item updated
            subject.next("cartUpdated", cartItem);
            ToasterService.showToaster(toasterType.success, `${cartItem.name} cart item count is ${cartItem.quantity} `)
        }
    }

    // returns product id based on child product element
    getItemId(el) {
        return el.closest(`.js-item-wrapper`).getAttribute("data-item-id");
    }

    // Lifecycle hook
    // before component is destroyed.
    destroy() {
        this.allBuyBtnEle.forEach(item=>{
            item.removeEventListener("click", this.onBuyNowListener);
        });
    }

}