public with sharing class MenuController {

    @AuraEnabled(cacheable = true)
    public static Dish__c[] getAllDishes(String category, String subCategory){

        System.debug(category + ' ' + subCategory);

        List<Dish__c> dishes = new List<Dish__c>();

        if(category == 'All'){
            dishes = [SELECT Id, Name, Category__c, SubCategory__c, Price__c, Description__c FROM Dish__c];

        } else if(subCategory == 'All'){
            dishes = [SELECT Id, Name, Category__c, SubCategory__c, Price__c, Description__c FROM Dish__c WHERE Category__c =: category];

        } else {
            dishes = [SELECT Id, Name, Category__c, SubCategory__c, Price__c, Description__c FROM Dish__c WHERE Category__c =: category AND SubCategory__c =: subCategory];

        }

        return dishes ;

    }

    @AuraEnabled
    public static void createOrder(Customer_Order__c order, List<Order_Item__c> items){
        System.debug('Order: ' + order + ' Items: ' +  items);
        order.Status__c = 'Accepted';
        insert order;

        for(Order_Item__c orderItem: items){
            orderItem.Customer_Order__c = order.Id;
        }

        insert items; 
        
    }

    @AuraEnabled(cacheable = true)
    public static Customer_Order__c[] getOrdersByUser(){ // by id
        Id currentUser = UserInfo.getUserId();
        return [SELECT Id, Name FROM Customer_Order__c WHERE OwnerId =: currentUser ];
        
    }

}
