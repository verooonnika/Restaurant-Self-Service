import { LightningElement, api, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/OrderMessageChannel__c'; 
export default class MenuItem extends LightningElement {
    @api dish;
    @wire(MessageContext)
    messageContext;

    @track isModalOpen = false;
    @track itemTotal;
    amount = 1;
	
    handleOpenRecordClick() {
        const message = {
            dish: this.dish,
            amount: this.amount
        };
        publish(this.messageContext, ORDERMC, message);
        this.closeModal();
    }

    handleAmountChange(event) {
        this.amount = event.detail.value;
        this.itemTotal = this.amount * this.dish.Price__c;
    }
   

    openModal() {
      //  this.dish.Price__c = 0;
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }
    submitDetails() {
        this.isModalOpen = false;
    }
}