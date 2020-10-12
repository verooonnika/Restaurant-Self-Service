import { LightningElement, wire } from 'lwc';
import getAllDishes from '@salesforce/apex/MenuController.getAllDishes';
export default class Menu extends NavigationMixin(LightningElement) {
	@wire(getAllDishes) dishes;

    handleDishView(event) {

	}
}