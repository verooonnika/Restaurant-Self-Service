import { LightningElement, api } from 'lwc';

export default class OrderDetails extends LightningElement {

    @api orderItems = [];
    @api totalCost;
    @api viewOrderItems;

  /*  get isPresentItems(){
        return this.orderItems.length > 0;
    } */

    get isOrderEmpty(){
        return this.orderItems.length < 1;
    }

    removeItem(event){
        console.debug(this.orderItems);
        const removeItemEvent = new CustomEvent('removeitem', {detail: event.target.value});
        this.dispatchEvent(removeItemEvent);

    }

    openOrderModal(){
        this.closeModal();
        const orderEvent = new CustomEvent('openordermodal', {detail: false});
        this.dispatchEvent(orderEvent);
    }

    closeModal() {
        const closeEvent = new CustomEvent('closemodal', {detail: false});
        this.dispatchEvent(closeEvent);
    }

}