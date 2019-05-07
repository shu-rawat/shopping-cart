//accepts moduleConfig object having declarations as object
// having key as component-selector
// and value as component for registering component with root module. 
function Module(moduleConfig) {

    if (moduleConfig.declarations) {
        this.registeredComponents = moduleConfig.declarations;
    }

    //returns component selector for Paticular Component
    this.findSelector = function(ComponentClass){
        let foundSelector = '';
        Object.keys(this.registeredComponents).forEach(selector=>{
            if(this.registeredComponents[selector] == ComponentClass){
                foundSelector = selector;
            }
        });
        return foundSelector;
    }
}

export default function SPA(routes,moduleConfig) {
    let initialPage = window.location.href.split("#")[1];
    const router = Object.freeze({
        navigateByURL
    });

    initialPage = initialPage?initialPage:'';
    let rootModule = new Module(moduleConfig);
    let currentRoute = null;
    let activeComponents = {};
    let maxCompId = 0;
    let routeParams = {};
    let currentRouteParams = {};
    let currentRouteComponent;
    const defaultOutlet = "router-outlet";

    function bootstrap() {
        window.onhashchange = function (e) {
            let pageName = e.newURL.split("#")[1];
            if(!pageName){
                pageName = '';    
            }
            navigateToPage(pageName);
        }
        resolveChildComponents();
        navigateToPage(initialPage);
    }

    function getNextCompId() {
        ++maxCompId;
        return maxCompId;
    }

    function resolveChildComponents(outletName = "layout-outlet", __id__=-1) {
        let childComponentTags = document.querySelectorAll(`${outletName}[__id__='${__id__}']  component`);
        Array.from(childComponentTags, function (componentWrapperEl) {
            let componentSelector = componentWrapperEl.getAttribute("comp-selector");
            createComponent(componentSelector, componentWrapperEl);
        });
    }

    function removeChildComponents(__id__){
        let childComponentTags = document.querySelectorAll(`component[__id__='${__id__}']  component`);
        let compIdsToRemove = [];
        Array.from(childComponentTags, function (componentWrapperEl) {
            let componentId= componentWrapperEl.getAttribute("__id__");
            compIdsToRemove.push(componentId);
        });
        compIdsToRemove = compIdsToRemove.sort().reverse();
        compIdsToRemove.map(compId=>activeComponents[compId])
                        .forEach(componentInstance=>{
                            console.log(componentInstance,"componentInstance");
                            componentInstance.destroy();
                            delete activeComponents[componentInstance.__id__]
                        });
        activeComponents[__id__].destroy();
        delete activeComponents[__id__];
    }

    function createComponent(componentSelector, componentWrapperEl) {
        let ComponentClass = rootModule.registeredComponents[componentSelector];    
        if (ComponentClass) {
            let component = new ComponentClass(router);
            component.router = router;
            component.routeParams = routeParams;
            Object.defineProperty(component, "__id__", {
                value: getNextCompId(),
                configurable: false,
                writable: false
            });
            

            activeComponents[component.__id__] = component;
            component.init();
            if(componentWrapperEl.tagName == "ROUTER-OUTLET"){
                componentWrapperEl.innerHTML = `<component comp-selector='${component.selector}'
                __id__='${component.__id__}'>
                    ${component.hbsTemplate(component.state)}
                </component`;
            }
            else{
                componentWrapperEl.setAttribute("__id__",component.__id__);
                componentWrapperEl.innerHTML = component.hbsTemplate(component.state);
            }
            resolveChildComponents("component",component.__id__);
            component.afterViewInit();
            return component;
        }
        else {
            alert(`component with selector name ${componentSelector} not found in module`);
            return null;
        }
    }

    function navigateByURL(url){
        history.pushState({}, null, `#${url}`);
        navigateToPage(url);
    }

    function navigateToPage(_pageName) {
        let pathFragments = _pageName.split("/");
        let ComponentClass;
        let routeMatched = null;
        routeParams = {};
        if(pathFragments.length == 1){
            ComponentClass = routes[_pageName];     
            if(ComponentClass){
                routeMatched = _pageName;
            }
        }
        else{
            let allRoutes = Object.keys(routes);
            let routeMatchedFragments;
            routeMatched = allRoutes.find(route=>{
                let routeFragments = route.split("/");
                if(routeFragments.length == pathFragments.length){
                    let fragMatched = routeFragments.every(function(routeFragment,index){
                        if(!routeFragment.includes(":")){
                            return routeFragment == pathFragments[index]; 
                        }
                        return true;
                    });
                    routeMatchedFragments = fragMatched?routeFragments:null;
                    return fragMatched;
                }                
                return false;
            });

            if(routeMatched){
                if(routeMatched.includes(":")){                    
                    routeMatchedFragments.map(function(fragment,index){
                        if(fragment.includes(":")){
                            let param = fragment.split(":")[1];
                            routeParams[param] = pathFragments[index];
                        }
                    },{});
                }
                ComponentClass = routes[routeMatched];                
            }
        }
        if (!ComponentClass) {
            alert("Page Not Registered With Routes");
            return;
        }
        else {
            if (currentRoute == routeMatched || routes[currentRoute] == routes[routeMatched]) {
                currentRoute = routeMatched;
                let a = JSON.stringify(routeParams);
                let b = JSON.stringify(currentRouteParams);               
                if(currentRouteComponent &&  a!=b){
                    currentRouteComponent.routePramsChanged(routeParams);
                }
                return;
            }
            else {
                currentRoute = routeMatched;
                let componentSelector = rootModule.findSelector(ComponentClass);
                if(!componentSelector){
                    alert("Page Not declared in Module");
                    return;
                }
                let compWrapperEl = document.querySelector(`${defaultOutlet}`);
                let removeElementComp = document.querySelector(`${defaultOutlet} component`)
                if(removeElementComp){
                    removeChildComponents(removeElementComp.getAttribute("__id__"));
                }
                currentRouteComponent = createComponent(componentSelector,compWrapperEl);
            }
        }
    }

    return {
        bootstrap
    }
}