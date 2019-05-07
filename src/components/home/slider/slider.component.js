import hbsTemplate from '../../../../views/shared/slider.html';
import banners from '../../../../server/banners/index.get.json';
import { Component } from  '../../../base/component';

export class SliderComponent extends Component{
    
    //for initialising component
    init(){
        this.prevBtnId = 'prev';
        this.nextBtnId = 'next';
        this.banrWrprClass = "slider-content";
        this.banrOuterWrpr = "top-slider-wrapper";
        this.initOnce = false;
        this.sliderTime = 600;
        this.nextSlideEventListener = null;
        this.prevSlideEventListener = null;
        this.resizeEventListener = null;
    }
    
    onResize(){  
        this.initData();       
        this.applyCss();
    }

    constructor(router){
        super(router);
        this.hbsTemplate = hbsTemplate;
        this.selector = "app-slider";
        this.activeBanrIndx = 0;
        this.state = {
            banners
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
        this.prevBtnEle = document.getElementById(this.prevBtnId);
        this.nextBtnEle = document.getElementById(this.nextBtnId);
        this.allBannersEles = document.querySelectorAll(`.${this.banrWrprClass} img`);
        this.bannerWrapperEle = document.getElementsByClassName(this.banrWrprClass)[0];
        this.bannersLength = this.allBannersEles.length;
        this.bannerWrapperOuter = document.getElementsByClassName(this.banrOuterWrpr)[0];
        this.bannerWrapperWidth = this.bannerWrapperOuter.offsetWidth;
    }
    
    attachEvents(){
        this.initOnce = true;
        this.nextSlideEventListener = this.slideToImageIndex.bind(this,-1);
        this.prevSlideEventListener = this.slideToImageIndex.bind(this,1);
        this.resizeEventListener = this.onResize.bind(this);

        this.prevBtnEle.addEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.addEventListener("click",this.prevSlideEventListener);
    
        window.addEventListener("resize",this.resizeEventListener);
    }

    slideToImageIndex(directionCount=0){            
        var targetBnrIndx = (this.activeBanrIndx + directionCount) % this.bannersLength; 
        this.updateWrapperLeft(targetBnrIndx);            
        this.activeBanrIndx = targetBnrIndx;
        this.updatePoints();
        this.setDisableBtns();
    }

    updateWrapperLeft(targetBnrIndx){
        var wraprLeftWdth = targetBnrIndx * this.bannerWrapperWidth;
        this.bannerWrapperEle.style.left = `-${wraprLeftWdth}px`;         
    }

    updatePoints(){
        var activeDot = document.querySelector(".dots-wrapper .active-dot");
        if(activeDot){
            activeDot.classList.remove("active-dot");
        }
        document.querySelectorAll(".dots-wrapper .dots")[this.activeBanrIndx].classList.add("active-dot");
    }

    setDisableBtns(){
        this.activeBanrIndx == (this.bannersLength - 1)?this.nextBtnEle.setAttribute("disabled", ""):this.nextBtnEle.removeAttribute("disabled");    
        this.activeBanrIndx == 0?this.prevBtnEle.setAttribute("disabled", ""):this.prevBtnEle.removeAttribute("disabled")
    }

    applyCss(){
        this.bannerWrapperEle.style.position = "relative";
        this.bannerWrapperEle.style.width = `${this.bannerWrapperWidth * this.bannersLength + 100}px`;
        this.bannerWrapperEle.style.left = `-${this.activeBanrIndx * this.bannerWrapperWidth}px`;  
        this.bannerWrapperEle.style.height = `${this.bannerWrapperWidth / 4}px`;   
        this.bannerWrapperEle.style.transition = `left ${this.sliderTime/1000}s linear`; 
        this.allBannersEles.forEach(banerImg=>{
            banerImg.style.width = `${this.bannerWrapperWidth}px`;
            banerImg.style.display = "inline-block";
        });
        this.bannerWrapperOuter.style.overflow = "hidden";
    }

    //invoked before component gets destroyed
    destroy(){
        this.prevBtnEle.removeEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.removeEventListener("click",this.prevSlideEventListener);
        window.removeEventListener("resize",this.resizeEventListener);
    }

}