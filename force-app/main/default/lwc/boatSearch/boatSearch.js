import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

 // imports
 export default class BoatSearch extends NavigationMixin(LightningElement) {
    isLoading = false;

    // Handles loading event
    handleLoading() { 
      if(!this.isLoading){
        this.isLoading = true;
      }
    }
    
    // Handles done loading event
    handleDoneLoading() { 
      if(this.isLoading){
        this.isLoading = false;
      }
    }
    
    // Handles search boat event
    // This custom event comes from the form
    searchBoats(event) { 
      const boatTypeId = event.detail.boatTypeId;
      const childComponent = this.template.querySelector('c-boat-search-results');
      childComponent.searchBoats(boatTypeId); 
    }
    
    createNewBoat() { 
      this[NavigationMixin.Navigate]({
        type: 'standard__objectPage',
        attributes: {
          objectApiName: 'Boat__c',
          actionName: 'new'
        }
      });
    }
  }