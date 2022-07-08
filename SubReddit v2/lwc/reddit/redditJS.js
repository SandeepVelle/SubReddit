import { LightningElement, api, wire, track } from 'lwc'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContactList from '@salesforce/apex/fetchAllRelatedSubRedditRecords.getSubRedditList';
import { NavigationMixin } from 'lightning/navigation';
import ID_FIELD from "@salesforce/schema/SubReddit__c.Id";
import UPVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Upvotes__c";
import DOWNVOTE_FIELD from "@salesforce/schema/SubReddit__c.No_Of_Downvotes__c";
import { updateRecord } from 'lightning/uiRecordApi';


export default class Reddit extends NavigationMixin(LightningElement) {

    @track isShowModal = false;
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

    @track contactsRecord;
    searchValue = '';
 
    // update searchValue var when input field value change
    searchKeyword(event) {
        this.searchValue = event.target.value;
    }
 
    // call apex method on button click 
    handleSearchKeyword(event) {
        this.searchValue = event.target.value;
        if (this.searchValue !== '') {
            getContactList({
                    searchKey: this.searchValue
                })
                .then(result => {
                    // set @track contacts variable with return contact list from server 
                    this.contactsRecord = result;
                })
                .catch(error => {
                   
                    const event = new ShowToastEvent({
                        title: 'Error',
                        variant: 'error',
                        message: error.body.message,
                    });
                    this.dispatchEvent(event);
                    // reset contacts var with null   
                    this.contactsRecord = null;
                });
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


    upVote(event){
        let recId2 = event.target.dataset.recordId;
        let upvote = event.target.dataset.No_Of_Upvotes__c;
        let downvote = event.target.dataset.No_Of_Downvotes__c;
        const fields ={};
        fields[ID_FIELD.fieldApiName] =recId2;
        fields[UPVOTE_FIELD.fieldApiName] = upvote+1;
        fields[DOWNVOTE_FIELD.fieldApiName] = downvote-1;
        const recordInput = {
            fields: fields
          };
updateRecord(recordInput).then((record) => {
    console.log(record);
})
        }
    downVote(event){
    }
    }