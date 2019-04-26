var currentAcitve = 1;
document.getElementById("prev").addEventListener("click",function(){
    document.getElementById("dot"+currentAcitve).classList.remove("active-dot");
    document.getElementById("img"+currentAcitve).classList.add("inactive-image");
    document.getElementById("img"+currentAcitve).classList.remove("active-image");
    if(currentAcitve == 1){
        currentAcitve = 5;
    }
    else{
        --currentAcitve;    
    }
    document.getElementById("dot"+currentAcitve).classList.add("active-dot");    
    document.getElementById("img"+currentAcitve).classList.remove("inactive-image");
    document.getElementById("img"+currentAcitve).classList.add("active-image");
});

document.getElementById("next").addEventListener("click",function(){
    document.getElementById("dot"+currentAcitve).classList.remove("active-dot");    
    document.getElementById("img"+currentAcitve).classList.add("inactive-image");
    document.getElementById("img"+currentAcitve).classList.remove("active-image");
    if(currentAcitve == 5){
        currentAcitve = 1;
    }
    else{
        ++currentAcitve;    
    }
    document.getElementById("dot"+currentAcitve).classList.add("active-dot");    
    document.getElementById("img"+currentAcitve).classList.remove("inactive-image");
    document.getElementById("img"+currentAcitve).classList.add("active-image");
});