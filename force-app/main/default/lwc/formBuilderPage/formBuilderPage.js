/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api, track } from 'lwc';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Form_Page__c.Id';
import TITLE_FIELD from '@salesforce/schema/Form_Page__c.Title__c';
import DISPLAY_TITLE_FIELD from '@salesforce/schema/Form_Page__c.Display_Page_Title__c';

export default class FormBuilderPage extends LightningElement {

    @api allowDeletePage = false;
    
    @track currentPage;
    backupPage;
    editTitle = true;
    displayPageTitle;
    pageTitle;

    
    @api 
    get page(){
        return this._page;
    };
    set page(value){
        this._page = value;
        this.currentPage = value;
        this.backupPage = value;
        this.displayPageTitle = value.displayTitle;
        this.pageTitle = value.title;
    }
    
    
    // page settings edit button
    handleEdit(event) {
        this.editTitle = false;
    }

    // page settings save button
    handleSave(event) {
        this.handleUpdateFormPage();
    }

    // delete page button
    handleDeletePage(event){
        this.dispatchEventFunction('deletepage', this.page.pageId);
    }

    // update page record
    handleUpdateFormPage(){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.page.pageId;
        fields[TITLE_FIELD.fieldApiName] = this.pageTitle;
        fields[DISPLAY_TITLE_FIELD.fieldApiName] = this.displayPageTitle;
        const recordInput = { fields }
        updateRecord(recordInput)
        .then(() => {
            this.editTitle = true;
        })
        .catch(error => {
            console.error('Error saving form page title > ' + JSON.stringify(error));
        });
    }

    storeDisplayTitle(event){
        let displayTitleValue = event.target.checked;
        this.displayPageTitle = displayTitleValue;
    }

    storeTitle(event){
        let titleValue = event.target.value;
        this.pageTitle = titleValue;
    }

    handleSectionDeleted(event){
        this.dispatchEventFunction('sectiondeleted');
    }

    handleCancel(event){
        this.editTitle = true;
        this.displayPageTitle = this.backupPage.displayTitle;
        this.pageTitle = this.backupPage.title;
    }

    // generic dispatch event function
    dispatchEventFunction(eventName, eventDetail) {
       this.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
    }
    
}