import { LightningElement, api, wire, track } from 'lwc';
import { subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import createOrder from '@salesforce/apex/MenuController.createOrder';

import ORDERMC from '@salesforce/messageChannel/OrderMessageChannel__c';
export default class CurrentOrder extends LightningElement {

    recordId;

    @track orderItems = [];
    @track totalCost = 0;

    @track isModalOpen = false;


    order;

    @wire(MessageContext)
    messageContext;

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
        orderItem.Cost__c = itemCost;
        this.totalCost += itemCost;
        this.orderItems.push(orderItem);
    }

     connectedCallback() {
        this.subscribeToMessageChannel();
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
	
    handleMakeAnOrder() {
        
         let newOrder = { 'sobjectType': 'Customer_Order__c' };
         // newOrder.Comment__c = 'hi';

        createOrder({ order: newOrder, items: this.orderItems})
        .then((result) => {
        })
        .catch((error) => {
            this.error = error;
        });
    }

    removeItem(event){
      console.debug(event.detail.value);
        for(var i = 0; i < this.orderItems.length; i++){
            if(this.orderItems[i].Id === event.detail.value.Id){
                this.orderItems.slice(i, 1);
            }  
        } 

    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
}