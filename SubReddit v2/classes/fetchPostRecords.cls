public with sharing class fetchPostRecords {
    @AuraEnabled
    public static list<Post__c> getPostRecords(Id redditIds){
        list<Post__c> postRecords = new list<Post__c>();
        for(Post__c PObj : [Select id,Name,Body__c,No_Of_Downvotes__c,No_Of_Upvotes__c, SubReddit__c From Post__c where SubReddit__c =: redditIds ORDER BY No_Of_Upvotes__c desc NULLS LAST limit 10]){
            postRecords.add(PObj);
        }
         if(postRecords.size() == 0){
            throw new AuraHandledException('No Record Found..');
         }
        return postRecords;
    }
    @AuraEnabled
    public static list<Post__c> getPostList(string searchKey,Id redditIds) {
        string searchKeyword = '%' + searchKey + '%';
		
       // create contact list to store search result 
        list<Post__c> SubPostListRecord = new list<Post__c>();
     
	   // query contact records
        for(Post__c SRObj : [Select id,Name,No_Of_Downvotes__c,No_Of_Upvotes__c,Body__c, SubReddit__c,No_Of_Comments__c From Post__c
                            WHERE name LIKE : searchKeyword AND SubReddit__c =: redditIds]){
                        SubPostListRecord.add(SRObj);
        }
         if(SubPostListRecord.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return SubPostListRecord;
    }
}