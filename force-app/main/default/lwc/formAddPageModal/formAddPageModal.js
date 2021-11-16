/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @group             : 
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   05-11-2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api } from 'lwc';

import addPage from '@salesforce/apex/FormBuilderCreationMethods.addPage';

export default class FormAddPageModal extends LightningElement {

    @api recordId;
    @api openModal;

    noSaveAllowed = true;

    selectLocation;
    selectedPage;
    pageTitle;
    displayPageTitle = false;

    @api pages;
    
    get beforeAfter() {
        return [
            { label: 'Before', value: 'before' },
            { label: 'After', value: 'after' },
        ];
    }

    handleAddNewPage() {

        var newPage = {'title': this.pageTitle, 'displayTitle': this.displayPageTitle, 
                        'pageId': this.selectedPage, 'beforeAfter': this.selectLocation,
                        'formId': this.recordId};

        addNewPage({
            page: JSON.stringify(newPage)
        })
        .then((results) => {
            this.saveModal();
            this.errors = undefined;
        })
        .catch((error) => {
            console.error('error handleAddNewPage > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    handleLocationSelectionChange(event){
        this.selectLocation = event.detail.value;
        this.validForSave();
    }

    handlePageSelectionChange(event){
        this.selectedPage = event.detail.value;
        this.validForSave();
    }

    storeDisplayTitle(event){
        this.displayPageTitle = event.target.checked;
        this.validForSave();
    }

    storeTitle(event){
        this.pageTitle = event.target.value
        this.validForSave();
    }

    validForSave(){
        let location = this.selectLocation;
        let page = this.selectedPage;
        let title = this.pageTitle;
        if(location != null && page != null && title != null){
            this.noSaveAllowed = false;
        } else {
            this.noSaveAllowed = true;
        }
    }

    cleanModal(){
        this.selectLocation = null;
        this.pageTitle = null;
        this.displayPageTitle = false;
        this.selectedPage = null;
    }

    closeModal(event){
        this.cleanModal();
        this.dispatchEventFunction('closemodal');
    }

    saveModal(event){
        this.cleanModal();
        this.dispatchEventFunction('closesavemodal');
    }

    // generic dispatch event function
    dispatchEventFunction(eventName, eventDetail) {
       this.dispatchEvent(new CustomEvent(eventName, { eventDetail }));
    }
    
}