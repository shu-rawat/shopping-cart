
import SPA from './base/spa';
import  './css/common.scss';
import CartModel from './models/cartModel';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SliderComponent } from './components/home/slider/slider.component';
import { CategoriesComponent } from './components/home/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { ToasterComponent } from './components/toaster/toaster.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';

import DataService from './services/data.service';
import ProductsResolver from './resolver/products.resolver';
import CategoryResolver from './resolver/category.resolver';
import BannerResolver from './resolver/banner.resolver';

export const routes = {
    '': {
        component: HomeComponent,
        resolve:{
            banners:BannerResolver,
            categories:CategoryResolver
        }
    },
    'home': {
        component: HomeComponent,
        resolve:{
            banners:BannerResolver,
            categories:CategoryResolver
        }
    },
    'products': {
        component: ProductsComponent,
        resolve:{
            products:ProductsResolver,
            categories:CategoryResolver
        }
    },
    'products/:id': {
        component: ProductsComponent,
        resolve:{
            products:ProductsResolver,
            categories:CategoryResolver
        }
    },
    'login': {
        component: LoginComponent
    },
    'register': {
        component: RegisterComponent
    },
    'cart': { 
        component: CartComponent
    }
};

const moduleConfig = {
    declarations: {
        'app-home': HomeComponent,
        'app-header': HeaderComponent,
        'app-slider': SliderComponent,
        'app-categories':CategoriesComponent,
        'app-footer':FooterComponent,
        'app-products':ProductsComponent,
        'app-login':LoginComponent,
        'app-register':RegisterComponent,
        'app-cart':CartComponent,
        'app-toaster':ToasterComponent
    },
    providers:[DataService, ProductsResolver, CategoryResolver, BannerResolver]
};
//accepts routes, module configuration and initial route path to load
const spa = new SPA(routes,moduleConfig,'');

window.cartModel = new CartModel();
 //reads local storage for saved cart items
 window.cartModel.init().then(() => { 

     spa.bootstrap();     
});
