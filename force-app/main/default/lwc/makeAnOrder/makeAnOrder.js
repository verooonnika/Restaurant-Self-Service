import { LightningElement, track, api } from 'lwc';

export default class MakeAnOrder extends LightningElement {

    @track isDelivery;
    @api orderItems;
    @api totalPrice;

    get orderTypeOptions() {
        return [
            { label: 'Pick-Up', value: 'Pickup' },
            { label: 'Delivery', value: 'Delivery' },
        ];
    }

    handleOrderTypeChange(event) {
        const selectedOption = event.detail.value;
        if (selectedOption == 'Delivery')
        {
            this.isDelivery = true;
        }
        else
        {
            this.isDelivery = false;
        }
    }

    handleMakeAnOrder() {
        
        let newOrder = { 'sobjectType': 'Customer_Order__c' };
        // newOrder.Comment__c = '';

       createOrder({ order: newOrder, items: this.orderItems})
       .then((result) => {
       })
       .catch((error) => {
           this.error = error;
       });
   }

   closeModal() {
    const selectedEvent = new CustomEvent('closemodal', {detail: false});
    this.dispatchEvent(selectedEvent);
}
}