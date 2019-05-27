import { Component } from  '../../base/component';
import './register.component.scss';
import hbsTemplate from '../../views/shared/register.html';

export class RegisterComponent extends Component{
    constructor(){
        super();
    }

    //Lifecycle hook
    //for initializing component
    init(){
        //component selector
        this.selector = "app-register";
        //hbs template for component view.
        this.hbsTemplate = hbsTemplate;
        //binding function to this
        this.keyEventListener = this.onKeyPress.bind(this);
    }
    
    //Lifecycle hook
    //gets called after comopnent rendered to dom
    afterViewInit(){
        this.inputEls = this.querySelector("input");

        //hadling form submit event and preventing its default behaviour
        //and checking for form validation and then routing it to home page.
        this.querySelector("form")[0].addEventListener("submit",e=>{
            e.preventDefault();
            if(this.isFormValid()){
               this.router.navigateByURL("home");
            }
        });

        //attaching events for keyup input validation
        this.inputEls.forEach(inputEl=>{
            inputEl.addEventListener("keyup",this.keyEventListener);
        });
    }

    onKeyPress(e){
        let inputEl = e.target;
        let requiredEl = inputEl.parentElement.querySelector(".required");
        let invalidEl = inputEl.parentElement.querySelector(".invalid");
        let mismatchEl = inputEl.parentElement.querySelector(".mismatch");
        let checkForMismatch = inputEl.hasAttribute("mismatch");
        let inputEr = false;
        //if input element needs required validation
        if(requiredEl){   
            inputEr = inputEl.value.length == 0
            this.showError(requiredEl,inputEr);                        
        }

        //if input element need validity validation based on pattern provided.
        if(invalidEl){
            if(inputEr){
                this.showError(invalidEl, false);
            }
            else{
                this.showError(invalidEl,!eval(`"${inputEl.value}".match(/${invalidEl.getAttribute("_pattern")}/)`));
            }
        }

        //if input element needs mismatch validation      
        if(checkForMismatch && mismatchEl){       
            if(inputEr){
                this.showError(mismatchEl, false);
            }
            else{                
                this.showMismatchError();        
            }
        }
    }



    showMismatchError(){

        //checking for all inputs that needs to be same like password input and confirm password.
        let inputsMismatch = this.querySelector("form input[mismatch]");
        let isMismatch = false;
        if(inputsMismatch.length){
            let val = inputsMismatch[0].value;
            inputsMismatch.forEach(inputMismatchEl=>{               
                if(inputMismatchEl.value.length){
                    let misMatch = false;
                    //if both values are not same
                    if(inputMismatchEl.value != val){
                        misMatch = true;
                        isMismatch = true;
                    }
                    let errEle = inputMismatchEl.parentElement.querySelector(".mismatch");
                    //if error needs to be shown for this input element
                    if(errEle){
                        //if mismatch occurs for this input element.
                        this.showError(errEle,misMatch)
                    }
                }
            });
        }
        return isMismatch;
    }

    //show/hide error for error message element
    showError(errorElement,show){
        if(show){        
            errorElement.classList.add("show");
        }
        else{
            errorElement.classList.remove("show");
        }
    }
    
     //form validation
    isFormValid(){
        let isValid = true;
        
        this.inputEls.forEach(inputEl=>{
            let inputEr = false;
            //checking all error messages are passed for each input element
            Array.from(inputEl.parentElement.querySelectorAll(".error p")).forEach(errorEl=>{
                let classList = errorEl.classList;
                let reqCheck = classList.contains("required")?inputEl.value!=0:true;
                let validCheck = classList.contains("invalid")?eval(`"${inputEl.value}".match(/${errorEl.getAttribute("_pattern")}/)`):true;
                //if error message is of required check and does not pass
                if(!reqCheck){
                    isValid = false;
                    this.showError(errorEl,true);
                    inputEr = true;
                }

                //if error message is of validity check and does not pass
                if(!validCheck && !inputEr){
                    isValid = false;
                    this.showError(errorEl,true);
                }
                
                //if error message is of validity check and does not pass
                if(this.showMismatchError() && !inputEr){
                    isValid = false;
                }
            });
        });
        return isValid;
    }
    
    //Lifecycle hook
    //gets called after component gets destroyed.
    destroy(){
         //removing key up events.
        this.inputEls.forEach(inputEl=>{
            inputEl.removeEventListener("keyup",this.keyEventListener);
        });
    }
}