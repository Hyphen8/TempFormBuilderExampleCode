/**
 * @description       : formbuilder creation methods
 * @author            : daniel@hyphen8.com
 * @group             : 
 * @last modified on  : 14/05/2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   05-13-2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormBuilderCreationMethods {

    /**
    * @description      method to add a new page to a form
    * @param            string page - json object from lwc component
    * @return           boolean 
    **/
    @AuraEnabled
    public static boolean addPage(string page){
        try {

            FormCreationWrapper.FormPage pageWrapper = (FormCreationWrapper.FormPage) JSON.deserialize(page, FormCreationWrapper.FormPage.class);

            List<Form_Page__c> currentPages = [SELECT ID, Order__c FROM Form_Page__c WHERE Form__c=:pageWrapper.formId ORDER BY Order__c ASC];

            integer orderCount = 1;
            integer newPageOrderCount;

            List<Form_Page__c> updatePages = new List<Form_Page__c>();

            for(Form_Page__c formPage:currentPages){
                if(formPage.Id == pageWrapper.pageId){
                    if(pageWrapper.beforeAfter == 'before'){
                        newPageOrderCount = orderCount;
                        orderCount = orderCount + 1;
                        formPage.Order__c = orderCount;
                    } else if(pageWrapper.beforeAfter == 'after'){
                        formPage.Order__c = orderCount;
                        orderCount = orderCount + 1;
                        newPageOrderCount = orderCount;
                    }
                } else {
                    formPage.Order__c = orderCount;
                }

                orderCount = orderCount + 1;

                updatePages.add(formPage);
            }

            database.update(updatePages);

            Form_Page__c newFormPage = new Form_Page__c(Title__c = pageWrapper.title, Display_Page_Title__c = pageWrapper.displayTitle, Form__c = pageWrapper.formId, Order__c = newPageOrderCount);
            insert newFormPage;

            Form_Section__c formSection = new Form_Section__c(Form_Page__c = newFormPage.Id, Title__c = 'New Section', Order__c = 1);
            insert formSection;

            return true;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
    * @description      method for adding a section
    * @param            string section - json object from lwc component
    * @return           boolean 
    **/
    @AuraEnabled
    public static boolean addSection(string section, Map<String, Object> sectionMap){

        system.debug('sectionMap > ' + sectionMap);
        
        try {

            FormCreationWrapper.FormSection sectionWrapper = (FormCreationWrapper.FormSection) JSON.deserialize(section, FormCreationWrapper.FormSection.class);
            
            List<Form_Section__c> currentSections = [SELECT Id, Order__c FROM Form_Section__c WHERE Form_Page__c=:sectionWrapper.pageId ORDER BY Order__c ASC];

            integer orderCount = 1;
            integer newRecordCount;

            List<Form_Section__c> sectionUpdateList = new List<Form_Section__c>();

            for(Form_Section__c formSection:currentSections){
                if(formSection.Id == sectionWrapper.sectionId){
                    if(sectionWrapper.beforeAfter == 'before'){
                        newRecordCount = orderCount;
                        orderCount = orderCount + 1;
                        formSection.Order__c = orderCount;
                    } else if(sectionWrapper.beforeAfter == 'after'){
                        formSection.Order__c = orderCount;
                        orderCount = orderCount + 1;
                        newRecordCount = orderCount;
                    }
                } else {
                    formSection.Order__c = orderCount;
                }
                orderCount = orderCount + 1;
                sectionUpdateList.add(formSection);
            }

            Form_Section__c newFormSection = new Form_Section__c(Form_Page__c = sectionWrapper.pageId, Title__c = sectionWrapper.title, Display_Title__c = sectionWrapper.displayTitle, Order__c = newRecordCount);
            insert newFormSection;

            database.update(sectionUpdateList);

            return true;

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    /**
    * @description      method for adding a text element to the page
    * @param            string question - json object from lwc component
    * @return           boolean 
    **/
    @AuraEnabled
    public static boolean addTextQuestion(string question){
        try {
            
            FormCreationWrapper.Question questionWrapper = (FormCreationWrapper.Question) JSON.deserialize(question, FormCreationWrapper.Question.class);
            
            List<Form_Question__c> formQuestions = [SELECT Id, Order__c FROM Form_Question__c WHERE Form_Section__c=:questionWrapper.sectionId];

            integer orderCount = 1;
            integer newQuestionCount;

            List<Form_Question__c> updateQuestions = new List<Form_Question__c>();

            if(formQuestions.size() > 0){
                for(Form_Question__c formQuestion:formQuestions){
                    if(questionWrapper.questionId == formQuestion.Id){
                        if(questionWrapper.beforeAfter == 'before'){
                            newQuestionCount = orderCount;
                            orderCount = orderCount + 1;
                            formQuestion.Order__c = orderCount;
                        } else if(questionWrapper.beforeAfter == 'after'){
                            formQuestion.Order__c = orderCount;
                            orderCount = orderCount + 1;
                            newQuestionCount = orderCount;
                        }
                    } else {
                        formQuestion.Order__c = orderCount;
                    }
                    updateQuestions.add(formQuestion);
                    orderCount = orderCount + 1;
                }
            }

            database.update(updateQuestions);

            Form_Question__c formQuestion = new Form_Question__c(
                        Form_Section__c = questionWrapper.sectionId, Title__c = questionWrapper.title,
                        Order__c = 1, Type__c = questionWrapper.type, Sub_Type__c = questionWrapper.subtype,
                        Plain_Text_Output__c = questionWrapper.textHeading, Rich_Text_Output__c = questionWrapper.textRichText);
            insert formQuestion;
            
            return true;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
