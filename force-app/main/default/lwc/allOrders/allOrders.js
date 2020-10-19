import { LightningElement, track, wire } from "lwc";
import getOrdersByUser from "@salesforce/apex/MenuController.getOrdersByUser";
import CUSTOMER_ORDER_OBJECT from '@salesforce/schema/Customer_Order__c';
import STATUS_FIELD from '@salesforce/schema/Customer_Order__c.Status__c';
import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';

export default class ModalPopupLWC extends LightningElement {

    @track orders = [];
    @track filteredOrders = [];

    @track statusOptions = []; 
    @track dateOptions=[]; 
    @track dishesOptions = [];
   
    @track totalPrice = 0.0;

    @track status;
    @track orderDate;
    @track orderDish;

    @track isModalOpen = false;

    @wire(getObjectInfo, {objectApiName: CUSTOMER_ORDER_OBJECT })
    orderInfo;
    
    @wire(getPicklistValues, {recordTypeId: '$orderInfo.data.defaultRecordTypeId', fieldApiName: STATUS_FIELD })
    statusFieldInfo({ data, error }) {
        if (data) this.statusOptions = data.values;
    }

    connectedCallback() {
        this.getOrders();
        this.status = 'All';
        this.orderDate = 'All';
        this.orderDish = 'All';        
    }

    getOrders() {
        getOrdersByUser()
        .then(result => {
        this.orders = result;
        this.filteredOrders = result;
        this.getDateOptions(result);
        this.getDishOptions(result);
        this.calculateTotalPrice();
        })
        .catch(error => {
        this.error = error;
        })
    }

    filterOrders() {
        this.filteredOrders = this.orders;
    
        if(this.status != 'All') {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                return order.Status__c == this.status;
            })
        }
    
        if(this.orderDate != 'All') {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                return order.Order_Date__c == this.orderDate;
            })
        }
    
        if(this.orderDish != 'All') {
            this.filteredOrders = this.filteredOrders.filter((order) => {
                let orderItems = order.Order_Items__r;
                orderItems = orderItems.filter((orderItem) => {
                    return orderItem.Dish__r.Name == this.orderDish;
                });
            return orderItems.length > 0;
          });
        }
    }

    handleStatusChange(event) {
        this.status = event.detail.value;
        this.filterOrders();
        this.calculateTotalPrice();
    }

    handleDateChange(event) {
        this.orderDate = event.detail.value;
        this.filterOrders();
        this.calculateTotalPrice();
    }

    handleDishChange(event) {
        this.orderDish = event.detail.value;
        this.filterOrders();
        this.calculateTotalPrice();
    }   

    getDateOptions(result){
        this.dateOptions = [{label:'--All--', value:'All'}];
        const setOfDate = new Set();
        result.forEach(element => {
            let date = element.Order_Date__c;
            setOfDate.add(date);
        });

        setOfDate.forEach(element => {
            this.dateOptions.push({value: element , label: element});
        });
    }

    getDishOptions(result){
        this.dishesOptions = [{label:'--All--', value:'All'}];
        const setOfDishes = new Set();
        result.forEach((order) => {
            const orderItems = order.Order_Items__r;

            orderItems.forEach((orderItem) => {
                setOfDishes.add(orderItem.Dish__r.Name);
            });
        });
    
        const arrayOfDishes = [...setOfDishes];
    
        arrayOfDishes.forEach((dishName) => {
            this.dishesOptions.push({
                label: dishName,
                value: dishName
            })
        });
    }

    calculateTotalPrice(){

        this.filteredOrders.forEach((order) => {
            const orderItems = order.Order_Items__r;

            orderItems.forEach((orderItem) => {
                this.totalPrice += orderItem.Total_Item_Cost__c;
            });
        });

    }

    openModal() {
        this.isModalOpen = true;
    }
    closeModal() {
        this.isModalOpen = false;
    }

}
