public with sharing class fetchDefaultRecords {
    @AuraEnabled
    public static list<SubReddit__c> getSubRedditDefault(){
        list<SubReddit__c> SubRedditListDefault = new list<SubReddit__c>();
        for(SubReddit__c SRObj : [Select id,Name, Category__c,No_Of_Downvotes__c,No_Of_Upvotes__c
        From SubReddit__c ORDER by No_Of_Upvotes__c desc NULLS LAST limit 10]){
            SubRedditListDefault.add(SRObj);
        }
         if(SubRedditListDefault.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return SubRedditListDefault;
    }
}