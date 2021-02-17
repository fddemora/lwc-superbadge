import { LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import labelDetails from '@salesforce/label/c.Details';
import labelReviews from '@salesforce/label/c.Reviews';
import labelAddReview from '@salesforce/label/c.Add_Review';
import labelFullDetails from '@salesforce/label/c.Full_Details';
import labelPleaseSelectABoat from '@salesforce/label/c.Please_select_a_boat';
import BOAT_OBJECT from '@salesforce/schema/Boat__c';
import BOAT_ID_FIELD from '@salesforce/schema/Boat__c.Id';
import BOAT_NAME_FIELD from '@salesforce/schema/Boat__c.Name';
import BOAT_TYPE_FIELD from '@salesforce/schema/Boat__c.BoatType__c';
import BOAT_LENGTH_FIELD from '@salesforce/schema/Boat__c.Length__c';
import BOAT_PRICE_FIELD from '@salesforce/schema/Boat__c.Price__c';
import BOAT_DESCRIPTION_FIELD from '@salesforce/schema/Boat__c.Description__c';
import BOATMC from '@salesforce/messageChannel/BoatMessageChannel__c';  
import { subscribe ,APPLICATION_SCOPE, MessageContext } from 'lightning/messageService';
import { NavigationMixin} from 'lightning/navigation';


const BOAT_FIELDS = [BOAT_ID_FIELD, BOAT_NAME_FIELD];
 
export default class BoatDetailTabs extends NavigationMixin(LightningElement) {
  boatId;
  objectApiName = BOAT_OBJECT;
  boatType = BOAT_TYPE_FIELD;
  boatLength = BOAT_LENGTH_FIELD;
  boatPrice = BOAT_PRICE_FIELD;
  boatDescription = BOAT_DESCRIPTION_FIELD;
  
  @wire(getRecord, { recordId: '$boatId', fields: BOAT_FIELDS})
  wiredRecord;
  label = {
    labelDetails,
    labelReviews,
    labelAddReview,
    labelFullDetails,
    labelPleaseSelectABoat
  };
  

  get detailsTabIconName() {
      return this.wiredRecord.data ? 'utility:anchor' : null; 
   }
  
  get boatName() { 
      return this.wiredRecord.data ? getFieldValue(this.wiredRecord.data, BOAT_FIELDS[1]) : '';
  }
  
  
  subscription = null;

  @wire(MessageContext)
  messageContext;

  subscribeMC() {
    if(!this.subscription){
        this.subscription = subscribe(
            this.messageContext,
            BOATMC,
            (message) => {
                this.boatId = message.recordId;
            },
            { scope: APPLICATION_SCOPE }
        );
    }
  }
  
  connectedCallback() { 
      this.subscribeMC();
  }
  
  navigateToRecordViewPage() { 
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: this.boatId,
            objectApiName: 'Boat__c',
            actionName: 'view'
        }
    })
  }
  
  handleReviewCreated() {
    this.template.querySelector(`lightning-tabset`).activeTabValue = 'Tab Two';
    this.template.querySelector('c-boat-reviews').refresh();
   }
}
