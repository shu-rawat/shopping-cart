import './static/style.scss';


var slideshow = (function(activeBanrIndx,prevBtnId, nextBtnId,banrWrprClass,banrOuterWrpr,sliderTime){

    
    let prevBtnEle,nextBtnEle,allBannersEles,bannerWrapperEle,
    bannersLength,bannerWrapperOuter,bannerWrapperWidth,initOnce = false;

    function initData(){
        prevBtnEle = document.getElementById(prevBtnId);
        nextBtnEle = document.getElementById(nextBtnId);
        allBannersEles = document.querySelectorAll(`.${banrWrprClass} img`);
        bannerWrapperEle = document.getElementsByClassName(banrWrprClass)[0];
        bannersLength = allBannersEles.length;
        bannerWrapperOuter = document.getElementsByClassName(banrOuterWrpr)[0];
        bannerWrapperWidth = bannerWrapperOuter.offsetWidth;
    }

    function attachEvents(){
        initOnce = true;

        prevBtnEle.addEventListener("click",function(){
            slidToImageIndex(-1);
        });

        nextBtnEle.addEventListener("click",function(){
            slidToImageIndex(1);
        });

        function slidToImageIndex(directionCount=0){            
            var targetBnrIndx = (activeBanrIndx + directionCount) % bannersLength; 
            updateWrapperLeft(targetBnrIndx);            
            activeBanrIndx = targetBnrIndx;
            updatePoints();
            setDisableBtns();
        }

        function updateWrapperLeft(targetBnrIndx){
            var wraprLeftWdth = targetBnrIndx * bannerWrapperWidth;
            bannerWrapperEle.style.left = `-${wraprLeftWdth}px`;         
        }
    }

    function updatePoints(){
        var activeDot = document.querySelector(".dots-wrapper .active-dot");
        if(activeDot){
            activeDot.classList.remove("active-dot");
        }
        document.querySelectorAll(".dots-wrapper .dots")[activeBanrIndx].classList.add("active-dot");
    }

    function setDisableBtns(){
        activeBanrIndx == (bannersLength - 1)?nextBtnEle.setAttribute("disabled", ""):nextBtnEle.removeAttribute("disabled");    
        activeBanrIndx == 0?prevBtnEle.setAttribute("disabled", ""):prevBtnEle.removeAttribute("disabled")
    }

    function applyCss(){
        bannerWrapperEle.style.position = "relative";
        bannerWrapperEle.style.width = `${bannerWrapperWidth * bannersLength + 100}px`;
        bannerWrapperEle.style.left = `-${activeBanrIndx * bannerWrapperWidth}px`;  
        bannerWrapperEle.style.height = `${bannerWrapperWidth / 4}px`;   
        bannerWrapperEle.style.transition = `left ${sliderTime/1000}s ease-in`; 
        allBannersEles.forEach(banerImg=>{
            banerImg.style.width = `${bannerWrapperWidth}px`;
            banerImg.style.display = "inline-block";
        });
        bannerWrapperOuter.style.overflow = "hidden";
    }

    function init(){        
        initData();        
        if(!initOnce){                          
            attachEvents();
        }             
        applyCss();
        setDisableBtns();
    }
    
    init();

    window.addEventListener("resize",function(){
        init();
    });
})(0,'prev','next',"slider-content","top-slider-wrapper",600);

console.log(slideshow);

