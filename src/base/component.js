export class Component{
    constructor(router){
        this.router = router;
    }

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

    routePramsChanged(routeParams){
        this.routeParams = routeParams;
        console.log("in parent",routeParams);
    }
}