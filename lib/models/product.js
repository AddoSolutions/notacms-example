const PageModel = require("../pageModel")


class Product extends PageModel{

    constructor(data){
        super(data);
        this.url = this.getUrl();
    }

    getTemplateFile(){
        return "product";
    }

    static getBaseUrl(){
        return "/product"
    }

}

module.exports = Product;