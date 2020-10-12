import { LightningElement, track, wire} from 'lwc';
import getOrdersByUser from '@salesforce/apex/MenuController.getOrdersByUser';

export default class ModalPopupLWC extends LightningElement {

    @track isModalOpen = false;
    @wire(getOrdersByUser) orders;


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