
# Inner Circle Page

The Inner Circle controls the users who are associated with a child.  This page is used to administer who is in the Inner Circle and the permission levels.

Inner Circle is only one page, but there are different scenarios that can occur on the page which will be shown below.


## Features

- Only accessible to Inner Circle Members with an admin role
- Allows admins to invite and remove Inner Circle Members
- Admins can change permissions of Inner Circle Members
- Only Premium Accounts can have more than two Inner Circle Members with poster roles

### Roles

* Admin - can invite users and control permissions; there must be an admin for the Inner Circle
* Poster - can create Posts about the child and comment on Posts
* Viewer - can only view and comment on Posts

### Inner Circle Membership Process

- The Parent who created the child record automatically is created as an Inner Circle Member with the admin role
- The Child user is automatically created as an Inner Circle Member with a viewer status (viewers can only view and comment on posts about the child)
- All other users must be invited as an Inner Circle (and are created with the viewer role by default)

**If the invited person isn't a Growbook user yet:**

1.&nbsp;&nbsp;**Invitation Creation**

* Admin invites via email with role (viewer/poster/admin)
* System creates `InnerCircleInvitation` with:
    * Unique 32-character hex token
    * 7-day expiration
    * Assigned role
    * Reference to inviter
    * Reference to inner circle
2.&nbsp;&nbsp;**Email Notification** 
* System sends invitation email containing:
  * Inviter's name and details
  * Child's inner circle information
  * Signup URL with invitation token
  * Email appears from inviter's address 

3.&nbsp;&nbsp;**Signup Process**

* Invitee clicks signup link with token
* Completes registration
* Upon success, automatically:
  * Created as new `User`
  * Added to inner circle with assigned role
  * Invitation marked as accepted

4.&nbsp;&nbsp;**Invitation Management**
* Invitations expire after 7 days.
* System tracks pending invitations.
    * For repeat invitations:
        * Updates role if different.
        * Resends invitation email.
        * Resets expiration period

**If the invited person is already a Growbook user:**

1.&nbsp;&nbsp;**Immediate Addition**
* System finds existing user by email.
* Creates `InnerCircleMember` record with:
    * Assigned role (viewer/poster/admin)
    * Links to inner circle and user
* No invitation token needed.

2.&nbsp;&nbsp;**Role Validation**
* System checks if role is valid:
   * Premium accounts: unlimited posters and admins
   * Non-premium accounts:
        * Maximum 2 admins
        * Maximum 1 poster
    * All accounts: unlimited viewers

3.&nbsp;&nbsp;**Notification**
* User receives immediate access.
* Success response sent to admin.
* No signup/acceptance needed.

4.&nbsp;&nbsp;**Error Handling**
* If role exceeds limits:
   * For API calls: silently downgrades to viewer
   * For direct updates: returns validation error
* If user already in circle:
   * Returns "already a member" error
## Inner Circle

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle.png)

Child Info Section:
* The top image is the child's profile image
* The child's full_name is under their profile image

Inner Circle Section:
* `{child's first name}` replaces "Amalia" (in "Amalia's Inner Circle")
* Each Inner Circle Member is shown: 
  * User profile image
  * User full name
  * Permission level:
    * Admin - if Admin
    * "Can create posts" - if Poster
    * "Can only view and comment" if Viewer
* Pencil icon expands section which allows them to change the status of the Inner Circle Member
* Trash can icon shows Inner Circle Remove Member Bottom Sheet
* "Invite someone" opens the Inner Circle Invite Bottom Sheet
* "Add a child" button takes them to the Add Child Name Page
* "Go to home pape" is a link to the home page

### Show Inner Circle 👥
Returns details about a child's inner circle.

```http
GET /api/v1/children/:child_id/inner_circle
```

Response (200 OK):
```json
{
  "inner_circle": {
    "id": 1,
    "child": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "profile": {
        "has_image": true,
        "image_url": "/rails/active_storage/blobs/xxxx/child-profile.jpg",
        "initials": "JD"
      }
    },
    "members": [
      {
        "id": 1,
        "user": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "email": "parent@example.com",
          "profile": {
            "has_image": true,
            "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
            "initials": "JD"
          }
        },
        "role": "admin",
        "created_at": "2024-01-01T12:00:00Z"
      }
    ]
  }
}
```
## Expanded Permission Section (on pencil click)

User has Poster Role:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-change-permission(create+posts).png)
* Under their name it says "Can create posts"
* When the toggle is turned off:
  * Updates the Inner Circle Member role to "Viewer" role
  * "Can create posts" changes to "Can only view and comment"
* X icon collapses the section, like on page load

User has Viewer Role:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-change-permission(can't+create+posts).png)

* Under their name it says "Can only view and comment"
* When the toggle is turned on:
  * If they aren't Premium, they'll get an error if they try to enable this for more than one user - this error should be displayed via toast message
  * Updates the Inner Circle Member role to "Poster" role
  * "Can only view and comment" changes to "Can create posts" 
* X icon collapses the section, like on page load

### Update Member 👑

Updates a member's role in the inner circle. Requires Inner Circle admin role.

```http
PUT /api/v1/children/:child_id/inner_circle/members/:id
```

Request Body:
```json
{
  "member": {
    "role": "poster"
  }
}
```

Response (200 OK):
```json
{
  "id": 2,
  "user": {
    "id": 3,
    "first_name": "Member",
    "last_name": "One",
    "email": "member1@example.com",
    "profile": {
      "has_image": false,
      "initials": "MO"
    }
  },
  "role": "poster",
  "created_at": "2024-01-01T12:00:00Z"
}
```



## Remove Inner Circle Member (trash can icon clicked)

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-remove-member-bottom-sheet.png)
* Inner Circle Remove Member Bottom Sheet shows
* "Yes, remove them": 
  * Deletes the Inner Circle Member
  * Closes the bottom sheet
  * Shows a toast message on success
* "Cancel" closes the Bottom Sheet

### Remove Member 👑

Removes a member from the inner circle. Requires admin role.

```http
DELETE /api/v1/children/:child_id/inner_circle/members/:id
```

Response (200 OK):
```json
{
  "message": "Member removed successfully"
}
```

## Inner Circle Invite Bottom Sheet

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-invite-bottom-sheet.png)
* "Invite people using your contacts":
  * Makes the request to the device for phone contacts
  * If they decline access, they will still see the bottom sheet
  * If they approve access:
    * We import the email address and names from their contacts
    * Close the bottom sheet
    * Open the Inner Circle Invite Contacts Bottom Sheet
    * Show names and email addresses the Inner Circle Invite Contacts Bottom Sheet (do not store these values)
* "Add emails manually": 
  * Closes the bottom sheet
  * Opens the Inner Circle Invite by Email Bottom Sheet
* "Cancel" closes the bottom sheet


## Inner Circle Invite Contacts Bottom Sheet

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-invite-contacts-bottom-sheet.png)
* The list should be scrollable, as all contacts won't fit
* Contacts should be ordered by first name, ascending order
* "Send invitations" should be disabled until at least one contact is selected
* As they enter text in the search box (minimum of two characters)
  * We show any selected contacts right under the search box
  * We show the unselected contacts matching the search (first name, last name, or email) under that
  * If they remove the text from the search box (empty), we unfilter the list again
* When they select a contact, the appearance changes (see below)
* When they click the "Send invitations" button after selecting at least one contact, we invite the person/people
* "Cancel" closes the bottom sheet

**When a Contact is Selected**

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-invite-contacts-bottom-sheet-selected.png)

### Add Multiple Members API 👑
Adds multiple members to the inner circle or sends invitations for non-users. Requires admin role.

```http
POST /api/v1/children/:child_id/inner_circle/members/batch
```

Request Body:
```json
{
  "members": [
    {
      "email": "member1@example.com",
      "role": "viewer"
    },
    {
      "email": "member2@example.com",
      "role": "viewer"
    }
  ]
}
```

Response (207 Multi-Status):
```json
{
  "message": "Some invites failed",
  "results": {
    "successful": [
      {
        "email": "existing@example.com",
        "status": "added_to_circle",
        "role": "viewer",
        "requested_role": "viewer"
      },
      {
        "email": "new@example.com",
        "status": "invitation_sent",
        "role": "viewer",
        "requested_role": "poster"
      }
    ],
    "failed": []
  }
}
```

Notes:
- For existing users: they are added directly to the inner circle (status: "added_to_circle")
- For non-users: an invitation is created and email sent (status: "invitation_sent")
- If an invitation already exists: the invitation is updated and resent (status: "invitation_resent")
- The role may be downgraded to "viewer" if:
  - Non-premium account already has a poster
  - Invalid role requested



## Inner Circle Invite by Email Bottom Sheet

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-invite-by-email-bottom-sheet.png)
* The list may need be scrollable, if they add more people than a page
* "Invite more people" adds text boxes for "Enter email address"
* "Send invitations" should be disabled until: 
  * At least one valid format email address is entered (we should be able to use something similar to what was done for the email address on the Sign Up Page)
  * All fields email fields that are populated have valid format emails
* When they a valid email address, the appearance changes (see below)
* When they click the "Send invitations" button when valid format emails are entered:
  * We invite the person/people
  * Close the bottom sheet
  * Show a toast message "`{child's first_name}` Inner Circle is expanding! Your invitations have been sent."
* "Cancel" closes the bottom sheet


**When a Valid Format Email is Entered**

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/inner-circle-invite-by-email-bottom-sheet-email-populated.png)

### Add Multiple Members API 👑
Adds multiple members to the inner circle or sends invitations for non-users. Requires admin role.

```http
POST /api/v1/children/:child_id/inner_circle/members/batch
```

Request Body:
```json
{
  "members": [
    {
      "email": "member1@example.com",
      "role": "viewer"
    },
    {
      "email": "member2@example.com",
      "role": "viewer"
    }
  ]
}
```

Response (207 Multi-Status):
```json
{
  "message": "Some invites failed",
  "results": {
    "successful": [
      {
        "email": "existing@example.com",
        "status": "added_to_circle",
        "role": "viewer",
        "requested_role": "viewer"
      },
      {
        "email": "new@example.com",
        "status": "invitation_sent",
        "role": "viewer",
        "requested_role": "poster"
      }
    ],
    "failed": []
  }
}
```

Notes:
- For existing users: they are added directly to the inner circle (status: "added_to_circle")
- For non-users: an invitation is created and email sent (status: "invitation_sent")
- If an invitation already exists: the invitation is updated and resent (status: "invitation_resent")
- The role may be downgraded to "viewer" if:
  - Non-premium account already has a poster
  - Invalid role requested
