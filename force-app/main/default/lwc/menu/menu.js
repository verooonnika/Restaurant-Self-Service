import { LightningElement, wire, track } from 'lwc';
import getAllDishes from '@salesforce/apex/MenuController.getAllDishes';

import {getObjectInfo} from 'lightning/uiObjectInfoApi';
import DISH_OBJECT from '@salesforce/schema/Dish__c';
import {getPicklistValues} from 'lightning/uiObjectInfoApi';
import CATEGORY_FIELD from '@salesforce/schema/Dish__c.Category__c';
import SUBCATEGORY_FIELD from '@salesforce/schema/Dish__c.SubCategory__c';
export default class Menu extends LightningElement {

	@track categoryOptions;
	@track subCategoryOptions;

	@track category = 'All';
	@track subCategory = 'All';

	@wire(getAllDishes, {category: '$category', subCategory: '$subCategory' }) dishes;
	
	@wire(getObjectInfo, {objectApiName: DISH_OBJECT })
	dishInfo;

    @track page = 1;
    @track numberPerPage = 8;
    @track pages = [];
    set_size = 5;

	get currentPageData(){
		console.debug(this.pageData());
        return this.pageData();
	}
	
	pageData = ()=>{
        let page = this.page;
        let perpage = this.numberPerPage;
        let startIndex = (page*perpage) - perpage;
        let endIndex = (page*perpage);
        return this.dishes.data.slice(startIndex,endIndex);
	 }
	 
	previousHandler() {
        if (this.page > 1) {
            this.page = this.page - 1;
        }
    }

    nextHandler() {
        this.page = this.page + 1;
	}
	
	changeNumberHandler(event){
		this.numberPerPage = event.detail;
	}
   
    @wire(getPicklistValues, {recordTypeId: '$dishInfo.data.defaultRecordTypeId', fieldApiName: SUBCATEGORY_FIELD })
    subCategoryFieldInfo({ data, error }) {
        if (data) this.subCategoryFieldData = data;
    }
    @wire(getPicklistValues, {recordTypeId:'$dishInfo.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD })
    categoryFieldInfo({ data, error }) {
        if (data) this.categoryOptions = data.values;
	}
	
    handleCategoryChange(event) {
        let key = this.subCategoryFieldData.controllerValues[event.target.value];
		this.subCategoryOptions = this.subCategoryFieldData.values.filter(opt => opt.validFor.includes(key));
		this.category = event.target.value;
	}

	handleSubCategoryChange(event) {
		this.subCategory = event.target.value;
	}

}