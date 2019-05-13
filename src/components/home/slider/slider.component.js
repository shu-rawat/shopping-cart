import hbsTemplate from '../../../views/shared/slider.html';
import { Component } from  '../../../base/component';

export class SliderComponent extends Component{
    
    //Lifecycle hook
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
        this.prevBtnEle = document.getElementById(this.prevBtnId);
        this.nextBtnEle = document.getElementById(this.nextBtnId);
        this.allBannersEles = document.querySelectorAll(`.${this.banrWrprClass} img`);
        this.bannerWrapperEle = document.getElementsByClassName(this.banrWrprClass)[0];
        this.bannersLength = this.allBannersEles.length;
        this.bannerWrapperOuter = document.getElementsByClassName(this.banrOuterWrpr)[0];
        this.bannerWrapperWidth = this.bannerWrapperOuter.offsetWidth;
    }
    
    attachEvents(){
        //attaching event listeners
        this.initOnce = true;
        this.nextSlideEventListener = this.slideToImageIndex.bind(this,-1);
        this.prevSlideEventListener = this.slideToImageIndex.bind(this,1);
        this.resizeEventListener = this.onResize.bind(this);

        this.prevBtnEle.addEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.addEventListener("click",this.prevSlideEventListener);
    
        window.addEventListener("resize",this.resizeEventListener);
    }

    slideToImageIndex(directionCount=0){    
        //slides to image index given        
        var targetBnrIndx = (this.activeBanrIndx + directionCount) % this.bannersLength; 
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
        var activeDot = document.querySelector(".dots-wrapper .active-dot");
        if(activeDot){
            activeDot.classList.remove("active-dot");
        }
        document.querySelectorAll(".dots-wrapper .dots")[this.activeBanrIndx].classList.add("active-dot");
    }

    setDisableBtns(){
        //checks for disbling next and prev button 
        this.activeBanrIndx == (this.bannersLength - 1)?this.nextBtnEle.setAttribute("disabled", ""):this.nextBtnEle.removeAttribute("disabled");    
        this.activeBanrIndx == 0?this.prevBtnEle.setAttribute("disabled", ""):this.prevBtnEle.removeAttribute("disabled")
    }

    applyCss(){
        //applies dynamic styling eg widht and height and left and animation.
        this.bannerWrapperEle.style.position = "relative";
        this.bannerWrapperEle.style.width = `${this.bannerWrapperWidth * this.bannersLength + 100}px`;
        this.bannerWrapperEle.style.left = `-${this.activeBanrIndx * this.bannerWrapperWidth}px`;  
        this.bannerWrapperEle.style.height = `${this.bannerWrapperWidth / 4}px`;   
        this.bannerWrapperEle.style.transition = `left ${this.sliderTime/1000}s linear`; 
        Array.from(this.allBannersEles,banerImg=>{
            banerImg.style.width = `${this.bannerWrapperWidth}px`;
            banerImg.style.display = "inline-block";
        });
        this.bannerWrapperOuter.style.overflow = "hidden";
    }

    //Lifecycle hook
    //invoked before component gets destroyed
    destroy(){
        this.prevBtnEle.removeEventListener("click",this.nextSlideEventListener);
        this.nextBtnEle.removeEventListener("click",this.prevSlideEventListener);
        window.removeEventListener("resize",this.resizeEventListener);
    }

}