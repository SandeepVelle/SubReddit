public with sharing class fetchAllRelatedSubRedditRecords {
    @AuraEnabled
    public static list<SubredditSearchWrapperClass> getSubRedditList(string searchKey, Id userId) {
        List<SubredditSearchWrapperClass> wrapperList = new List<SubredditSearchWrapperClass>();
        SubredditSearchWrapperClass WrapList;
        string searchKeyword = '%' + searchKey + '%';

        for(SubReddit__c subObj : [Select id
        , Name
        , Category__c
        , No_Of_Downvotes__c
        , No_Of_Upvotes__c
        , Owner.Name
        , Owner.id
        From SubReddit__c  WHERE name LIKE : searchKeyword ORDER BY No_Of_Upvotes__c desc]){
            WrapList = new SubredditSearchWrapperClass();
            WrapList.subredditrec = subObj;
            
            for(Vote__c voteObj :[Select id
            , Vote__c
            , Source_Id__c
            , User__c 
            , CreatedDate
            from vote__c Where Source_Id__c =:subObj.id  AND  User__c =: userId  ORDER BY CreatedDate desc Limit 1]){
                WrapList.voterec = voteObj;
                WrapList.voteValue = voteObj.Vote__c;
                if(voteObj.Vote__c == true){
                    WrapList.upLike = true;
                    WrapList.downLike = false;
                }else  if(voteObj.Vote__c == false){
                    WrapList.upLike = false;
                    WrapList.downLike = true;
                }else {
                    WrapList.upLike = true;
                    WrapList.downLike = true;
                }
        }
         wrapperList.add(WrapList);

    }
    if(wrapperList.size() == 0){
        throw new AuraHandledException('No Record Found..');
     }
    return wrapperList;
    }
    public class SubredditSearchWrapperClass{
        @AuraEnabled
        public SubReddit__c subredditrec;
        @AuraEnabled
        public Vote__c voterec;
        @AuraEnabled
        public Boolean voteValue;
        @AuraEnabled
        public Boolean upLike;
        @AuraEnabled
        public Boolean downLike;
    }
}