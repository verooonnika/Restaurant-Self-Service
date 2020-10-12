import { LightningElement, api, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/OrderMessageChannel__c'; 
export default class MenuItem extends LightningElement {
    @api dish;
    @wire(MessageContext)
    messageContext;
    amount = 1;
	
    handleOpenRecordClick() {
        console.debug(this.amount);
        const message = {
            dish: this.dish,
            amount: this.amount
        };
        publish(this.messageContext, ORDERMC, message);
    }

    handleAmountChange(event) {
        this.amount = event.detail.value;
    }
}