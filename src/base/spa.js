//accepts moduleConfig object having declarations as object
// having key as component-selector
// and value as component for registering component with root module. 
function Module(moduleConfig) {

    if (moduleConfig.declarations) {
        this.registeredComponents = moduleConfig.declarations;
    }

    //returns component selector for Paticular Component
    this.findSelector = function (ComponentClass) {
        let foundSelector = '';
        Object.keys(this.registeredComponents).forEach(selector => {
            if (this.registeredComponents[selector] == ComponentClass) {
                foundSelector = selector;
            }
        });
        return foundSelector;
    }
}

export default function SPA(routes, moduleConfig) {
    //initializing data required for spa
    let initialPage = window.location.href.split("#")[1];
    const router = Object.freeze({
        navigateByURL
    });

    initialPage = initialPage ? initialPage : '';
    let rootModule = new Module(moduleConfig);
    let currentRoute = null;
    let activeComponents = {};
    let maxCompId = 0;
    let routeParams = {};
    let currentRouteParams = {};
    let serviceObjs = [];
    let currentRouteComponent;
    const defaultOutlet = "router-outlet";

    //registers services to the spa
    function initServices() {
        //checks for providers in module config object.
        if (moduleConfig.providers && moduleConfig.providers.length) {
            //instantiated each service and store it in serviceObjs array.            
            serviceObjs = moduleConfig.providers.map((ServiceClass) => {
                return { class: ServiceClass, object: new ServiceClass() };
            });

        }
    }

    //bootstraping spa.
    function bootstrap() {
        //listening for route change based on hash change strategy.
        //spa is implemented with hash change.
        window.onhashchange = function (e) {
            
            console.log("new url",e.newURL,e);
            let pageName = location.href.split("#")[1];
            if (!pageName) {
                pageName = '';
            }
            //naviating to the page
            navigateToPage(pageName);
        }
        //calls initServices for registering service.
        initServices();
        //resolves child components which are used in html with <component comp-selector="comp-selector"/>
        resolveChildComponents();
        //initially loads route page as given as initialPage
        navigateToPage(initialPage);
    }

    //it returns next component id 
    // used for unique component ids.
    function getNextCompId() {
        ++maxCompId;
        return maxCompId;
    }

    //function resolves child components 
    //findes all child compnents and calls createComponent for creating child component.
    function resolveChildComponents(outletName = "layout-outlet", __id__ = -1, resolvedObj) {
        let childComponentTags = document.querySelectorAll(`${outletName}[__id__='${__id__}']  component`);
        Array.from(childComponentTags, function (componentWrapperEl) {
            let componentSelector = componentWrapperEl.getAttribute("comp-selector");
            createComponent(componentSelector, componentWrapperEl, resolvedObj);
        });
    }

    //it removes child components from dom for that particular component based on it's id 
    function removeChildComponents(__id__) {
        //finding all childrend component tags that needs to be removed.
        let childComponentTags = document.querySelectorAll(`component[__id__='${__id__}']  component`);
        let compIdsToRemove = [];

        //pushing all component ids in  compIdsToRemove array.
        Array.from(childComponentTags, function (componentWrapperEl) {
            let componentId = componentWrapperEl.getAttribute("__id__");
            compIdsToRemove.push(componentId);
        });

        //sorting all component ids based on children level as deepest child compnent of this component will 
        //have highest id amongst all its' children components.
        //so that component will be destroyed after all it's children gets destroyed. or destroying children first.
        compIdsToRemove = compIdsToRemove.sort().reverse();

        //calling destroy method and removing it from active components. 
        //for each component to destroy
        compIdsToRemove.map(compId => activeComponents[compId])
            .forEach(componentInstance => {
                componentInstance.destroy();
                delete activeComponents[componentInstance.__id__]
            });
        //finally destroying component whose children component destroyed above.
        activeComponents[__id__].destroy();
        delete activeComponents[__id__];
    }

    //it creates component
    //it accepts component selector, wrapper element and object 
    //that has been resolved and required by component before it instantiates.    
    function createComponent(componentSelector, componentWrapperEl, resolvedObj) {
        let ComponentClass = rootModule.registeredComponents[componentSelector];
        //checks for valid component class
        if (ComponentClass) {
            let component = new ComponentClass(router);
            //assigning resolved object for component
            component.data = resolvedObj;
            //assigning router object for navigating programmatically
            component.router = router;
            //assigning initial route params
            component.routeParams = routeParams;
            //setting unique id for component.
            Object.defineProperty(component, "__id__", {
                value: getNextCompId(),
                configurable: false,
                writable: false
            });

            //attaching creatd comopnent object with its id in activeComponents object
            activeComponents[component.__id__] = component;
            //calling init hook for inititializing component.
            component.init();

            //checking if component needs to render is part of route.
            //and rendering it into dom
            if (componentWrapperEl.tagName == "ROUTER-OUTLET") {
                componentWrapperEl.innerHTML = `<component comp-selector='${component.selector}'
                __id__='${component.__id__}'>
                    ${component.hbsTemplate(component.state)}
                </component`;
            }
            else {
                componentWrapperEl.setAttribute("__id__", component.__id__);
                componentWrapperEl.innerHTML = component.hbsTemplate(component.state);
            }
            //resolving created component's child components.
            resolveChildComponents("component", component.__id__, resolvedObj);
            //after component's child component also gets created and rendered to dom
            //calling after view has been initialized for created component.
            component.afterViewInit();
            //finally returns component instance
            return component;
        }
        else {
            //when compnoent class is not found.
            alert(`component with selector name ${componentSelector} not found in module`);
            return null;
        }
    }

    //function for navigating to url by javascript
    function navigateByURL(url) {
        history.pushState({}, null, `#${url}`);
        navigateToPage(url);
    }

    //function called for navigating to page.
    async function navigateToPage(_pageName) {
        let pathFragments = _pageName.split("/");
        let ComponentClass;
        let routeMatched = null;
        routeParams = {};
        //when path fragment length is one
        if (pathFragments.length == 1) {
            ComponentClass = undefined;
            //checking if it is present in routes
            if (routes[_pageName]) {
                ComponentClass = routes[_pageName].component
                routeMatched = _pageName;
            }
        }
        else {
            let allRoutes = Object.keys(routes);
            let routeMatchedFragments;
            //checking for route that is matched against path.
            routeMatched = allRoutes.find(route => {
                let routeFragments = route.split("/");
                if (routeFragments.length == pathFragments.length) {
                    let fragMatched = routeFragments.every(function (routeFragment, index) {
                        if (!routeFragment.includes(":")) {
                            return routeFragment == pathFragments[index];
                        }
                        return true;
                    });
                    routeMatchedFragments = fragMatched ? routeFragments : null;
                    return fragMatched;
                }
                return false;
            });

            //when route is found.
            if (routeMatched) {
                //checks if route has any dynamic route params
                if (routeMatched.includes(":")) {
                    routeMatchedFragments.map(function (fragment, index) {
                        if (fragment.includes(":")) {
                            let param = fragment.split(":")[1];
                            routeParams[param] = pathFragments[index];
                        }
                    }, {});
                }
                //finding Component Class for that particular route matched.
                ComponentClass = routes[routeMatched].component;
            }
        }
        //if Component is not registered.
        if (!ComponentClass) {
            alert("Page Not Registered With Routes");
            return;
        }
        else {
            //if component requires any data to resolve before it gets instantiated.
            //it will resolve data and wait for it.
            let resolvedObj = await updateResolveObj(routeMatched, _pageName);

            //checks if current route is same route matched or the component that was previously rendered is
            //the same that needs to be rendered now for different route.
            if (currentRoute == routeMatched || routes[currentRoute] == routes[routeMatched]) {
                currentRoute = routeMatched;
                let a = JSON.stringify(routeParams);
                let b = JSON.stringify(currentRouteParams);
                //here component does not gets re instantiated just route params or resolved data gets passed
                if (currentRouteComponent && a != b) {
                    currentRouteComponent.data = resolvedObj;
                    //when routed params are different 
                    //component is notified through routePramsChanged life cycle hook
                    currentRouteComponent.routePramsChanged(routeParams);
                }
                return;
            }
            else {
                //when new compnent needs to be rendered in dom
                currentRoute = routeMatched;
                let componentSelector = rootModule.findSelector(ComponentClass);
                //checks wheather component is registered with module or not.
                if (!componentSelector) {
                    alert("Page Not declared in Module");
                    return;
                }
                let compWrapperEl = document.querySelector(`${defaultOutlet}`);
                let removeElementComp = document.querySelector(`${defaultOutlet} component`)
                //removes or destroys previous loaded components.
                if (removeElementComp) {
                    removeChildComponents(removeElementComp.getAttribute("__id__"));
                }
                //then creates new component to load.
                currentRouteComponent = createComponent(componentSelector, compWrapperEl, resolvedObj);
            }
        }
    }

    //function for resolving data that is provided in route configuration 
    //for it's resolving.
    async function updateResolveObj(routeMatched, _pageName){
        let resolvedObj = {};
        if (routes[routeMatched].resolve) {            
            let resolveObj = routes[routeMatched].resolve;
            //resolveObj is the object that needs to be resolved for this component at routeMatched.
            for (let dataKey of Object.keys(resolveObj)) {
                //each key that needs to be resolved is iterated.
                //finding the resolver service instance for resolving this key
                let serviceObjConf = serviceObjs.find(obj => {
                    return obj.class == resolveObj[dataKey];
                });                
                if (serviceObjConf) {
                    //service that has to resolve this key is found
                    //calling resolve method of that resolver instance
                    //and wating for it to resolve and assining the resolved data to resolvedObj
                    //this resolvedObj will passed to component.
                    resolvedObj[dataKey] = await serviceObjConf.object.resolve(_pageName, routeParams);
                }
            }
        }
        return resolvedObj;
    }


    return {
        bootstrap
    }
}