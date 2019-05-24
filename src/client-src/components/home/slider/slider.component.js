import { Component } from  '../../../base/component';
import './slider.component.scss';
import hbsTemplate from '../../../views/shared/slider.html';

export class SliderComponent extends Component{
    
    //Lifecycle hook
    //for initialising component
    init(){
        this.initOnce = false;
        this.nextSlideEventListener = null;
        this.prevSlideEventListener = null;
        this.resizeEventListener = null;
        this.state.banners = this.data.banners;
    }

    //when window gets resized
    onResize(){  
        //initializing slider data again
        this.initData();       
         //appling css based on changed data aftere resizing
        this.applyCss();
    }

    constructor(router){
        
        super(router);
        //component hbs templated file.
        this.hbsTemplate = hbsTemplate;
        //component selector.
        this.selector = "app-slider";
        this.activeBanrIndx = 0;
        // data to be used by hbs template.
        this.state = {            
        };

    }
    
    //after View has been rendered into DOM
    afterViewInit(){
        this.initData();
        this.applyCss();
        this.attachEvents();
        this.updatePoints();
        this.setDisableBtns();
    }

    initData(){
        //saving dom elements and wrapper width 
        this.prevBtnEle = this.querySelector(".js-prev")[0];
        this.nextBtnEle = this.querySelector(".js-next")[0];
        this.allDotsEl = Array.from(this.querySelector(".dots-wrapper .dot"));
        this.allBannersEles = Array.from(this.querySelector(".js-slider-content img"));
        this.bannerWrapperEle = this.querySelector(".js-slider-content")[0];
        this.bannerWrapperOuter = this.querySelector(".js-slider-wrapper")[0];
        this.dotsWrapperEl = this.querySelector(".js-dots-wrapper")[0];
        this.bannersLength = this.allBannersEles.length;
        this.bannerWrapperWidth = this.bannerWrapperOuter.offsetWidth;
    }
    
    attachEvents(){
        //attaching event listeners
        this.initOnce = true;
        this.nextSlideEventListener = this.slideToImageIndex.bind(this,-1,null);
        this.prevSlideEventListener = this.slideToImageIndex.bind(this,1,null);
        this.dotsEventListener = this.onDotsClick.bind(this);
        this.resizeEventListener = this.onResize.bind(this);

        this.prevBtnEle.addEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.addEventListener("click",this.prevSlideEventListener);
        this.dotsWrapperEl.addEventListener("click",this.dotsEventListener);
        window.addEventListener("resize",this.resizeEventListener);
    }

    onDotsClick(e){
        let targetIndex = 0;
        if(e.target.tagName == "SPAN"){
            targetIndex = Array.from(e.currentTarget.children).indexOf(e.target);
            this.slideToImageIndex(0,targetIndex);
        }
        return false;
    }

    slideToImageIndex(directionCount=0,targetBnrIndx){  
        //slides to image index given        
        if(targetBnrIndx == null){
            targetBnrIndx = (this.activeBanrIndx + directionCount) % this.bannersLength; 
        }
        //sets wrapper left 
        this.updateWrapperLeft(targetBnrIndx);            
        this.activeBanrIndx = targetBnrIndx;
        //updated current point
        this.updatePoints();
        //checks for disble button
        this.setDisableBtns();
    }

    updateWrapperLeft(targetBnrIndx){
        //updates wrapper left based on current slider index.
        var wraprLeftWdth = targetBnrIndx * this.bannerWrapperWidth;
        this.bannerWrapperEle.style.left = `-${wraprLeftWdth}px`;         
    }

    updatePoints(){
        //updates current dot based on current banner
        var activeDot = this.querySelector(".dots-wrapper .dot--active")[0];
        if(activeDot){
            activeDot.classList.remove("dot--active");
        }
        this.allDotsEl[this.activeBanrIndx].classList.add("dot--active");
    }

    setDisableBtns(){
        //checks for disbling next and prev button 
        this.activeBanrIndx == (this.bannersLength - 1)?this.nextBtnEle.setAttribute("disabled", ""):this.nextBtnEle.removeAttribute("disabled");    
        this.activeBanrIndx == 0?this.prevBtnEle.setAttribute("disabled", ""):this.prevBtnEle.removeAttribute("disabled")
    }

    applyCss(){
        //applies dynamic styling eg widht and height and left and animation.
        this.bannerWrapperEle.style.width = `${this.bannerWrapperWidth * this.bannersLength + 100}px`;
        this.bannerWrapperEle.style.left = `-${this.activeBanrIndx * this.bannerWrapperWidth}px`;  
    
        this.allBannersEles.forEach(banerImg=>{
            banerImg.style.width = `${this.bannerWrapperWidth}px`;            
        });
    }

    //Lifecycle hook
    //invoked before component gets destroyed
    destroy(){
        this.prevBtnEle.removeEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.removeEventListener("click",this.prevSlideEventListener);
        window.removeEventListener("resize",this.resizeEventListener);
    }

}