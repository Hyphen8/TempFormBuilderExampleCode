/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   11/05/2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api, track } from 'lwc';

import { updateRecord } from 'lightning/uiRecordApi';
import ID_FIELD from '@salesforce/schema/Form_Section__c.Id';
import TITLE_FIELD from '@salesforce/schema/Form_Section__c.Title__c';
import DISPLAY_TITLE_FIELD from '@salesforce/schema/Form_Section__c.Display_Title__c';

import deleteSection from '@salesforce/apex/FormBuilderHelper.deleteSection';

export default class FormBuilderSection extends LightningElement {

    editTitle = true;

    @track currentSection;
    displaySectionTitle;
    sectionTitle;

    backupSection;

    @api 
    get section(){
        return this._section;
    };
    set section(value){
        this._section = value;
        this.backupSection = value;
        this.currentSection = value;
        this.displaySectionTitle = value.displayTitle;
        this.sectionTitle = value.title;
    }

    @api allowSectionDelete = false;

    // section settings edit button
    handleEdit(event) {
        this.editTitle = false;
    }

    // section settings save button
    handleSave(event) {
        this.handleUpdateFormSection();
    }

    // update section record
    handleUpdateFormSection(){
        const fields = {};
        fields[ID_FIELD.fieldApiName] = this.section.sectionId;
        fields[TITLE_FIELD.fieldApiName] = this.sectionTitle;
        fields[DISPLAY_TITLE_FIELD.fieldApiName] = this.displaySectionTitle;
        const recordInput = { fields }
        updateRecord(recordInput)
        .then(() => {
            this.editTitle = true;
        })
        .catch(error => {
            console.error('Error saving form page title > ' + JSON.stringify(error));
        });
    }

    handleDelete() {
        deleteSection({
           recordId: this.currentSection.sectionId
        })
        .then((results) => {
            this.dispatchEventFunction('sectiondeleted');
            this.errors = undefined;
        })
        .catch((error) => {
            console.error('error handleDelete > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    storeDisplayTitle(event){
        let displayTitleValue = event.target.checked;
        this.displaySectionTitle = displayTitleValue;
    }

    storeTitle(event){
        let titleValue = event.target.value;
        this.sectionTitle = titleValue;
    }

    handleDeleteQuestion(event){
        this.dispatchEventFunction('sectiondeleted');
    }

    handleCancel(event){
        this.editTitle = true;
        this.displaySectionTitle = this.backupSection.displayTitle;
        this.sectionTitle = this.backupSection.title;
    }


    // generic dispatch event function
    dispatchEventFunction(eventName, eventDetail) {
       this.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
    }
}