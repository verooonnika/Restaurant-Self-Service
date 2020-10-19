import { LightningElement, track, api } from 'lwc';
import createOrder from "@salesforce/apex/MenuController.createOrder";


export default class MakeAnOrder extends LightningElement {

    @track isDelivery;
    @api orderItems;
    @api totalCost;

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

       createOrder({ order: newOrder, items: this.orderItems})
       .then((result) => {
        const orderCreatedEvent = new CustomEvent('ordercreated', {detail: false});
        this.dispatchEvent(orderCreatedEvent);
       })
       .catch((error) => {
           this.error = error;
       });
   }

   closeOrderModal() {
    const closeEvent = new CustomEvent('closemodal', {detail: false});
    this.dispatchEvent(closeEvent);
}
}