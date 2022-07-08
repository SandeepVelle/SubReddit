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
    // async handleSubComments(event) {
    //     this.parentCommentIds = event.target.dataset.recordId;
    //     let recindex = event.target.dataset.index;
    //     console.log('recindex '+ recindex);
    //    this.CommentRecords[recindex].showAllComments = true;
    //    this.showAllComments = this.CommentRecords[recindex].showAllComments;
    //     console.log('showallcomnets '+this.showallcomnets);
    //     if (this.parentCommentIds !== '') {
    //         this.subCommentRecords = await getChildComments({ parentCommentId: this.parentCommentIds, commentPostId : this.postId});
    //     }
    // }
    // handleSubComments(event){
    //     this.parentCommentIds = event.target.dataset.index;
    //     this.subCommentRecords = CommentRecords[parentCommentIds].childRecs;
    //     console.log('subCommentRecords '+JSON.stringify(subCommentRecords));
    // }


    handleSuccessComment(){
        this.dispatchEvent(
            new ShowToastEvent( {
                title: 'Comment Submission Result',
                message: 'Comment Submitted Successfully',
                variant: 'success',
                mode: 'sticky'
            } )
        );
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
        let upvoteCount = this.CommentRecords[recindex].commentRec.Upvotes__c;
        let downVotecount = this.CommentRecords[recindex].commentRec.DownVotes__c;
    if(event.target.name === "UpLike"){
    
        upvoteCount = this.CommentRecords[recindex].commentRec.Upvotes__c + 1;
       try{
        this.CommentRecords[recindex].commentRec.Upvotes__c =  this.CommentRecords[recindex].commentRec.Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLike"){
        
        downVotecount = this.CommentRecords[recindex].commentRec.DownVotes__c + 1;
       try{
        this.CommentRecords[recindex].commentRec.DownVotes__c =  this.CommentRecords[recindex].commentRec.DownVotes__c + 1;
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
        let childindex = event.currentTarget.dataset.index1;
        let upvoteCount = this.CommentRecords[recindex].childRecs[childindex].Upvotes__c;
        let downVotecount = this.CommentRecords[recindex].childRecs[childindex].DownVotes__c;
    if(event.target.name === "UpLikeSub"){
    
        upvoteCount = this.CommentRecords[recindex].childRecs[childindex].Upvotes__c + 1;
       try{
        this.CommentRecords[recindex].childRecs[childindex].Upvotes__c =  this.CommentRecords[recindex].childRecs[childindex].Upvotes__c + 1;
       }catch(err){
        console.log('catch error: '+err.message);
       }
    }
    if(event.target.name === "DownLikeSub"){
        
        downVotecount = this.CommentRecords[recindex].childRecs[childindex].DownVotes__c + 1;
       try{
        this.CommentRecords[recindex].childRecs[childindex].DownVotes__c =  this.CommentRecords[recindex].childRecs[childindex].DownVotes__c + 1;
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