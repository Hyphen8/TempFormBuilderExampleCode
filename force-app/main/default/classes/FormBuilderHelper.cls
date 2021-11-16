/**
 * @description       : form builder help class for lwc component form builder
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormBuilderHelper {

    /**
    * @description      method to pull back the form with all pages, sections and questions
    * @param            recordId 
    * @return           FormBuilderWrapper 
    **/
    @AuraEnabled
    public static FormBuilderWrapper getForm(string recordId){
        try {

            List<Form_Page__c> getListOfPages = FormBuilderQueries.getListOfFormPages(recordId);
            Set<ID> setOfPageIds = FormBuilderQueries.getSetOfPageIds(getListOfPages);
            Map<ID, List<Form_Section__c>> mapOfSections = FormBuilderQueries.getMapOfFormSections(setOfPageIds);

            FormBuilderWrapper returnWrapper = buildFormWrapper(getListOfPages, mapOfSections);
            return returnWrapper;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
    * @description      method to build the return wrapper for supporting the building process
    * @param            List<Form_Page__c> formPages 
    * @param            Map<ID List<Form_Section__c>> mapOfSections 
    * @return           FormBuilderWrapper 
    **/
    public static FormBuilderWrapper buildFormWrapper(List<Form_Page__c> formPages, Map<ID, List<Form_Section__c>> mapOfSections){

        FormBuilderWrapper returnWrapper = new FormBuilderWrapper();
        List<FormBuilderWrapper.FormPage> pages = new List<FormBuilderWrapper.FormPage>();
        if(formPages.isEmpty()){
            returnWrapper.displayDeletePageButton = true;
        } else {
            returnWrapper.displayDeletePageButton = false;
        }
        for(Form_Page__c fp:formPages){

            List<Form_Section__c> getSections = mapOfSections.get(fp.Id);
            FormBuilderWrapper.FormPage page = new FormBuilderWrapper.FormPage();
            page.pageNumber = integer.valueOf(fp.Order__c);
            page.title = fp.Title__c;
            page.pageId = fp.Id;
            page.displayTitle = fp.Display_Page_Title__c;
            if(getSections.size() > 1){
                page.displayDeleteSectionButton = true;
            } else {
                page.displayDeleteSectionButton = false;
            }
            List<FormBuilderWrapper.Section> sections = new List<FormBuilderWrapper.Section>();
            for(Form_Section__c fs:getSections){
                List<Form_Question__c> questions = fs.Form_Questions__r;
                FormBuilderWrapper.Section section = new FormBuilderWrapper.Section();
                section.sectionId = fs.Id;
                section.title = fs.Title__c;
                section.displayTitle = fs.Display_Title__c;
                section.sectionNumber = integer.valueOf(fs.Order__c);
                List<FormBuilderWrapper.Question> formQuestions = buildQuestions(questions);
                section.questions = formQuestions;
                sections.add(section);
            }
            page.sections = sections;
            pages.add(page);
        }
        returnWrapper.pages = pages;
        
        return returnWrapper;

    }


    /**
    * @description          method to generate a list of questions for outputting in the builder 
    * @param                List<Form_Question__c> questions 
    * @return               List<FormBuilderWrapper.Question> 
    **/
    public static List<FormBuilderWrapper.Question> buildQuestions(List<Form_Question__c> questions){

        List<FormBuilderWrapper.Question> returnQuestions = new List<FormBuilderWrapper.Question>();

        for(Form_Question__c formQ:questions){
            FormBuilderWrapper.Question wrapperQuestion = new FormBuilderWrapper.Question();
            wrapperQuestion.title = formQ.Title__c;
            wrapperQuestion.type = formQ.Type__c;
            wrapperQuestion.subtype = formQ.Sub_Type__c;
            wrapperQuestion.textHeading = formQ.Plain_Text_Output__c;
            wrapperQuestion.textRichText = formQ.Rich_Text_Output__c;
            wrapperQuestion.questionId = formQ.Id;
            wrapperQuestion.questionNumber = Integer.valueOf(formQ.Order__c);
            returnQuestions.add(wrapperQuestion);
        }

        return returnQuestions;
    }

    @AuraEnabled
    public static boolean deleteSection(string recordId){
        try {

            List<Form_Question__c> formQuestions = [SELECT ID FROM Form_Question__c WHERE Form_Section__c=:recordId];
            delete formQuestions;

            List<Form_Section__c> deleteSections = [SELECT Id, Form_Page__c FROM Form_Section__c WHERE ID=:recordId];

            ID formPageId;
            for(Form_Section__c formSection:deleteSections){
                formPageId = formSection.Form_Page__c;
            }

            delete deleteSections;

            List<Form_Section__c> formSections = [SELECT Id, Order__c FROM Form_Section__c WHERE Form_Page__c=:recordId ORDER BY Order__c ASC];

            List<Form_Section__c> formSectionsUpdate = new List<Form_Section__c>();

            integer orderCount = 1;

            for(Form_Section__c section:formSections){
                section.Order__c = orderCount;
                orderCount = orderCount + 1;
                formSectionsUpdate.add(section);
            }

            database.update(formSectionsUpdate);
            

            return true;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }


    @AuraEnabled
    public static boolean deletePage(string recordId, string formId){
        try {

            List<Form_Section__c> listOfSections = [SELECT ID, (SELECT ID FROM Form_Questions__r) FROM Form_Section__c WHERE Form_Page__c=:recordId];

            List<Form_Question__c> deleteQuestions = new List<Form_Question__c>();

            for(Form_Section__c fs:listOfSections){
                List<Form_Question__c> sectionQuestions = fs.Form_Questions__r;
                deleteQuestions.addAll(sectionQuestions);
            }

            delete deleteQuestions;
            delete listOfSections;

            Form_Page__c fp = new Form_Page__c(ID=recordId);
            delete fp;

            List<Form_Page__c> formPages = [SELECT ID, Order__c FROM Form_Page__c WHERE Form__c=:formId ORDER BY Order__c ASC];

            List<Form_Page__c> formPagesUpdates = new List<Form_Page__c>();

            integer orderNumber = 1;

            for(Form_Page__c formPage:formPages){
                formPage.Order__c = orderNumber;
                orderNumber = orderNumber + 1;
                formPagesUpdates.add(formPage);
            }

            database.update(formPagesUpdates);

            return true;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    

    /**
    * @description          methods to return a list of sections for a specific page
    * @param                string recordId - a provided page Id
    * @return               List<Form_Section__c> 
    **/
    @AuraEnabled
    public static List<Form_Section__c> getFormSections(string recordId){
        try {
            return [SELECT Id, Title__c, Order__c FROM Form_Section__c WHERE Form_Page__c=:recordId ORDER BY Order__c ASC];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    /**
    * @description          method to get a list of question within a give section
    * @param                string recordId - this is a section id
    * @return               List<Form_Question__c> 
    **/
    @AuraEnabled
    public static List<Form_Question__c> getFormSectionQuestions(string recordId){
        try {
            return [SELECT Id, Title__c, Order__c, Type__c, Sub_Type__c FROM Form_Question__c WHERE Form_Section__c=:recordId ORDER BY Order__c ASC];
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}
