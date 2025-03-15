
# Premium Subscription Plans

We need to allow for users to subscribe (become Premium accounts), change their subscription plan, and cancel their plans.

Most subscriptions will originate in the mobile app, but some will be from web.




## Start Subscription

### Growbook Premium
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/premium-upgrade.png)

* The customer has the choice of subscribing to a monthly or annual plan
  * The pricing info should come from the App Store (iOS) or Play Store (Android)
* We'll use the same page for cancelling subscriptions, but some of the content will change
  * Title
    * If they get to this page from the Billing Page, it should be "Manage Plan"
    * Else "Growbook Premium"  
  * Cancelation link
    * If they get to this page from the Billing Page and have an active subscription 
      * Their current plan type is selected
      * Show a cancelation link ("Cancel plan") that starts the cancellation flow
        * What happens here depends on where they signed up from (web or mobile app) and their operating system (Play Store or App Store subscription)
    * Else this cancelation section is hidden
* "Continue" button 
  * Should be deactivated unless they have made a change in the radio button selected
  * When they click continue, the bottom sheet (below) should show 

### Bottom Sheet
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/premium-upgrade-bottom-sheet.png)

* If they submit and finish the payment
  * Close the bottom sheet
  * We close the page
  * We show a toast confirmation message, "Welcome to Premium! 🎉 Enjoy videos, milestones, and family sharing. Happy Growbooking! ✨"
