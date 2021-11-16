/**
 * @description       : 
 * @author            : daniel@hyphen8.com
 * @last modified on  : 10/05/2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormTriggerHandler {


    public static void run(List<Form__c> newRecords, List<Form__c> oldRecords, System.TriggerOperation triggerEvent ) {
        
        switch on triggerEvent {
            
            when BEFORE_INSERT {
            
            }
            when BEFORE_UPDATE {
            
            }
            when BEFORE_DELETE {

            }
            when AFTER_INSERT {

                // setup form template
                for(Form__c form:newRecords){
                    system.debug(form);
                    FormCreationHelper.afterInsertSetupBaseForm(form.Id);
                }

            }
            when AFTER_UPDATE {

            }
            when AFTER_DELETE {

            }
        }
    }
}