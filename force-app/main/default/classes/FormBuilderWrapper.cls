/**
 * @description       : form Builder wrapper class
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormBuilderWrapper {

    @AuraEnabled public List<FormPage> pages;
    @AuraEnabled public boolean displayDeletePageButton;

    public class FormPage {
        @AuraEnabled public string title;
        @AuraEnabled public boolean displayTitle;
        @AuraEnabled public integer pageNumber;
        @AuraEnabled public string pageId;
        @AuraEnabled public boolean displayDeleteSectionButton;
        @AuraEnabled public List<Section> sections;
    }

    public class Section {
        @AuraEnabled public string title;
        @AuraEnabled public string sectionId;
        @AuraEnabled public boolean displayTitle;
        @AuraEnabled public integer sectionNumber;
        @AuraEnabled public List<Question> questions;
    }

    public class Question {
        @AuraEnabled public string title;
        @AuraEnabled public integer questionNumber;
        @AuraEnabled public string type;
        @AuraEnabled public string subtype;
        @AuraEnabled public string textHeading;
        @AuraEnabled public string textRichText;
        @AuraEnabled public string questionId;
    }

}
