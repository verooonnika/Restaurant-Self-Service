import { LightningElement, api, wire, track } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import ORDERMC from '@salesforce/messageChannel/orderMessageChannel__c'; 
export default class MenuItem extends LightningElement {

    @api dish;
    @wire(MessageContext)
    messageContext;

    @track isModalOpen = false;
    amount = 1;

  
    get itemTotal(){
        return this.amount * this.dish.Price__c;
    }


    handleAddItemClick() {
        if(this.amount > 0 && this.amount <= 11){
            const message = {
                dish: this.dish,
                amount: this.amount
            };
            publish(this.messageContext, ORDERMC, message);
            this.closeModal();
        }
    }

    handleAmountChange(event) {
        this.amount = event.detail.value;
    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
        this.amount = 1;
    }

}