import CartModel from '../client-src/models/cartModel';

describe("cart model", function () {
    let cartModel;
    let product;
    beforeEach(function () {
        cartModel = new CartModel();
        product = {
            "name": "Fresho Kiwi",
            "imageURL": "/kiwi-green.jpg",
            "description": "Kiwis are oval shaped.",
            "price": 87,
            "stock": 50,
            "category": "5b6899953d1a866534f516e2",
            "sku": "fnw-kiwi-3",
            "id": "1"
        };
        cartModel.products = [product];
        cartModel.items = [];
    });

    describe("addItemCount(id)", function () {

        it("should return cart item when passed id as 1", function () {
            let addedItem = cartModel.addItemCount("1");
            expect(addedItem).toBeTruthy();
        });

        it("returned cart item should have quantity 1 when passed id as 1", function () {
            let addedItem = cartModel.addItemCount("1");
            expect(addedItem.quantity).toBe(1);
        });

        it("returned cart item should have quantity 2 when passed id as 1 twice", function () {
            cartModel.addItemCount("1");
            let addedItem = cartModel.addItemCount("1");
            expect(addedItem.quantity).toBe(2);
        });

        it("should return null when passed wrong id as 0", function () {
            expect(cartModel.addItemCount("0")).toBeFalsy();
        });

    });

    describe("removeItemCount(id)", function () {

        it("should return null when passed id as 2", function () {
            let addedItem = cartModel.removeItemCount("2");
            expect(addedItem).toBe(null)
        });

        it("should return null when passed id as 1", function () {
            let addedItem = cartModel.removeItemCount("1");
            expect(addedItem).toBe(null)
        });

        it("returned cart item should have quantity 0 when passed id as 1", function () {
            cartModel.addItemCount("1");
            let addedItem = cartModel.removeItemCount("1");
            expect(addedItem.quantity).toBe(0);
        });

        it("returned cart item should have quantity 1 when passed id as 1", function () {
            cartModel.addItemCount("1");
            cartModel.addItemCount("1");

            let addedItem = cartModel.removeItemCount("1");
            expect(addedItem.quantity).toBe(1);
        });

        it("should push cart item in items when passed id as 1", function () {
            cartModel.addItemCount("1");
            expect(cartModel.items.length).toBe(1);
        });

        it("should remove cart item from items when passed id as 1", function () {
            cartModel.addItemCount("1");
            cartModel.removeItemCount("1");
            expect(cartModel.items.length).toBeFalsy();
        });

    });


    describe("getTotalAmount() and getTotalQty", function () {
        beforeEach(function () {
            cartModel.products = [{
                "name": "Fresho Kiwi",
                "imageURL": "/kiwi-green.jpg",
                "description": "Kiwis are oval shaped.",
                "price": 50,
                "stock": 10,
                "category": "5b6899953d1a866534f516e2",
                "sku": "fnw-kiwi-3",
                "id": "1"
            }, {
                "name": "Fresho Kiwi",
                "imageURL": "/kiwi-green.jpg",
                "description": "Kiwis are oval shaped.",
                "price": 10,
                "stock": 50,
                "category": "5b6899953d1a866534f516e2",
                "sku": "fnw-kiwi-3",
                "id": "2"
            }];
            cartModel.addItemCount("1");
            cartModel.addItemCount("2");
            cartModel.addItemCount("2");
            cartModel.addItemCount("2");
        })

        it("should return 80 when cart items have item as {qty: 1, price:50} and {qty:3,price:10}", function () {
            expect(cartModel.getTotalAmount()).toBe(80);
        });

        it("should return 5 when cart item added 3 times", function () {
            cartModel.items = [];
            cartModel.addItemCount("2");
            cartModel.addItemCount("1");
            cartModel.addItemCount("1");
            expect(cartModel.getTotalQty()).toBe(3);
        });

    });

    describe("getItem()",function(){

        it("should return item with id 1",function(){
            let addedItem = cartModel.addItemCount("1");
            expect(cartModel.getItem("1").id).toBe("1");
        });

        it("should return falsy with id 1",function(){
            expect(cartModel.getItem("1")).toBeFalsy();
        });

    });

    describe("findProductById()",function(){

        it("should return product with id 1",function(){
            expect(cartModel.findProductById("1").id).toBe("1");
        });

        it("should return falsy with id 1",function(){
            expect(cartModel.findProductById("2")).toBeFalsy();
        });

    });

});