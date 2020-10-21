import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/orderMessageChannel__c';
export default class CurrentOrder extends LightningElement {
    
    @track recordId;


    @track order;
    @track orderItems = [];
    @api totalCost = 0.0;
    viewOrderItems = [];

    @track isModalOpen = false;
    @track isMakeOrderModalOpen = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    get isOrderEmpty(){
        return this.orderItems.length < 1;
    }

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            ORDERMC, (message) => {
                this.handleMessage(message);
            });
    }

     handleMessage(message) {

        this.recordId = message.dish;
        console.debug(message.dish);

        var isItemExist = false;

        if(this.orderItems.length > 0){
            this.orderItems.forEach(orderItem => {
                if(orderItem.Dish__c === this.recordId.Id){
                    isItemExist = true;
                    orderItem.Quantity__c += message.amount;
                    orderItem.Total_Item_Cost__c = this.recordId.Price__c * orderItem.Quantity__c;
                }
                
            });    
        }

        if(!isItemExist){
            var itemCost = message.amount * this.recordId.Price__c; ;
            let orderItem = { 'sobjectType': 'Order_Item__c'};
            orderItem.Dish__c = this.recordId.Id; ////////////////////////////// 
            orderItem.Quantity__c = message.amount;
            orderItem.Total_Item_Cost__c = itemCost;

            let item  = {};
            item.Name = message.dish.Name;
            item.Quantity = message.amount;
            item.Cost = itemCost;
            item.Dish__c = this.recordId.Id;
            this.viewOrderItems.push(item);

            this.orderItems.push(orderItem);

        }
        this.calculateTotalCost();
    }

  
     dispatchToast(error) {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error loading',
                message: reduceErrors(error).join(', '),
                variant: 'error'
            })
        );
    }

    calculateTotalCost(){
        this.totalCost = 0.0;
        this.orderItems.forEach(element => {
            this.totalCost += element.Total_Item_Cost__c;
        });
    }

    clearCurrentOrder(){
        this.orderItems = [];
        this.totalCost = 0.0;
        this.isMakeOrderModalOpen = false;

    }

    removeItem(event){
        const dishId = event.detail;

        for (var i = this.orderItems.length - 1; i >= 0; i--) {
            if (this.orderItems[i].Dish__c === dishId) {
             this.orderItems.splice(i, 1);
            }
           }

        for (var i = this.viewOrderItems.length - 1; i >= 0; i--) {
            if (this.viewOrderItems[i].Dish__c === dishId) {
             this.viewOrderItems.splice(i, 1);
            }
           }
           this.calculateTotalCost();
    }

    openModal() {
        this.isModalOpen = true;
    }
    openOrderModal() {
        this.isMakeOrderModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    closeOrderModal() {
        this.isMakeOrderModalOpen = false;
    }
   
}