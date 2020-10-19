import { LightningElement, api, track } from 'lwc';

export default class Paginator extends LightningElement {
    @api page;
    @api pages;
    @api numberPerPage = 8;

    get options() {
        return [
            { label: '8', value: '8' },
            { label: '16', value: '16' },
            { label: '32', value: '32' },
        ];
    }

    get showPreviousButton() {
        return !(this.page > 1);
    }

    get showNextButton() {
        return !(this.page < this.pages);
    }

    handlePagePrevious() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    handlePageNext() {
        this.dispatchEvent(new CustomEvent('next'));
    }

    handleChangeNumberPerPage(event) {
        this.numberPerPage = event.target.value;
        this.dispatchEvent(new CustomEvent('changenumberperpage', { detail: this.numberPerPage }));
    }
}