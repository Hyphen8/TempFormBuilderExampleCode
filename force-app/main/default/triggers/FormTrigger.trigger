/**
 * @description       : trigger for managing forms
 * @author            : daniel@hyphen8.com
 * @last modified on  : 10/05/2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   10/05/2021   daniel@hyphen8.com   Initial Version
**/
trigger FormTrigger on Form__c (before insert, before update, before delete, after insert, after update, after delete) {

    FormTriggerHandler.run(trigger.new, trigger.old, Trigger.operationType);

}