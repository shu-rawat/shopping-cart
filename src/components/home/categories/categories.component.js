import hbsTemplate from '../../../views/shared/prodCategs.html';
import { Component } from  '../../../base/component';

export class CategoriesComponent extends Component{
    constructor(router){
        super(router);
        this.selector = "app-categories";
        this.hbsTemplate = hbsTemplate;
        this.exploreListener = this.onExploreClicked.bind(this);
        this.exploreBtns = [];
    }

    init(){
        this.state = {
            categories:this.data.categories.filter(categ=>categ.enabled).map((categ,ind)=>({...categ,even:ind%2==1}))
        };
    }

    afterViewInit(){
        this.exploreBtns = this.querySelector(".js-explore");
        Array.from(this.exploreBtns,(btnEle)=>{
            btnEle.addEventListener("click",this.exploreListener);
        });
    }

    onExploreClicked(e){
        let categoryId = e.target.closest(".category-box").getAttribute("data-categ-id");
        this.router.navigateByURL(`products/${categoryId}`);        
    }


    destroy(){
        this.exploreBtns.forEach((btnEle)=>{
            btnEle.removeEventListener("click",this.exploreListener);
        })
    }
}