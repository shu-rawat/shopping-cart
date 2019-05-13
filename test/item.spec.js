
import Item from "../src/models/cartItem";
describe("cart item", function(){
    let item;
    beforeEach(function(){     
        item = new Item("id",100,0,"name","imageURL","description",10,"category","sku");
    });

    describe("increaseCount()",function(){
        
        it("expects item quantity 2 when current qty is 1",function(){
            item.quantity = 1;
            expect(item.increaseCount()).toBe(2);
        });

        it("expects item quantity 1 when current qty is 0",function(){
            item.quantity = 0;
            expect(item.increaseCount()).toBe(1);
        });

    });


    describe("decreaseCount()",function(){

        it("expects item quantity 0 when current qty is 1",function(){
            item.quantity = 1;
            expect(item.decreaseCount()).toBe(0);
        });

        it("expects item quantity 1 when current qty is 2",function(){
            item.quantity = 2;
            expect(item.decreaseCount()).toBe(1);
        });

    });

    describe("getTotalAmount()",function(){

        it("expects totalAmount 108 when qty is 12 and price is 9",function(){
            item.quantity = 12;
            item.price = 9;
            expect(item.getTotalAmount()).toBe(108);
        });

        it("expects totalAmount 0 when qty is 12 and price is 0",function(){
            item.quantity = 12;
            item.price = 0;
            expect(item.getTotalAmount()).toBe(0);
        });

        it("expects totalAmount 0 when qty is 0 and price is 12",function(){
            item.quantity = 0;
            item.price = 12;
            expect(item.getTotalAmount()).toBe(0);
        });
     
    });


   
});