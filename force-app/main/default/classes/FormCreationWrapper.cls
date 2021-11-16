/**
 * @description       : record creation wrapper helps with creating pages / sections and forms
 * @author            : daniel@hyphen8.com
 * @group             : 
 * @last modified on  : 05-13-2021
 * @last modified by  : daniel@hyphen8.com
 * Modifications Log 
 * Ver   Date         Author               Modification
 * 1.0   05-13-2021   daniel@hyphen8.com   Initial Version
**/
public with sharing class FormCreationWrapper {
    

    public class FormPage {
        public string title;
        public boolean displayTitle;
        public string pageId;
        public string beforeAfter;
        public string formId;
    }

    public class FormSection {
        public string title;
        public boolean displayTitle;
        public string pageId;
        public string sectionId;
        public string beforeAfter;
    }

    public class Question {
        public string title;
        public string type;
        public string subtype;
        public string textHeading;
        public string textRichText;
        public string sectionId;
        public string questionId;
        public string beforeAfter;
    }
}
