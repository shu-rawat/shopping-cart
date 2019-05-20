let queue = [];
let isShowingToaster = false;
export default class ToasterService {
    constructor() {
    }

    static showToaster(toasterType, message) {
        queue.push({toasterType,message});
        if(!isShowingToaster){    
            isShowingToaster = true;        
            ToasterService._showToaster(toasterType, message);
        }      
    }

    static _showToaster(toasterType, message){
        queue.shift();
        document.querySelector(".toaster-wrapper p").textContent = message;
        document.querySelector(".toaster-content").style.backgroundColor = toasterType.backgroundColor;
        document.querySelector(".toaster-content").style.color = toasterType.color;        
        document.querySelector(".toaster-wrapper").classList.add("show");
        setTimeout(()=>{
            document.querySelector(".toaster-wrapper").classList.remove("show");
            setTimeout(()=>{
                if(queue.length){                
                    ToasterService._showToaster(queue[0].toasterType,queue[0].message);
                }       
                else{
                    isShowingToaster = false;
                }  
            },600); 
              
        },3000);
    }

    
}