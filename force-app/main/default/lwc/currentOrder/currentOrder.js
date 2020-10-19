import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/OrderMessageChannel__c';
export default class CurrentOrder extends LightningElement {
    
    @track recordId;


    @track order;
    @track orderItems = [];
    @api totalCost = 0.0;

    @track isModalOpen = false;
    @track isMakeOrderModalOpen = false;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        this.subscribeToMessageChannel();
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

        var itemCost = message.amount * this.recordId.Price__c; ;
        let orderItem = { 'sobjectType': 'Order_Item__c'};
        orderItem.Dish__c = this.recordId.Id; ////////////////////////////// 
        orderItem.Quantity__c = message.amount;
        orderItem.Total_Item_Cost__c = itemCost;
        this.orderItems.push(orderItem);
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