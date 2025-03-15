
# Profile Page

There are two versions of the Profile Page depending on if the user is viewing their own page, or their child's (only parents).

## Entry Points

Adult Profile page (it means that the user are editing their own profile) has a link in the Settings menu to it.

Child Profile page (it means that the parent is trying to change the profile of one of their children - or deleting their account) has a link in the Settings menu to it.


## Profile Page Components
There's a two versions of Profile Pages - Adult Profile Pages and Child Profile Pages.  The pages can be the same, but just show different content/components.

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/adult-profile.png)

* For adults, we have "Profile", for children the title is the Child's name
* The Profile Image shows for both Adults and Children
  * When it's clicked show the Photo Upload Bottom Sheet
  * After they selected an image
    * Upload the profile image
    * Update the image without a full page reload
    * Show a success toast message "Photo uploaded successfully"
* If the child's Inner Circle does NOT belongs to a Premium account, we show a Premium Upgrade Created
  * When the link is card is clicked, it goes to the Premium Landing Page
  * If the Inner Circle Account is already Premium, don't show this Card
* Form
  * The first and last names show whether this is a for a Parent or Child
  * Email field
    * If the user being viewed, has an email address, show the email field
    * If this field is nil, don't show it
  * The button should only be enabled, if a form field value changed
* "Delete account" link shows the Delete Account Bottom Sheet

### Child Profile
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/child-profile.png)

* If this a child, show the birthdate field (required)

### Delete Account Bottom Sheet (clicked from an Adult Profile)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/delete-account-bottom-sheet.png)

* "Cancel" closes the bottom sheet
* "Delete all data"
  * Deletes the account of the current user (which also deletes the Inner Circle and Children associated with the parent, if there are any)
  * Logs the user out of the app

### Delete Account Bottom Sheet (clicked from a Child Profile)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/delete-child-account-bottom-sheet.png)

* "Cancel" closes the bottom sheet
* "Delete the Data and Memories"
  * Deletes the account of the Child
  * Redirects the user to the Manage Children Page
