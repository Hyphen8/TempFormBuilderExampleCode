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

import getFormSections from '@salesforce/apex/FormBuilderHelper.getFormSections';
import getFormSectionQuestions from '@salesforce/apex/FormBuilderHelper.getFormSectionQuestions';
import addTextQuestion from '@salesforce/apex/FormBuilderCreationMethods.addTextQuestion';

export default class FormAddTextModal extends LightningElement {

    @api recordId;
    @api openModal;

    displayRichTextInput = false;
    displayLongTextInput = false;
    displayHeadingTextInput = false;
    
    noSaveAllowed = true;
    displaySections = false;
    displayQuestions = false;
    displayFirstQuestionText = false;

    selectLocation;
    selectedPage;
    selectedSection;
    selectedQuestion;
    selectedTextType;
    textTitle;
    displaySectionTitle = false;

    richTextValue;
    longTextValue;
    headerHeadingValue;

    @api pages;
    sections;
    questions;

    get textTypes() {
        return [
            { label: 'Heading - Large', value: 'Heading - Large' },
            { label: 'Heading - Medium', value: 'Heading - Medium' },
            { label: 'Heading - Small', value: 'Heading - Small' },
            { label: 'Normal', value: 'Normal' },
            { label: 'Rich Text', value: 'Rich Text' },
        ];
    }

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

    handleGetFormSectionQuestions() {
        getFormSectionQuestions({
           recordId: this.selectedSection
        })
        .then((results) => {
            var arrayLength = results.length;
            if(arrayLength > 0) {
                const availableQuestions = [];
                for (var i = 0; i < arrayLength; i++) {
                    const question = results[i];
                    if(question.Title__c != null){
                        availableQuestions.push({'label': question.Title__c, 'value': question.Id});
                    }
                }
                this.questions = availableQuestions;
                this.displayFirstQuestionText = false;
            } else {
                this.displayFirstQuestionText = true;
            }
            this.displayQuestions = true;
        })
        .catch((error) => {
            console.error('error handleGetFormSectionQuestions > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    handleSaveQuestion() {

        let richTextValue;
        let headingValue;
        if(this.selectedTextType == 'Rich Text'){
            richTextValue = this.richTextValue;
        } else if(this.selectedTextType == 'Normal'){
            headingValue = this.longTextValue;
        } else {
            headingValue = this.headerHeadingValue;
        }
        

        var question = {'title': this.textTitle, 'type': 'Text', 
                        'subtype': this.selectedTextType, 'sectionId': this.selectedSection, 
                        'questionId': this.selectedQuestion, 'textHeading': headingValue,
                        'textRichText': richTextValue};

        addTextQuestion({
            question: JSON.stringify(question)
        })
        .then((results) => {
            this.saveModal();
            this.errors = undefined;
        })
        .catch((error) => {
            console.error('error handleSaveQuestion > ' + JSON.stringify(error));
            this.errors = JSON.stringify(error);
       });
    }

    handleTextTypeSelectionChange(event){
        this.selectedTextType = event.detail.value;
        if(this.selectedTextType == 'Rich Text'){
            this.displayRichTextInput = true;
            this.displayLongTextInput = false;
            this.displayHeadingTextInput = false;
        } else if(this.selectedTextType == 'Normal'){
            this.displayRichTextInput = false;
            this.displayLongTextInput = true;
            this.displayHeadingTextInput = false;
        } else {
            this.displayRichTextInput = false;
            this.displayLongTextInput = false;
            this.displayHeadingTextInput = true;
        }
    }

    handleLocationSelectionChange(event){
        this.selectLocation = event.detail.value;
        this.validForSave();
    }

    handlePageSelectionChange(event){
        this.selectedPage = event.detail.value;
        this.validForSave();
        this.handleGetFormSections();
    }

    handleSectionSelectionChange(event){
        this.selectedSection = event.detail.value;
        this.validForSave();
        this.handleGetFormSectionQuestions();
    }

    handleQuestionSelectionChange(event){
        this.selectedQuestion = event.detail.value;
        this.validForSave();
    }

    storeTitle(event){
        this.textTitle = event.target.value;
        this.validForSave();
    }

    validForSave(){
        let section = this.selectedSection;
        let title = this.textTitle;
        let textType = this.selectedTextType;
        let firstQuestion = this.displayFirstQuestionText;
        let question = this.selectedQuestion;
        if(section != null && title != null && textType!= null){
            if(firstQuestion || question != null){
                this.noSaveAllowed = false;
            } else {
                this.noSaveAllowed = true;
            }
        } else {
            this.noSaveAllowed = true;
        }
    }

    handleRichTextValue(event){
        this.richTextValue = event.target.value;
    }

    handleLongTextValue(event){
        this.longTextValue = event.target.value;
    }

    handleHeadingTextValue(event){
        this.headerHeadingValue = event.target.value;
    }


    closeModal(event){
        this.dispatchEventFunction('closemodal');
    }

    saveModal(event){
        this.dispatchEventFunction('closesavemodal');
    }

    // generic dispatch event function
    dispatchEventFunction(eventName, eventDetail) {
       this.dispatchEvent(new CustomEvent(eventName, { eventDetail }));
    }
}