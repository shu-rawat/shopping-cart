import '../static/style.scss';
import { cartController } from './cart/cartController.js';
import { slider } from './slider.js';
import headerTemplate from '../views/shared/header.html';
import footerTemplate from '../views/shared/footer.html';
import sliderTemplate from '../views/shared/slider.html';
import loginTemplate from '../views/shared/login.html';
import registerTemplate from '../views/shared/register.html';
import categoriesTemplate from '../views/shared/prodCategs.html';
import productsTemplate from '../views/shared/products.html';
import categories from '../server/categories/index.get.json';
import banners from '../server/banners/index.get.json';


export const pages = {
    init: function (pageName){
        document.getElementById("outlet-header").innerHTML = headerTemplate();
        document.getElementById("outlet-footer").innerHTML = footerTemplate();
        this.changePage(pageName);
    },
    changePage: function(pageName){
        switch(pageName){
            case 'home': this.getHomePage(categories);
                break;   
            case 'products': this.getProductsPage({products:cartModel.products,categories});  
                break;    
            case 'login': this.getLoginPage();
                break;
            case 'register': this.getRegisterPage();   
        }
    },
    getHomePage: function(categories){
        let sliderHTML = sliderTemplate({banners});                
        let categoriesHTML= categoriesTemplate({categories});
        document.getElementById("outlet-main").innerHTML = sliderHTML + categoriesHTML;
        let sliderOb = slider(0,'prev','next',"slider-content","top-slider-wrapper",600);
        sliderOb.start();
    },
    getProductsPage: function(products){
        document.getElementById("outlet-main").innerHTML = productsTemplate(products);
    },
    getLoginPage: function(){
        document.getElementById("outlet-main").innerHTML = loginTemplate();
    },
    getRegisterPage: function(){
        document.getElementById("outlet-main").innerHTML = registerTemplate();
    }
}

pages.init('home');

window.onhashchange = function(e){
    pages.changePage(e.newURL.split("#")[1]);
    let cc =new cartController();
    cc.attachEvents();
}