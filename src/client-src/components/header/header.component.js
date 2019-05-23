import { Component } from '../../base/component';
import './header.component.scss';
import subject from '../../base/subject';
import hbsTemplate from '../../views/shared/header.html';


export class HeaderComponent extends Component {
    constructor() {
        super();
        //comopnent hbs template
        this.hbsTemplate = hbsTemplate;
        //data needs to be passed to hbs template.
        this.state = {
            cartCount: window.cartModel.getTotalQty()
        }
    }

    // Lifecycle hook
    // for component initializing
    init() {
        this.carteUpdateListener = this.carteUpdate.bind(this);
        this.navMobEventListener = this.navMobileToggle.bind(this);
        this.modalActionListner = this.modalAction.bind(this);

        subject.subscribe("cartItemUpdated", this.carteUpdateListener);
    }

    //Lifecycle hook gets called component mounted.
    afterViewInit() {
        this.navMobDropDwnEl = this.querySelector(".js-nav-dropdown")[0];
        this.navIconEl = this.querySelector(".js-nav-icon")[0];
        this.menuIconWrapper = this.querySelector(".cart-icon .cursor")[0];
        this.cartCountEle = this.querySelector(".js-cart-count")[0];
        this.cartModelWrpEle = this.querySelector(".cart-wrapper--modal")[0];
        this.overlayEle = document.querySelector(".overlay");
        this.bodyEle = document.querySelector("body");

        //attaching events
        this.navMobDropDwnEl.addEventListener("click", this.navMobEventListener);
        this.navIconEl.addEventListener("click", this.navMobEventListener);
        this.menuIconWrapper.addEventListener("click", this.modalActionListner);
    }

    navMobileToggle(e) {
        if (e.currentTarget.classList.contains("js-nav-dropdown")) {
            this.navMobDropDwnEl.classList.remove("show");
            this.navIconEl.classList.remove("open");
        }
        else {
            this.navMobDropDwnEl.classList.toggle("show");
            this.navIconEl.classList.toggle("open");
        }
    }

    carteUpdate() {
        let totalItems = window.cartModel.getTotalQty();
        this.cartCountEle.textContent = totalItems;
    }

    modalAction() {
        if (this.bodyEle.offsetWidth <= 768) {
            return;
        }

        this.cartModelWrpEle.classList.remove("d-none");
        this.overlayEle.classList.remove("d-none");
        this.bodyEle.classList.add("no-scroll");
    }

    //lifecycle hook before component will unmount.
    destroy() {
        subject.unsubscribe("cartItemUpdated", this.carteUpdateListener);
        this.navMobDropDwnEl.removeEventListener("click", this.navMobEventListener);
        this.navIconEl.removeEventListener("click", this.navMobEventListener);
        this.menuIconWrapper.removeEventListener("click", this.modalActionListner);
    }
}