import { Component } from  '../../../base/component';
import './categories.component.scss';
import hbsTemplate from '../../../views/shared/prodCategs.html';

export class CategoriesComponent extends Component{
    constructor(router){
        super(router);
        //component selector.
        this.selector = "app-categories";
        //hbs template
        this.hbsTemplate = hbsTemplate;
        //function binding to this
        this.exploreListener = this.onExploreClicked.bind(this);
        this.exploreBtns = [];
    }

    //Lifecycle hook
    //gets called after component instantiation.
    init(){
        //data required that is passed to hbs tempalte.
        this.state = {
            categories:this.data.categories.filter(categ=>categ.enabled).map((categ,ind)=>({...categ,even:ind%2==1}))
        };
    }

    //Life cycle hook
    //gets called after component view part rendered to the dom.
    afterViewInit(){
        this.exploreBtns = this.querySelector(".js-explore");
        //attaching events.
        Array.from(this.exploreBtns,(btnEle)=>{
            btnEle.addEventListener("click",this.exploreListener);
        });
    }

    onExploreClicked(e){
        let categoryId = e.target.closest(".category-box").getAttribute("data-categ-id");
        //navigating to products page for particular category products.
        this.router.navigateByURL(`products/${categoryId}`);        
    }


    //Lifecycle hook
    //gets called before component gets destroyed.
    destroy(){
        //detaching event listeners.
        this.exploreBtns.forEach((btnEle)=>{
            btnEle.removeEventListener("click",this.exploreListener);
        })
    }
}