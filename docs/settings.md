
# Settings

In the Settings section, users can do things like:

* Manage their Children
* Profile
* Security
* Billing
* Notifications (settings)
* Support (external link)
* View policies (Terms and Conditions, Privacy)
* See the app version
* Log out

## Settings Menu

Placeholder image:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/settings-page.png)

* User get here from the bottom navbar
* Links
  * "Manage Children" goes to the Manage Children page
    * Only shows if the person has a child
  * "Time Capsules" goes to the Time Capsules page
    * Only shows if the person has a child
  * "Profile" goes to the Profile page (for the user)
  * "Security" goes to the Security page
  * "Notifications" goes to the Notifications (Setting) page
  * "Billing" goes to the Billing page
  * "Support" goes to external URL (open in browser tab outside of app)
  * "Terms and Conditions" goes to the Terms and Conditions page
  * "Privacy Policy" goes to the Privacy Policy page
* App Version - shows current app version (shouldn't require manual changes on updates)
* "Log out" logs out the user



## Manage Children Page

Screeen design in progress

* Inner Circle links to the child's inner circle page
* Profile links to the child's profile settings page
* "Add a Child" links to the New Child Page

## GET /api/v1/users/my_children 🔒

Returns a list of the current user's children. Use this to show the children and create the links to their Inner Circle and Profile pages.

```http
GET /api/v1/users/my_children
```

Response (200 OK):
```json
[
  {
    "id": 123,
    "first_name": "John",
    "last_name": "Doe",
    "birth_date": "2020-01-15",
    "age": "5 years 2 months",
    "profile_image_url": "https://example.com/images/john.jpg"
  },
  {
    "id": 456,
    "first_name": "Jane",
    "last_name": "Doe",
    "birth_date": "2022-03-10",
    "age": "3 years",
    "profile_image_url": "https://example.com/images/jane.jpg"
  }
]
```

Error Response (403 Forbidden):
```json
{
  "error": "Only parent users can access this endpoint"
}
```

## Security Page

Same page as the Password Reset Page with a different title (change the title based on if the user clicked from the Settings Menu)

* Works the same as the Password Reset Page (when they click to go here, they just need to add matching password field values that meet the criteria)

### Change Password 🔓
Updates the user's password.

```http
PATCH /api/v1/users
```

Request Body:
```json
{
  "user": {
    "current_password": "your_current_password",
    "password": "your_new_password",
    "password_confirmation": "your_new_password"
  }
}
```

## Notification Settings Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/notification-settings-page.png)

Mapping UI Toggles to API Settings

Here's how each toggle in the UI maps to the corresponding setting in the API:

Posts Section

| UI Toggle | API Setting | Description |
|-----------|-------------|-------------|
| New Posts about a Child You Follow | new_post_notifications | Get notified when there's a new post about a child you're connected to |
| Post Comments | post_comment_notifications | Get notified when someone comments on your post |
| Post Likes | post_notifications | Get notified when someone likes one of your posts |

Comments Section

| UI Toggle | API Setting | Description |
|-----------|-------------|-------------|
| Comment Likes | comment_notifications | Get notified when someone likes one of your comments |
| Comment Replies | comment_reply_notifications | Get notified when someone comments on your post |

Inner Circle Notifications Section

| UI Toggle | API Setting | Description |
|-----------|-------------|-------------|
| New Inner Circle Members | inner_circle_notifications | Get notified when someone joins your child's Inner Circle |
| Role Changes | role_notifications | Get notified when your role is upgraded from viewer to poster or admin |

Time Capsules Section

| UI Toggle | API Setting | Description |
|-----------|-------------|-------------|
| Time Capsule Published | time_capsule_notifications | Get notified when a Time Capsule your parent made for you is published |

### Get Notification Settings 🔒

Retrieves the current user's notification settings.

**URL**: `/api/v1/notification_settings`

**Method**: `GET`

**Authentication**: Required

**Response**:

```json
{
  "settings": {
    "post_notifications": true,
    "comment_notifications": true,
    "inner_circle_notifications": true,
    "time_capsule_notifications": true,
    "new_post_notifications": true,
    "child_inner_circle_join_notifications": true
  },
  "success": true
}
```

### Update Notification Settings 🔒

Updates the current user's notification settings.

**URL**: `/api/v1/notification_settings`

**Method**: `PATCH`

**Authentication**: Required

**Request Body**:

```json
{
  "post_notifications": true,
  "comment_notifications": true,
  "inner_circle_notifications": true,
  "time_capsule_notifications": true,
  "new_post_notifications": true,
  "child_inner_circle_join_notifications": true
}
```

**Response (Success)**:

```json
{
  "settings": {
    "post_notifications": true,
    "comment_notifications": true,
    "inner_circle_notifications": true,
    "time_capsule_notifications": true,
    "new_post_notifications": true,
    "child_inner_circle_join_notifications": true
  },
  "success": true
}
```

**Response (Error)**:

```json
{
  "errors": ["Error message"],
  "success": false
}
```


## Billing Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/billing-page.png)

* If the person has an active premium, plan, we show the top section with their current plan
  * If they aren't on a Premium plan (means they are on a Free plan), instead put:
    * Free (instead of Yearly)
    * $0.00 instead of $24.99/year
    * Instead of "Includes family sharing" put a link "Unlock more features and memories with Premium!" to the Upsell page
    * Don't show $49.99/year (also, don't show this if this person is on a monthly plan)
  * If the person has a paid plan
    * If they paid through Google, get the payment info (plan, payment info and invoice links, and next billing info) first, and then check Stripe for invoices and payment info (in case they previously paid on the web)
    * If they paid through Apple, get the payment info (plan, payment info and invoice links, and next billing info) first, and then check Stripe for invoices and payment info (in case they previously paid on the web)
* If they have next bill (they're on automatic subscription renewals), put the the "Your next bill section"



## App Version

The app version should show on the settings menu.  It should be read from our code, so this page doesn't need a manual change for each release.


## Log out

Same page as the Password Reset Page with a different title (change the title based on if the user clicked from the Settings Menu)

* Works the same as the Password Reset Page (when they click to go here, they just need to add matching password field values that meet the criteria)

### Sign Out 🔒
Invalidates the current user's API token.

```http
DELETE /api/v1/users/sign_out
```

Response (200 OK):
```json
{
  "message": "Signed out successfully"
}
```