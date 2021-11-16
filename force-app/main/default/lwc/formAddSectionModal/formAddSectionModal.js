/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @group             : 
 * @last modified on  : 14/05/2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   05-11-2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api} from 'lwc';

import getFormSections from '@salesforce/apex/FormBuilderHelper.getFormSections';
import addSection from '@salesforce/apex/FormBuilderCreationMethods.addSection';

export default class FormAddSectionModal extends LightningElement {

    @api recordId;
    @api openModal;

    noSaveAllowed = true;
    displaySections = false;

    selectLocation;
    selectedPage;
    selectedSection;
    sectionTitle;
    displaySectionTitle = false;

    @api pages;
    sections;

    get beforeAfter() {
        return [
            { label: 'Before', value: 'before' },
            { label: 'After', value: 'after' },
        ];
    }

    handleGetFormSections() {
        getFormSections({
           recordId: this.selectedPage
        })
        .then((results) => {
            console.log('results > ' + JSON.stringify(results));
            var arrayLength = results.length;
            const availableSections = [];
            for (var i = 0; i < arrayLength; i++) {
                const section = results[i];
                if(section.Title__c != null){
                    availableSections.push({'label': section.Title__c, 'value': section.Id});
                }
            }
            this.sections = availableSections;
            this.displaySections = true;
        })
        .catch((error) => {
            console.error('error handleGetFormSections > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    handleSaveSection() {

        var newSection = {'title': this.sectionTitle,'displayTitle': this.displaySectionTitle, 
                        'pageId': this.selectedPage, 'sectionId': this.selectedSection, 
                        'beforeAfter': this.selectLocation};

        var newSectionMap = [];
        newSectionMap.push({'title': this.sectionTitle});
        newSectionMap.push({'displayTitle': this.displaySectionTitle});
        newSectionMap.push({'pageId': this.selectedPage});
        newSectionMap.push({'sectionId': this.selectedSection});
        newSectionMap.push({'beforeAfter': this.selectLocation});

        console.log('sectionMap > ' + JSON.stringify(newSectionMap));

        addSection({
            section: JSON.stringify(newSection),
            sectionMap: newSectionMap
        })
        .then((results) => {
            this.saveModal();
            this.errors = undefined;
        })
        .catch((error) => {
            console.error('error handleSaveSection > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    handleLocationSelectionChange(event){
        this.selectLocation = event.detail.value;
        this.validForSave();
    }

    handlePageSelectionChange(event){
        this.selectedPage = event.detail.value;
        this.handleGetFormSections();
        this.validForSave();
    }

    handleSectionSelectionChange(event){
        this.selectedSection = event.detail.value;
        this.validForSave();
    }

    storeDisplayTitle(event){
        this.displaySectionTitle = event.target.checked;
        this.validForSave();
    }

    storeTitle(event){
        this.sectionTitle = event.target.value
        this.validForSave();
    }

    validForSave(){
        let location = this.selectLocation;
        let page = this.selectedSection;
        let title = this.sectionTitle;
        if(location != null && page != null && title != null){
            this.noSaveAllowed = false;
        } else {
            this.noSaveAllowed = true;
        }
    }

    cleanModal(){
        this.selectLocation = null;
        this.selectedSection = null;
        this.selectedPage = null;
        this.sectionTitle = null;
        this.displaySectionTitle = false;
        this.displaySections = false;
    }


    closeModal(event){
        this.cleanModal();
        this.dispatchEventFunction('closemodal');
    }

    saveModal(event){
        console.log('save modal fired');
        this.cleanModal();
        this.dispatchEventFunction('closesavemodal');
    }

    // generic dispatch event function
    // eventName should always be in lowercase and you need a oneventName to receive it
    // eventDetail can be anything you want detail: contactID
    dispatchEventFunction(eventName, eventDetail) {
       this.dispatchEvent(new CustomEvent(eventName, { eventDetail }));
    }
    
}