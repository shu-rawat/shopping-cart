export default  class TestService{
    constructor(){

    }

    async getProducts(){
        return fetch("/products/index.get.json").then(this.json2ToObj);
    }

    json2ToObj(json){
        return JSON.parse(json);
    }
}