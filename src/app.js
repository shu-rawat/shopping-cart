import SPA from './base/spa';

import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { HomeComponent } from './components/home/home.component';
import { SliderComponent } from './components/home/slider/slider.component';
import { CategoriesComponent } from './components/home/categories/categories.component';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';

import CartModel from './models/cartModel';

export const routes = {
    '': HomeComponent,
    'home': HomeComponent,
    'products':ProductsComponent,
    'login':LoginComponent,
    'register':RegisterComponent,
    'cart':CartComponent
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
        'app-cart':CartComponent
    }
};


window.cartModel = new CartModel();
//accepts routes, module configuration and initial route path to load
const spa = new SPA(routes,moduleConfig,'');
spa.bootstrap();