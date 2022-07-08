import { LightningElement, api, wire, track } from 'lwc'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import getSubRedditList from '@salesforce/apex/fetchAllRelatedSubRedditRecords.getSubRedditList';
import getSubRedditDefaultList from '@salesforce/apex/fetchDefaultRecords.getSubRedditDefault';
import { NavigationMixin } from 'lightning/navigation';
import ID_FIELD from "@salesforce/schema/SubReddit__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Downvotes__c";

const getRecFields = [UPVOTE_FIELD, DOWNVOTE_FIELD ];



export default class Reddit extends NavigationMixin(LightningElement) {
    

    @track subRedditRecord2;
    @track upvotesMap = new Map();
    @track downvotesMap = new Map();
    @track isShowModal = false;
    @track isFakeModel = true;
    @track searchRedditEmpty=true;

    
// @wire (getSubRedditDefaultList) wiredAccounts({data,error}){
//     if (data) {
//         this.subRedditRecord2 =data;
//         console.log(data);
//     } 
//     else if (error) {
//         console.log(error);}}
connectedCallback(){
    this.getData();
}
getData(){
    getSubRedditDefaultList({

    })
    .then(result => {
        this.subRedditRecord2 = result;
    })
}


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
    }

    @track subRedditRecord;
    
    searchValue = '';
 
    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
        
    }
    
 
    // call apex method on button click 
    async handleSearchKeyword(event) {
        this.searchValue = event.target.value;
        if (this.searchValue !== '') {
            this.subRedditRecord = await getSubRedditList({ searchKey: this.searchValue });
            this.searchRedditEmpty = false;
        }
        if(this.searchValue == ''){
            this.searchRedditEmpty = true;
        }
    }

    redirect(event){
        let rowId = event.target.dataset.recordId;
        console.log( "Record Id is "+ JSON.stringify( rowId ) );
        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__navigateToPost"
            },
            state: {
                c__redditid: rowId
            }
        });
    }




    onClickVote(event){
        let recId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let upvoteCount = this.subRedditRecord[recindex].No_Of_Upvotes__c;
        let downVotecount = this.subRedditRecord[recindex].No_Of_Downvotes__c;
    if(event.target.name === "UpLike"){

        upvoteCount = this.subRedditRecord[recindex].No_Of_Upvotes__c + 1;
       try{
        this.subRedditRecord[recindex].No_Of_Upvotes__c =  this.subRedditRecord[recindex].No_Of_Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLike"){
        
        downVotecount = this.subRedditRecord[recindex].No_Of_Downvotes__c + 1;
       try{
        this.subRedditRecord[recindex].No_Of_Downvotes__c =  this.subRedditRecord[recindex].No_Of_Downvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    const fields ={};
  
    const recordInput = {
        fields: fields
        };
    fields[ID_FIELD.fieldApiName]= recId;
    fields[UPVOTE_FIELD.fieldApiName] =upvoteCount;
    fields[DOWNVOTE_FIELD.fieldApiName] =downVotecount;

    
    updateRecord(recordInput)
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
    
}



onClickVote2(event){
    let recId = event.target.dataset.recordId;
    let recindex = event.currentTarget.dataset.index;
    let upvoteCount = this.subRedditRecord2[recindex].No_Of_Upvotes__c;
    let downVotecount = this.subRedditRecord2[recindex].No_Of_Downvotes__c;
if(event.target.name === "UpLike"){

    upvoteCount = this.subRedditRecord2[recindex].No_Of_Upvotes__c + 1;
   try{
    this.subRedditRecord2[recindex].No_Of_Upvotes__c =  this.subRedditRecord2[recindex].No_Of_Upvotes__c + 1;
   }catch(err){
    console.log('catch error: '+err.message);
   }
}
if(event.target.name === "DownLike"){
    
    downVotecount = this.subRedditRecord2[recindex].No_Of_Downvotes__c + 1;
   try{
    this.subRedditRecord2[recindex].No_Of_Downvotes__c =  this.subRedditRecord2[recindex].No_Of_Downvotes__c + 1;
   }catch(err){
    console.log('catch error: '+err.message);
   }
}
const fields ={};

const recordInput = {
    fields: fields
    };
fields[ID_FIELD.fieldApiName]= recId;
fields[UPVOTE_FIELD.fieldApiName] =upvoteCount;
fields[DOWNVOTE_FIELD.fieldApiName] =downVotecount;


updateRecord(recordInput)
.then((data) => console.log(data))
.catch((error) => console.log(error));

}
    }