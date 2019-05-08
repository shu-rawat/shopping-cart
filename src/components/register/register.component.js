import hbsTemplate from '../../views/shared/register.html';
import { Component } from  '../../base/component';

export class RegisterComponent extends Component{
    constructor(){
        super();
    }

    init(){
        this.selector = "app-register";
        this.hbsTemplate = hbsTemplate;
        this.keyEventListener = this.onKeyPress.bind(this);
    }
    
    afterViewInit(){
        this.inputEls = this.querySelector("input");
        this.querySelector("form")[0].addEventListener("submit",e=>{
            e.preventDefault();
            if(this.isFormValid()){
               this.router.navigateByURL("home");
            }
        });
        this.inputEls.forEach(inputEl=>{
            inputEl.addEventListener("keyup",this.keyEventListener);
        });
    }

    onKeyPress(e){
        let inputEl = e.target;
        let requiredEl = inputEl.parentElement.querySelector(".required");
        let invalidEl = inputEl.parentElement.querySelector(".invalid");
        if(requiredEl){   
            this.showError(requiredEl,inputEl.value.length == 0);            
        }
        if(invalidEl){
            this.showError(invalidEl,!eval(`"${inputEl.value}".match(/${invalidEl.getAttribute("_pattern")}/)`));
            // invalidEl.getAttribute("_pattern")
        }
    }

    showError(errorElement,show){
        if(show){        
            errorElement.classList.add("show");
        }
        else{
            errorElement.classList.remove("show");
        }
    }
    
    isFormValid(){
        let isValid = true;
        this.inputEls.forEach(inputEl=>{
            Array.from(inputEl.parentElement.querySelectorAll(".error p")).forEach(errorEl=>{
                let classList = errorEl.classList;
                let reqCheck = classList.contains("required")?inputEl.value!=0:true;
                let validCheck = classList.contains("invalid")?eval(`"${inputEl.value}".match(/${errorEl.getAttribute("_pattern")}/)`):true;
                if(!reqCheck){
                    isValid = false;
                    this.showError(errorEl,true)
                }
                if(!validCheck){
                    isValid = false;
                    this.showError(errorEl,true);
                }
            });
        });
        return isValid;
    }

    destroy(){
        this.inputEls.forEach(inputEl=>{
            inputEl.removeEventListener("keyup",this.keyEventListener);
        });
    }
}