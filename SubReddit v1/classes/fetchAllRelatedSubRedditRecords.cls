public with sharing class fetchAllRelatedSubRedditRecords {
    @AuraEnabled
    public static list<SubReddit__c> getSubRedditList(string searchKey) {
        string searchKeyword = '%' + searchKey + '%';
		
       // create contact list to store search result 
        list<SubReddit__c> SubRedditListRecord = new list<SubReddit__c>();
     
	   // query contact records
        for(SubReddit__c SRObj : [Select id,Name, Category__c,No_Of_Downvotes__c,No_Of_Upvotes__c
                            From SubReddit__c
                            WHERE name LIKE : searchKeyword]){
                SubRedditListRecord.add(SRObj);
        }
         if(SubRedditListRecord.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return SubRedditListRecord;
    }
}