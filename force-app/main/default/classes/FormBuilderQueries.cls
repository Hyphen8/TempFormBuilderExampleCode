/**
 * @description       : series of methods used to query records for the formbuilder
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-12-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   11/05/2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormBuilderQueries {


    /**
    * @description      get a list of form pages related to a specific form
    * @param            string recordId 
    * @return           List<Form_Page__c> 
    **/
    public static List<Form_Page__c> getListOfFormPages(string recordId){
        return [SELECT ID, Display_Page_Title__c, Title__c, Order__c FROM Form_Page__c WHERE Form__c =:recordId ORDER BY Order__c ASC];
    }
    
    /**
    * @description      takes a set of form pages and converts to a set of ids
    * @param            List<Form_Page__c> formPages 
    * @return           Set<ID> 
    **/
    public static Set<ID> getSetOfPageIds(List<Form_Page__c> formPages){
        Set<ID> returnSet = new Set<ID>();

        for(Form_Page__c formPage:formPages){
            returnSet.add(formPage.Id);
        }

        return returnSet;
    }

    /**
    * @description      method to take a set of page Ids and return a map of sections with their related questions
    * @param            Set<ID> setOfPageIds 
    * @return           Map<ID, List<Form_Section__c>> 
    **/
    public static Map<ID, List<Form_Section__c>> getMapOfFormSections(Set<ID> setOfPageIds){
        Map<ID, List<Form_Section__c>> returnMap = new Map<ID, List<Form_Section__c>>();

        List<Form_Section__c> getFormSections = [SELECT ID, Order__c, Title__c, Form_Page__c, Display_Title__c, (SELECT Id, Title__c, Order__c, Type__c, Sub_Type__c, Plain_Text_Output__c, Rich_Text_Output__c FROM Form_Questions__r ORDER BY Order__c ASC) FROM Form_Section__c WHERE Form_Page__c IN:setOfPageIds ORDER BY Order__c ASC];

        for(Form_Section__c formSection:getFormSections){
            List<Form_Section__c> sections;
            if(returnMap.containsKey(formSection.Form_Page__c)){
                sections = returnMap.get(formSection.Form_Page__c);
            } else {
                sections = new List<Form_Section__c>();
            }
            sections.add(formSection);
            returnMap.put(formSection.Form_Page__c, sections);
        }

        return returnMap;
    }
}
