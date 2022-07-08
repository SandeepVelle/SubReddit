public with sharing class commentController {
    @AuraEnabled
    public static list<CommentWrapperClass> getCommentRecords(id postIdFromLwc){
        List<CommentWrapperClass> wrapperLst = new List<CommentWrapperClass>();
        CommentWrapperClass wrapperRec;

        for(Comment__c cmtObj : [Select id
        , Name 
        , Post__c
        , Upvotes__c
        , Comment__c
        , Comment__r.Post__c
        , DownVotes__c
        , Body__c
        , CreatedBy.name
        , CreatedBy.FirstName
        , CreatedBy.CreatedDate
        , (Select id
        , Name
        , Comment__c
        , Post__c
        , Upvotes__c
        , DownVotes__c
        , Body__c
        , CreatedBy.name
        , CreatedBy.FirstName
        , CreatedBy.CreatedDate
        From Comments__r)
        From Comment__c where Post__c=:postIdFromLwc AND Comment__c = Null  ORDER by Upvotes__c desc NULLS LAST limit 100]){
            wrapperRec = new CommentWrapperClass();
            wrapperRec.commentRec = cmtObj;
            wrapperRec.childRecs = cmtObj.Comments__r;
            wrapperLst.add(wrapperRec);
        }
         if(wrapperLst.size() == 0){
            throw new AuraHandledException('No Record Found..');
         }
        return wrapperLst;
    }
    public class CommentWrapperClass{
        @AuraEnabled
        public Comment__c commentRec;
        @AuraEnabled
        public List<Comment__c> childRecs;
    }


    @AuraEnabled
    public static list<Comment__c> getCommentRecords2(id postIdFromLwc){

        list<Comment__c> commentListDefault = new list<Comment__c>();

        for(Comment__c cmtObj : [Select id
        , Name 
        , Post__c
        , Upvotes__c
        , Comment__c
        , Comment__r.Post__c
        , DownVotes__c
        , Body__c
        , CreatedBy.name
        , CreatedBy.FirstName
        , CreatedBy.CreatedDate
        From Comment__c where Post__c=:postIdFromLwc AND Comment__c =Null  ORDER by Upvotes__c desc NULLS LAST limit 10]){
            commentListDefault.add(cmtObj);
        }
         if(commentListDefault.size() == 0){
            throw new AuraHandledException('No Record Found..');
         }
         system.debug('commentListDefault :'+commentListDefault);

        return commentListDefault;
    }
}