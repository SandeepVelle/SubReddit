public with sharing class subRedditWrapperClass {
    @AuraEnabled
    public static list<SubredditWrapperClass1> subRedditWrapperMethod(Id userId) {
        List<SubredditWrapperClass1> wrapperList = new List<SubredditWrapperClass1>();
        SubredditWrapperClass1 WrapList;
        for(SubReddit__c subObj : [Select id
        , Name
        , Category__c
        , No_Of_Downvotes__c
        , No_Of_Upvotes__c
        , Owner.Name
        , Owner.id
        From SubReddit__c ORDER BY No_Of_Upvotes__c desc]){
            WrapList = new SubredditWrapperClass1();
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
     for(SubredditWrapperClass1 ls:wrapperList){
        system.debug('wrapperList '+ls);
     }
    return wrapperList;
}
    public class SubredditWrapperClass1{
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

    Public static void TestMethod1(){
        Map<Id, SubReddit__c> subredditRecords = new Map<Id, SubReddit__c>();
        for(SubReddit__c subObj : [Select id
        , Name
        , Category__c
        , No_Of_Downvotes__c
        , No_Of_Upvotes__c
        , Owner.Name
        , Owner.id
        From SubReddit__c ORDER BY No_Of_Upvotes__c desc]){
            subredditRecords.put(subObj.id,subObj);
        }
        System.debug('subredditRecords '+subredditRecords);
    }



}