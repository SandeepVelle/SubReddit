import { LightningElement, api, wire, track } from 'lwc'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord, getRecord, updateRecord } from "lightning/uiRecordApi";
import getSubRedditList from '@salesforce/apex/fetchAllRelatedSubRedditRecords.getSubRedditList';
//import getSubRedditDefaultList from '@salesforce/apex/fetchDefaultRecords.getSubRedditDefault';
import getSubRedditDefaultList from '@salesforce/apex/subRedditWrapperClass.subRedditWrapperMethod';
//import voteNewRecord from '@salesforce/apex/VoteController.VoteControllerMethod';
import { NavigationMixin } from 'lightning/navigation';
import ID_FIELD from "@salesforce/schema/SubReddit__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Downvotes__c";
import VOTE_OBJECT from '@salesforce/schema/Vote__c';
import ID_VOTE from '@salesforce/schema/Vote__c.Id';
import SOURCE from '@salesforce/schema/Vote__c.Source_Id__c';
import VOTE from '@salesforce/schema/Vote__c.Vote__c';
import USER from '@salesforce/schema/Vote__c.User__c';
import Id from '@salesforce/user/Id';

export default class Reddit extends NavigationMixin(LightningElement) {
    

    @track userId=Id;
    @track subRedditSearchRec =[];
    @track subRedditDefaultRec =[];
    @track isShowModal = false;
    @track isFakeModel = true;
    @track searchRedditEmpty=true;
    searchValue = '';


    connectedCallback(){
    this.getData();
}
getData(){
    getSubRedditDefaultList({
        userId : this.userId
    })
    .then(result => {
        this.subRedditDefaultRec = result;
    })
}

renderedCallback(){
    this.getData();
}
// renderedCallback() {
//     console.log('rendered started'+ this.subRedditDefaultRec);
//     this.subRedditDefaultRec.forEach(element => {
//         console.log('rendered inside');
//         let btnVisible = this.template.querySelectorAll("[data-record-id='" + element.subredditrec.Id + "']");
//         console.log('rendered inside'+ element.upLike);
//         if(element.upLike == true){
//         btnVisible[0].disabled = true;
//         btnVisible[1].disabled = false;
//         }else{
//             btnVisible[0].disabled = false;
//             btnVisible[1].disabled = true;
//         }
//         console.log('btnVisible '+ JSON.stringify(JSON.stringify));
//     });
// }

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    createSubReddit(){
        this.dispatchEvent(

            new ShowToastEvent( {
                title: 'Subreddit Submission Result',
                message: 'Subreddit Created Successfully',
                variant: 'success',
                mode: 'sticky'
            } )

        );
        this.isShowModal = false;
        this.getData();
    }

    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
        
    }
    
    // call apex method on button click 
    async handleSearchKeyword(event) {
        this.searchValue = event.target.value;
        if (this.searchValue !== '') {
            this.subRedditSearchRec = await getSubRedditList({ searchKey: this.searchValue, userId : this.userId });
            this.searchRedditEmpty = false;
        }
        if(this.searchValue == ''){
            this.searchRedditEmpty = true;
        }
    }

    redirect(event){
        let rowId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let rowName;
        if(this.subRedditSearchRec ==''){
            rowName = this.subRedditDefaultRec[recindex].Name;
        }else{
            rowName = this.subRedditSearchRec[recindex].Name;
        }
        console.log( "Record Id is "+ JSON.stringify( rowId ) );
        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__navigateToPost"
            },
            state: {
                c__redditid: rowId,
                c__redditName: rowName
            }
        });
    }




    onClickVote(event){
        let recordsToProcess =[];
        let recId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        if(this.subRedditSearchRec == 0){
            recordsToProcess = this.subRedditDefaultRec;
        }else {
            recordsToProcess = this.subRedditSearchRec;
        }
        let upvoteCount = recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c;
        let downVotecount = recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c;

    if(event.target.name === "UpLike"){
        upvoteCount = recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c + 1;
        if(recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c >0 && recordsToProcess[recindex].voterec != null){
        downVotecount = recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c - 1;
        }
        if(recordsToProcess[recindex].voterec != null && recordsToProcess[recindex].voterec.Vote__c == true){
            recordsToProcess[recindex].upLike = true;
            recordsToProcess[recindex].downLike = false;
        }else if(recordsToProcess[recindex].voterec != null && recordsToProcess[recindex].voterec.Vote__c == false){
            recordsToProcess[recindex].upLike = true;
            recordsToProcess[recindex].downLike = false;
        }else{
            recordsToProcess[recindex].upLike = true;
            recordsToProcess[recindex].downLike = false;
        }
        this.voteCreation(event);
       try{
        recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c =  recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c + 1;
        if(recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c > 0 && recordsToProcess[recindex].voterec != null){
        recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c =  recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c - 1;
        }
       }
       catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLike"){
        downVotecount = recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c + 1;
        if(recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c >0 && recordsToProcess[recindex].voterec != null){
        upvoteCount = recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c - 1;
        }
        if(recordsToProcess[recindex].voterec != null && recordsToProcess[recindex].voterec.Vote__c == false){
            recordsToProcess[recindex].downLike = true;
            recordsToProcess[recindex].upLike = false;
        }else if(recordsToProcess[recindex].voterec != null && recordsToProcess[recindex].voterec.Vote__c == true){
            recordsToProcess[recindex].downLike = true;
            recordsToProcess[recindex].upLike = false;
        }else{
            recordsToProcess[recindex].upLike = false;
            recordsToProcess[recindex].downLike = true;
        }
        this.voteCreation(event);
       try{
        recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c =  recordsToProcess[recindex].subredditrec.No_Of_Downvotes__c + 1;
        if(recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c >0 && recordsToProcess[recindex].voterec != null){
        recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c =  recordsToProcess[recindex].subredditrec.No_Of_Upvotes__c - 1;
        }
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    
    const fields ={};
  
    const recordInput = {
        fields: fields
        };
    fields[ID_FIELD.fieldApiName]= recId;
    fields[UPVOTE_FIELD.fieldApiName] = upvoteCount;
    fields[DOWNVOTE_FIELD.fieldApiName] = downVotecount;
    updateRecord(recordInput)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
    
}

@track recordList;
voteCreation(event){
    let recindex = event.currentTarget.dataset.index;
    let recId = event.currentTarget.dataset.recordId;
    var voterec;
    if(this.subRedditDefaultRec[recindex].voterec == null){
        const fields ={};
        fields[SOURCE.fieldApiName] = event.target.dataset.recordId;
        if(event.target.name === "UpLike"){
            fields[VOTE.fieldApiName] = true;
        }else{
            fields[VOTE.fieldApiName] = false;
        }
        fields[USER.fieldApiName] =this.userId;
        
        const recordInput = {
            apiName: VOTE_OBJECT.objectApiName,
            fields: fields
        };
        createRecord(recordInput)
        .then(result => {console.log(result)})
        //this.getData();
        //this.handleSearchKeyword(event);
        if(this.searchValue !== ''){
            this.handleSearchKeyword(event);
        }
        
    }
    else{
    const fields ={};

    const recordInput = {
        fields: fields
        };
    fields[ID_VOTE.fieldApiName]= this.subRedditDefaultRec[recindex].voterec.Id;
    if(this.subRedditDefaultRec[recindex].voterec.Vote__c == true){
        fields[VOTE.fieldApiName] = false;
    } else{
        fields[VOTE.fieldApiName] = true;
    }
    updateRecord(recordInput)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
    }
}
}