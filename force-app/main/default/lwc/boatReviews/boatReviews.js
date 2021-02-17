import { LightningElement, api } from 'lwc';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import getAllReviews from '@salesforce/apex/BoatDataService.getAllReviews';
import { NavigationMixin } from 'lightning/navigation';

export default class BoatReviews extends NavigationMixin(LightningElement) {
  boatId;
  error;
  boatReviews;
  isLoading;
  SmallPhotoUrl;
  

  @api
  get recordId() {
    return this.boatId;
   }
  set recordId(value) {
    this.setAttribute('boatId', value);
    this.boatId = value;
    this.getReviews();
  }
  
  get reviewsToShow() { 
    if(this.boatReviews && this.boatReviews.length > 0){
      return true;
    }
    return false;
  }
  
  @api
  refresh() { 
    this.getReviews();
    getRecordNotifyChange([{recordId: this.boatId}]);
  }
  
  getReviews() {
    this.isLoading = true;
    getAllReviews({ boatId: this.boatId})
      .then(result => {
        if(result === null){
          this.boatReviews = null;
          this.isLoading = false;
          return;
        }
        this.boatReviews = result;
        this.isLoading = false;
      }).catch(err => {
        this.error = err;
        this.isLoading = false;
      });
   }
  
  navigateToRecord(event) { 

     event.preventDefault();
     event.stopPropagation();
    
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
           recordId: this.template.querySelector('a').dataset.recordId,
           objectApiName: 'User',
           actionName: 'view'
      }
    }).catch(err => {
      this.error = err;
    });
   }

}
