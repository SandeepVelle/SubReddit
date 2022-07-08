import { LightningElement,api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import getCommentRecords from '@salesforce/apex/commentController.getCommentRecords';
import getChildComments from '@salesforce/apex/childComments.getChildCommentRecords';
import ID_FIELD from "@salesforce/schema/Comment__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/Comment__c.Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/Comment__c.DownVotes__c";


export default class Comment extends LightningElement {
    @api postId;
    @api postName;
    @track CommentRecords;

    connectedCallback(){
        this.getData();
    }
    getData(){
        getCommentRecords({
            postIdFromLwc : this.postId
        })
        .then(result => {
            this.CommentRecords = result;
        })
        
    }


    @track accordianSection = '';

    handleToggleSection(event) {
          if(this.accordianSection.length === 0){
            this.accordianSection =''
        }
        else{
            this.accordianSection ='comment'
        }

    }

    @track subCommentRecords;
    @track parentCommentIds;
    async handleSubComments(event) {
        this.parentCommentIds = event.target.dataset.recordId;
        if (this.parentCommentIds !== '') {
            this.subCommentRecords = await getChildComments({ parentCommentId: this.parentCommentIds, commentPostId : this.postId});
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
        // this.template.querySelector('lightning-input-field[data-name="Reset"]').value = null;
        // this.template.querySelector('lightning-input-field[data-name="Reset1"]').value = null;

        const inputFields = this.template.querySelectorAll( 'lightning-input-field[data-name="Reset1"], lightning-input-field[data-name="Reset"]' );
    if ( inputFields ) {
        inputFields.forEach( field => {
            field.reset();
        } );
    }

}

    onClickVote(event){
        let recId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let upvoteCount = this.CommentRecords[recindex].Upvotes__c;
        let downVotecount = this.CommentRecords[recindex].DownVotes__c;
    if(event.target.name === "UpLike"){
    
        upvoteCount = this.CommentRecords[recindex].Upvotes__c + 1;
       try{
        this.CommentRecords[recindex].Upvotes__c =  this.CommentRecords[recindex].Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLike"){
        
        downVotecount = this.CommentRecords[recindex].DownVotes__c + 1;
       try{
        this.CommentRecords[recindex].DownVotes__c =  this.CommentRecords[recindex].DownVotes__c + 1;
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




    onClickSubVote(event){
        let recId = event.target.dataset.recordId;
        let recindex = event.currentTarget.dataset.index;
        let upvoteCount = this.subCommentRecords[recindex].Upvotes__c;
        let downVotecount = this.subCommentRecords[recindex].DownVotes__c;
    if(event.target.name === "UpLikeSub"){
    
        upvoteCount = this.subCommentRecords[recindex].Upvotes__c + 1;
       try{
        this.subCommentRecords[recindex].Upvotes__c =  this.subCommentRecords[recindex].Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLikeSub"){
        
        downVotecount = this.subCommentRecords[recindex].DownVotes__c + 1;
       try{
        this.subCommentRecords[recindex].DownVotes__c =  this.subCommentRecords[recindex].DownVotes__c + 1;
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