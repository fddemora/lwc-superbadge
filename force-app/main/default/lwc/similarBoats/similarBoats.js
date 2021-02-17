import { LightningElement, wire, api } from 'lwc';
import getSimilarBoats from '@salesforce/apex/BoatDataService.getSimilarBoats';
import { NavigationMixin } from 'lightning/navigation';

export default class SimilarBoats extends NavigationMixin(LightningElement) {
    currentBoat;
    relatedBoats;
    boatId;
    error;
    
    @api
    get recordId() {
        return this.boatId;
      }
    set recordId(value) {
        this.boatId = value;
        this.setAttribute('boatId', value);
      }
    
    @api
    similarBy;
    
    @wire(getSimilarBoats, {boatId:'$boatId', similarBy:'$similarBy'})
    similarBoats({ error, data }) { 
      if(data){
        this.relatedBoats = data;
      }
      else if(error){
        this.error = error;
      }
    }

    get getTitle() {
      return 'Similar boats by ' + this.similarBy;
    }
    get noBoats() {
      return !(this.relatedBoats && this.relatedBoats.length > 0);
    }
    
    // Navigate to record page
    openBoatDetailPage(event) { 
      this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
          actionName: "view",
          recordId: event.detail.boatId,
          objectApiName: 'Boat__c'
        }
      });
    }
  }
  