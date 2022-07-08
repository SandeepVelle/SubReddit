import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import getPostOfSubreddit from '@salesforce/apex/fetchPostRecords.getPostRecords';
import getPostSearchRecords from '@salesforce/apex/fetchPostRecords.getPostList';
import getPostDefaultComments from '@salesforce/apex/commentController.getCommentRecords2';
import ID_FIELD from "@salesforce/schema/Post__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/Post__c.No_Of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/Post__c.No_Of_Downvotes__c";
import { NavigationMixin } from 'lightning/navigation';



export default class Post extends NavigationMixin(LightningElement) {

    @api redditid;
    @api redditName;
    @track postDefaultRecords=[];
    @track postSearchRecords =[];
    @track isShowModal=false;
    @track searchPostEmpty=true;
    @track defaultCommentsList;
    @track accordianSection = '';


    async defaultComments(event){
        let postId = event.target.dataset.recordId;
            this.defaultCommentsList = await getPostDefaultComments({postIdFromLwc: postId });
    }
  

    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    createPost(){
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

    async handleSearchKeyword(event) {
        this.searchValue = event.target.value;
        if (this.searchValue !== '') {
            this.postSearchRecords = await getPostSearchRecords({ searchKey: this.searchValue, redditIds: this.redditid });
            this.searchPostEmpty=false;
        }
        if (this.searchValue == ''){
            this.postSearchRecords =[];
            this.searchPostEmpty=true;
        }
    }

    connectedCallback(){
        this.getData();
    }
    getData(){
        getPostOfSubreddit({
            redditIds : this.redditid
        })
        .then(result => {
            this.postDefaultRecords = result;
        })
        
    }

    

    handleToggleSection(event) {
          if(this.accordianSection.length === 0){
            this.accordianSection =''
        }
        else{
            this.accordianSection ='comment'
        }

    }


    handleSuccessComment(){
        this.dispatchEvent(
            new ShowToastEvent( {
                title: 'Comment Submission Result',
                message: 'Comment Submitted Successfully',
                variant: 'success',
                mode: 'sticky'
            } )
        ); 

                const inputFields = this.template.querySelectorAll( 'lightning-input-field[data-name="Reset2"]' );
    if ( inputFields ) {
        inputFields.forEach( field => {
            field.reset();
        } );
    }
        // this.template.querySelector('lightning-input-field[data-name="Reset2"]').value = null;

    
      
      }

      handleSuccessComment1(){
        this.dispatchEvent(
            new ShowToastEvent( {
                title: 'Comment Submission Result',
                message: 'Comment Submitted Successfully',
                variant: 'success',
                mode: 'sticky'
            } )
        ); 


        const inputFields = this.template.querySelectorAll( 'lightning-input-field[data-name="Reset3"]' );
        if ( inputFields ) {
            inputFields.forEach( field => {
                field.reset();
            } );
        }
        // this.template.querySelector('lightning-input-field[data-name="Reset3"]').value = null;

    
      
      }


      onclickViewComments(event){
        let rowId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let rowName;
        if(this.postDefaultRecords !==''){
            rowName = this.postDefaultRecords[recindex].Name;
        }else if(this.postSearchRecords !==''){
            rowName = this.postSearchRecords[recindex].Name;
        }
        console.log( "Record Id is "+ JSON.stringify( rowId ) );
        this[NavigationMixin.Navigate]({
            type: "standard__component",
            attributes: {
                componentName: "c__navigateToComment"
            },
            state: {
                c__postId: rowId,
                c__postName: rowName
            }
        });
    }
    

    onClickVote(event){
        let recordstoProcess = [];
        if(this.postSearchRecords == 0){
            recordstoProcess = this.postDefaultRecords;

        }else{
            recordstoProcess = this.postSearchRecords;
        }
        let recId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let upvoteCount = recordstoProcess[recindex].No_Of_Upvotes__c;
        let downVotecount = recordstoProcess[recindex].No_Of_Downvotes__c;
    if(event.target.name === "UpLike"){

        upvoteCount = recordstoProcess[recindex].No_Of_Upvotes__c + 1;
       try{
        recordstoProcess[recindex].No_Of_Upvotes__c =  recordstoProcess[recindex].No_Of_Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLike"){
        
        downVotecount = recordstoProcess[recindex].No_Of_Downvotes__c + 1;
       try{
        recordstoProcess[recindex].No_Of_Downvotes__c =  recordstoProcess[recindex].No_Of_Downvotes__c + 1;
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




// onClickVote2(event){
//     let recId = event.target.dataset.recordId;
//     let recindex = event.currentTarget.dataset.index;
//     let upvoteCount = this.postDefaultRecords[recindex].No_Of_Upvotes__c;
//     let downVotecount = this.postDefaultRecords[recindex].No_Of_Downvotes__c;
// if(event.target.name === "UpLike"){

//     upvoteCount = this.postDefaultRecords[recindex].No_Of_Upvotes__c + 1;
//    try{
//     this.postDefaultRecords[recindex].No_Of_Upvotes__c =  this.postDefaultRecords[recindex].No_Of_Upvotes__c + 1;
//    }catch(err){
//     console.log('catch error: '+err.message);
//    }
// }
// if(event.target.name === "DownLike"){
    
//     downVotecount = this.postDefaultRecords[recindex].No_Of_Downvotes__c + 1;
//    try{
//     this.postDefaultRecords[recindex].No_Of_Downvotes__c =  this.postDefaultRecords[recindex].No_Of_Downvotes__c + 1;
//    }catch(err){
//     console.log('catch error: '+err.message);
//    }
// }
// const fields ={};

// const recordInput = {
//     fields: fields
//     };
// fields[ID_FIELD.fieldApiName]= recId;
// fields[UPVOTE_FIELD.fieldApiName] =upvoteCount;
// fields[DOWNVOTE_FIELD.fieldApiName] =downVotecount;


// updateRecord(recordInput)
// .then((data) => console.log(data))
// .catch((error) => console.log(error));

// }
}