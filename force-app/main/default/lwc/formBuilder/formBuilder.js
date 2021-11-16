/**
 * @description       : parent lwc component for storing all form builder configuration elements in
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api } from 'lwc';

import getForm from '@salesforce/apex/FormBuilderHelper.getForm';
import deletePage from '@salesforce/apex/FormBuilderHelper.deletePage';

export default class FormBuilder extends LightningElement {

    @api recordId;

    openAddTextModal = false;
    openAddQuestionModal = false;
    openAddSectionModal = false;
    openAddPageModal = false;
    isLoaded = false;

    formPages;
    pagesPicklist;
    allowDeletePage = false;
    errors;

    connectedCallback(){
        this.handleGetForm();
    }

    errorCallback(error){
        this.errors = error;
    }


    // apex method that pulls in the form buidler wrapper class
    handleGetForm() {
        getForm({
           recordId: this.recordId
        })
        .then((results) => {
            this.formPages = results.pages;
            this.allowDeletePage = results.displayDeletePageButton;
            this.isLoaded = true;
            this.errors = undefined;
            var arrayLength = this.formPages.length;
            const availablePages = [];
            for (var i = 0; i < arrayLength; i++) {
                const page = this.formPages[i];
                if(page.title != null){
                    availablePages.push({'label': page.title, 'value': page.pageId});
                }
            }
            this.pagesPicklist = availablePages;
        })
        .catch((error) => {
            console.error('error handleGetForm > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    // function to delete page
    handleDeletePage(formPageId) {
        deletePage({
           recordId: formPageId,
           formId: this.recordId
        })
        .then((results) => {
            this.handleGetForm();
            this.errors = undefined;
        })
        .catch((error) => {
            console.error('error handleDeletePage > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    // global page action buttons

    // handle add text button
    handleAddText(event) {
        this.openAddTextModal = true;
    }

    // handle add question button
    handleAddQuestion(event) {
        this.openAddQuestionModal = true;
    }

    // handle add new page button
    handleAddNewPage(event) {
        this.openAddPageModal = true;
    }

    // handle add section button
    handleAddSection(event) {
        this.openAddSectionModal = true;
    }

    // despatched events

    // add text close modal event
    handleCloseAddTextModal(event) {
        this.openAddTextModal = false;
    }

    // add text with a background save event close modal event
    handleCloseSaveAddTextModal(event) {
        this.openAddTextModal = false;
        this.isLoaded = false;
        this.formPages = null;
        this.handleGetForm();
    }

    // add question close modal event
    handleCloseAddQuestionModal(event) {
        this.openAddQuestionModal = false;
    }

    // add section with a background save event close modal event
    handleCloseSaveAddSectionModal(event) {
        this.openAddSectionModal = false;
        this.isLoaded = false;
        this.formPages = null;
        this.handleGetForm();
    }

    // add section close modal event
    handleCloseAddSectionModal(event) {
        this.openAddSectionModal = false;
    }

    // add page with a background save event close modal event
    handleCloseSaveAddPageModal(event) {
        this.openAddPageModal = false;
        this.handleGetForm();
    }

    // add page close modal event
    handleCloseAddPageModal(event) {
        this.openAddPageModal = false;
    }

    // add question with a background save event close modal event
    handleCloseSaveAddQuestionModal(event) {
        this.openAddQuestionModal = false;
        this.handleGetForm();
    }

    // handle the delete page request
    handlePageDelete(event) {
        this.handleDeletePage(event.detail); 
    }

    handleSectionDeleted(event){
        this.isLoaded = false;
        this.formPages = null;
        this.handleGetForm();
    }
}