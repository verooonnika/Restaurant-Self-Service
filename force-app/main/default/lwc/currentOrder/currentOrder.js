import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/OrderMessageChannel__c';
export default class CurrentOrder extends LightningElement {
    
    recordId;

    @track order;
    @track orderItems = [];
   // @api totalCost = 0;

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
        orderItem.Dish__c = this.recordId.Id; 
        orderItem.Quantity__c = message.amount;
        orderItem.Total_Item_Cost__c = itemCost;
        this.orderItems.push(orderItem);
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

    get totalCost(){
        var totalCost = 0;
        this.orderItems.forEach(element => {
            totalCost += element.Total_Item_Cost__c;
        });
        return totalCost;
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