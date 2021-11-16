/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @group             : 
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   05-12-2021   daniel@hyphen8.com   Initial Version
**/
import { LightningElement, api } from 'lwc';

import { deleteRecord } from 'lightning/uiRecordApi';
export default class FormBuilderQuestion extends LightningElement {

    isTextQuestion = false;
    isHeadingLarge = false;
    isHeadingMedium = false;
    isHeadingSmall = false;
    isNormal = false;
    isRichText = false;
    isTextEdit = false;

    @api 
    get question(){
        return this._question;
    };
    set question(value){
        console.log('question loaded');
        this._question = value;
        if(value.type == 'Text'){
            this.isTextQuestion = true;
            if(value.subtype == 'Heading - Large'){
                this.isHeadingLarge = true;
            } else if(value.subtype == 'Heading - Medium'){
                this.isHeadingMedium = true;
            } else if(value.subtype == 'Heading - Small'){
                this.isHeadingSmall = true;
            } else if(value.subtype == 'Normal'){
                this.isNormal = true;
            } else {
                this.isRichText = true;
            }
        }
    }

    handleEdit(event){
        this.isTextEdit = true;
    }

    handleTextSave(event){
        this.isTextEdit = false;
    }

    handleDelete(event){
        this.handleDeleteRecord();
    }

    // delete question
    handleDeleteRecord(){
        deleteRecord(this.question.questionId)
           .then(() => {
                this.dispatchEventFunction('deletequestion');
           })
           .catch(error => {
           });
    }

    // generic dispatch event function
    dispatchEventFunction(eventName, eventDetail) {
        this.dispatchEvent(new CustomEvent(eventName, { detail: eventDetail }));
     }
}