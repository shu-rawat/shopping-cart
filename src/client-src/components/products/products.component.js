import { Component } from '../../base/component';
import './products.component.scss';
import hbsTemplate from '../../views/shared/products.html';
import subject from '../../base/subject';
import toasterType from '../../models/toasterType';
import ToasterService from '../../services/toaster.service';
import DataService from '../../services/data.service';

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
        this.categLinkActionListener = this.categLinkAction.bind(this);
        
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
            let showEle = !this.routeParams.id || prodWrapperEl.getAttribute("data-categ-id") == this.routeParams.id;
            prodWrapperEl.style.display = showEle?'flex':'none';
        });
    }

    attachSelectCategEvent(){
        this.prevSelectedEle = this.querySelector(".js-aside-categ li.visible")[0];
        this.categUlEle.addEventListener("click",this.categLinkActionListener);
    }

    attachBuyEvents() {
        // attaching events for buy now
        this.allBuyBtnEle.forEach(buyBtnEle => {
            buyBtnEle.addEventListener("click", this.onBuyNowListener);
        });
    }

    onBuyNow(e) {
        let productId = this.getItemId(e.target);
        DataService.postAddToCart(productId).then((resp)=>{
            if(resp.response === "Failure"){
                ToasterService.showToaster(toasterType.error, resp.responseMessage);
            }
            else{
                let cartItem = window.cartModel.addItemCount(productId);
                subject.next("cartItemUpdated",cartItem,cartItem.quantity == 1);
                ToasterService.showToaster(toasterType.success, resp.responseMessage);
            }            
        },()=>{
            ToasterService.showToaster(toasterType.error, "Something went wrong");
        });        
    }

    categLinkAction(e){
        if(this.prevSelectedEle){
            this.prevSelectedEle.classList.remove("visible");
        }
        e.target.parentNode.classList.add("visible");
        e.currentTarget.classList.toggle("list-open");
        this.prevSelectedEle = e.target.parentNode;
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
        this.categUlEle.removeEventListener("click",this.categLinkActionListener);
    }

}