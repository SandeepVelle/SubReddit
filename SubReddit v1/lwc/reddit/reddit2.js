import { LightningElement, api, wire, track } from 'lwc'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord, updateRecord } from "lightning/uiRecordApi";
import getSubRedditList from '@salesforce/apex/fetchAllRelatedSubRedditRecords.getSubRedditList';
import { NavigationMixin } from 'lightning/navigation';
import ID_FIELD from "@salesforce/schema/SubReddit__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Downvotes__c";

const getRecFields = [UPVOTE_FIELD, DOWNVOTE_FIELD ];



export default class Reddit extends NavigationMixin(LightningElement) {

    @track upVote;
    @track downVote;
    @track isShowModal = false;
    @track recordidreal;
    @track subRedditRecord2;
    showModalBox() {  
        this.isShowModal = true;
    }

    hideModalBox() {  
        this.isShowModal = false;
    }
    createAccount(){
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


        }
                
           
    }
    redirect(event){
        let recId = event.target.dataset.recordId;
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: recId,
                objectApiName: 'SubReddit__c',
                actionName: 'view',
            }
        });
    }
    onClickVote(event){
        let recId = event.target.dataset.recordId;
        this.recordidreal = event.target.dataset.recordId;
        
    if(event.target.name === "UpLike"){
            this.upVote= this.upVote+1;
    }
    if(event.target.name === "DownLike"){
        this.downVote = this.downVote+1 ;
    }
    
    const fields ={};
  
    const recordInput = {
        fields: fields
    
        };

    fields[ID_FIELD.fieldApiName]= recId;
    fields[UPVOTE_FIELD.fieldApiName] =this.upVote;
    fields[DOWNVOTE_FIELD.fieldApiName] =this.downVote;

    
    updateRecord(recordInput)
    
    .then((data) => console.log(data))
    .catch((error) => console.log(error));
    
}
    }