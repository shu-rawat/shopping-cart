export class Component{
    querySelector(queryString){
        return document.querySelectorAll(`component[__id__='${this.__id__}'] ${queryString}`)
    };
}