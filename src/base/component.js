
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || 
                                Element.prototype.webkitMatchesSelector;
  }
  
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      var el = this;
  
      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

export class Component{
    constructor(router){
        //attaches router to component
        this.router = router;
    }

    init(){
        // for compnent initialization
        // gets called when child component does not override this hook
    }
    
    afterViewInit(){

        // gets called after compnent view has been mounted.
        // gets called when child component does not override this hook
    }

    destroy(){

        // gets called before component will unmount.
        // gets called when child component does not override this hook
    }


    //helper method for finding elment of it's component view
    querySelector(queryString){
        let allElements = document.querySelectorAll(`component[__id__='${this.__id__}'] ${queryString}`);        
        if(!allElements){
            return [];
        }
        return Array.from(allElements).filter(element=>{
            let wrapperComponent = element.closest("component");
            if(wrapperComponent){
                return this.__id__ == wrapperComponent.getAttribute("__id__");
            }
            return false;
        });
    };

    //hook for route params change
    routePramsChanged(routeParams){
        this.routeParams = routeParams;
    }
}