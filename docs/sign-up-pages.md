
# Sign In Pages

Sign in landing and Sign in email pages.


## Features

- Let the user create an account with their Google account or email
- Let the user see the terms of use and privacy policy


# Sign Up Pages

Sign up landing and Sign up email pages.


## Features

- Let the user create an account with their Google account or email
- Let the user see the terms of use and privacy policy


## Sign Up Landing Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+landing+page.png)

* Sign up with Google creates a Growbook account using the user's Google account
* "Use my email" takes them to the Sign up email page
* "Terms of Service" link open browser page for Terms
* "Privacy Policy" link open browser page for Privacy Policy
* "Log in" goes to the Log in page


### Sign up with Google
Associates Google account with new user.

I have some sample code (already referencing the right credentials) to start this from React Native.



## Sign Up Email Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+email.png)

* Hint text shows in the email and password fields (Email and Password) until the user types text in their (see screenprint from Log in Page for example)
* The 'x' icon only shows in the email field after someone types text in their (when clicked, it deletes the entered text)
* The button should be disabled (gray and not clickable) until, all of these conditions are met: 
  * they enter an email that looks like a valid format (I created an EmailInput.tsx component for this)
  * the user enters a valid password meeting the minimum criteria; and
  * the password confirmation field matches the first password field.
* By default, the password fields are masked (they click the eye icon to toggle it and show the password)
* The password must meet the criteria under the first field
* The criteria are changed to green as they are met (and changed back to gray, if the password changes and the criteria isn't met anymore)
* The user is redirected to the Sign Up Confirmation Page after this

### Register Parent API 🔓
Registers a new parent user.

```http
POST /api/v1/users
```

Request Body:
```json
{
  "user": {
    "email": "testparent12@example.com",
    "password": "password",
    "password_confirmation": "password",
    "user_type": "parent"
  }
}
```

Response (201 Created):
```json
{
  "id": 1,
  "email": "parent@example.com",
  "user_type": "parent"
}
```




## Sign Up Confirmation Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign-up-confirmation.png)

* The user will be emailed a code that they need to enter here to confirm their account before they can use the app
* The code should be automatically sent to the API when six digits are entered
* If the code is wrong, they whould see an error message and the fields for the code should be cleared
* They will not be able to use the app until they successfully confirm
* If they confirm, they will be redirected to the Sign Up Name page
User email

### Confirm Code API
Confirms if code entered matches the one in the DB for the email address.  If yes, the user should be allowed to change the password.

```
POST /api/v1/users/email_verification/verify
```

#### Request Parameters

| Parameter | Type   | Required | Description                           |
|-----------|--------|----------|---------------------------------------|
| email     | string | Yes      | The email address to verify           |
| code      | string | Yes      | The 6-digit verification code         |

#### Response

**Success (200 OK)**

For new users completing registration:
```json
{
  "message": "Email verified successfully",
  "email_verified": true,
  "api_token": "your_api_token_here"
}
```

For existing users:
```json
{
  "message": "Email verified successfully",
  "email_verified": true
}
```


## Sign Up Name Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+name.png)

* The Next button will be enabled when the first and last name are populated
* After successfully updating the name, the user will be redirected to the Sign Up Upload Photo page

### Update User API
Updates the first_name and last_name of the user.

```http
PATCH /api/v1/users/:id
```

Body (form-data):
```
user[first_name]: string      
user[last_name]: string 
```

Response (200 OK):
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "full_name": "John Doe",
  "user_type": "parent",
  "measurement_type": "feet_pounds",
  "profile_image_urls": {
    "original": "https://imagedelivery.net/hash/abc123/public",
    "thumbnail": "https://imagedelivery.net/hash/abc123/thumbnail",
    "display": "https://imagedelivery.net/hash/abc123/medium"
  }
}
```

## Sign Up Upload Photo Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+upload+photo.png)

* "Choose a photo" will show the Photo Upload Bottom Sheet (for the user to choose a photo from their library or take a photo with the camera)
* "Skip" takes the user to the Sign Up Add Child? Page


## Photo Upload Bottom Sheet

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/photo+bottom+sheet.png)

* This should be a shared component (used in every place where a photo upload is allowed)
* "Take a photo" opens the camera for the user to take a photo and upload
* "Choose from library" takes the person to their phone's photo library to select a photo to upload
* After they've selected a photo, they will be taken to the Sign Up Photo Confirmation page


## Sign Up Photo Confirmation Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+photo+confirmation.png)

* "Confirm" uploads the image and then redirects the user to the Sign Up Add Child? Page
* "Choose a different photo" takes the user back to the Photo Bottom Sheet

### Update Profile Image API
Updates only a user's profile image. Users can only update their own profile image unless they are an admin.

```http
PATCH /api/v1/users/:id/profile_image
```

Body (form-data):
```
profile_image: file              # Required
```

#### Profile Image Requirements
- Allowed formats: JPEG, PNG, GIF, HEIC, HEIF
- Images are uploaded to Cloudflare Images
- Image variants (thumbnail, medium) are configured in Cloudflare Images dashboard

Response (200 OK): Same as Update User response.


## Sign Up Add Child?

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/sign+up+-+add+child_.png)

* If the user uploaded a photo, a toast message will show "Photo uploaded successfully"
* "I'm Ready to Celebrate" takes the user to the Add Child Name page
* "No, thanks" takes the user to the Home page
