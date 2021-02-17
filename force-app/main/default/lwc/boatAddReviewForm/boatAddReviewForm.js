import { LightningElement, api } from 'lwc';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
import BOAT_REVIEW_OBJECT from '@salesforce/schema/BoatReview__c';
import NAME_FIELD from '@salesforce/schema/BoatReview__c.Name';
import COMMENT_FIELD from '@salesforce/schema/BoatReview__c.Comment__c';
import RATING_FIELD from '@salesforce/schema/BoatReview__c.Rating__c';



const SUCCESS_TITLE = 'Review Created!';
const SUCCESS_VARIANT = 'success';

export default class BoatAddReviewForm extends LightningElement {
    // Private
    boatId;
    rating = RATING_FIELD;
    boatReviewObject = BOAT_REVIEW_OBJECT;
    nameField        = NAME_FIELD;
    commentField     = COMMENT_FIELD;
    labelSubject = 'Review Subject';
    labelRating  = 'Rating';
    
    @api get recordId() {
        return this.boatId;
     }
     set recordId(value) {

      this.setAttribute('boatId', value);
      this.boatId = value;   
    }
    
    handleRatingChanged(event) { 
      this.rating = event.detail.rating;
    }


    handleSubmit(event) {
      event.preventDefault();
      const fields = event.detail.fields;
      fields.Rating__c = this.rating;
      fields.Boat__c = this.boatId;
      this.template.querySelector('lightning-record-edit-form').submit(fields);
     }
    
 
    handleSuccess() {      
      const evt =  new ShowToastEvent({
         title: SUCCESS_TITLE,
         variant: SUCCESS_VARIANT
        });
      this.dispatchEvent(evt);
      const customEvt = new CustomEvent('createreview');
      this.dispatchEvent(customEvt);
      this.handleReset();
    }
    
    handleReset() {
      const inputFields = this.template.querySelectorAll(
        'lightning-input-field'
        );
      if(inputFields) {
        inputFields.forEach(element => {
          element.reset();
        });
      }
     }
  }
  