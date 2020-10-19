import { LightningElement, api } from 'lwc';

export default class OrderDetails extends LightningElement {

    @api orderItems;
    @api totalCost;

    get isPresentItems(){
        return this.orderItems.length > 0;
    }

    removeItem(event){
        for (var i = this.orderItems.length - 1; i >= 0; i--) {
            if (this.orderItems[i].Dish__c === event.target.value) {
             this.orderItems.splice(i, 1);
            }
           }
    }

    closeModal() {
        const selectedEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(selectedEvent);
    }
}