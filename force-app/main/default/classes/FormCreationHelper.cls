/**
 * @description       : help class for when a form is created ensuring the base template is configured correctly
 * @author            : daniel@hyphen8.com
 * @last modified on  : 05-11-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormCreationHelper {


    public static void afterInsertSetupBaseForm(string recordId){

        Form_Page__c fp = new Form_Page__c(Form__c = recordId, Title__c = 'First Page', Order__c = 1);
        insert fp;

        Form_Section__c fs = new Form_Section__c(Form_Page__c = fp.Id, Title__c = 'First Section', Order__c = 1);
        insert fs;
    
    }

}
