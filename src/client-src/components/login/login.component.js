import { Component } from  '../../base/component';
import './login.component.scss';
import hbsTemplate from '../../views/shared/login.html';

export class LoginComponent extends Component {
    constructor(router){
        super(router);
    }

    //Lifecycle hook
    //for initializing component
    init(){
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
        let inputEr = false;
        //if input element needs required validation
        if(requiredEl){   
            inputEr = inputEl.value.length == 0;
            this.showError(requiredEl,inputEr);          
        }
        // console.log("m", `"${inputEl.value}".match(/${invalidEl.getAttribute("_pattern")}/)`);
               
        //if input element need validity validation based on pattern provided.
        if(invalidEl){
            if(inputEr){
                this.showError(invalidEl,false);
            }
            else{
                this.showError(invalidEl,!eval(`"${inputEl.value}".match(/${invalidEl.getAttribute("_pattern")}/)`));            
            }
        }
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
            //checking all error messages are passed for each input element.
            let inputEr = false;
            Array.from(inputEl.parentElement.querySelectorAll(".error p")).forEach(errorEl=>{
                let classList = errorEl.classList;
                let reqCheck = classList.contains("required")?inputEl.value!=0:true;
                let validCheck = classList.contains("invalid")?eval(`"${inputEl.value}".match(/${errorEl.getAttribute("_pattern")}/)`):true;                 
                //if error message is of required check and does not pass
                if(!reqCheck){
                    isValid = false;
                    inputEr = true;
                    this.showError(errorEl,true)
                }
                //if error message is of validity check and does not pass
                if(!validCheck && !inputEr){
                    isValid = false;
                    this.showError(errorEl,true);
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