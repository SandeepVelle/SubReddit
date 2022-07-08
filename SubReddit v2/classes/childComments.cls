public with sharing class childComments {
    @AuraEnabled
    public static list<Comment__c> getChildCommentRecords(id parentCommentId, id commentPostId){

        list<Comment__c> childCommentsList = new list<Comment__c>();

        for(Comment__c SRObj : [Select id
        , Name
        , Comment__c
        , Post__c
        , Upvotes__c
        , DownVotes__c,Body__c
        , CreatedBy.name
        , CreatedBy.FirstName
        , CreatedBy.CreatedDate
        From Comment__c where Comment__c =: parentCommentId AND Post__c =:commentPostId]){
            childCommentsList.add(SRObj);
        }
         if(childCommentsList.size() == 0){
            throw new AuraHandledException('No Record Found..');
         }
         system.debug('childCommentsList :'+childCommentsList);

        return childCommentsList;
    }
}