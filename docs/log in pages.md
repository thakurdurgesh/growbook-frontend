
# Log In Pages

Log in page, and the pages related to forgotten password.


## Features

- Let user log in
- Let user request code for resetting password
- Allow customer to change their password


## Log In Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/log+in.png)

* Log in page should be disabled (greyed out) until email address and password are populated
* Password field should be masked by default (unmasked when the eye icon clicked)
* "Forgot password?" link should show an error if the email field is blank or if the email address can't be found
* "Forgot password?" sends an email with a code, and then redirects to the Forgot Password page
* "Sign up" goes to the Sign up landing page


### Email Sign In
Signs in a user and returns an authentication token.

```http
POST /api/v1/users/sign_in
```

Request Body:
```json
{
  "user": {
    "email": "parent@example.com",
    "password": "password123"
  }
}
```

Response (200 OK):
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "email": "parent@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "parent",
    "profile": {
      "has_image": true,
      "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
      "initials": "JD"
    }
  }
}
```

### Google Sign In
Signs in a user and returns an authentication token.

Request Body:
TBD


### Forgot Password
When this link is clicked:

* Verifies that email is entered and vaid
  * use EmailInput component
  * If invalid, show error toast message "Please check the email entered"
  * If valid, makes call to Request Verification Code API
    * If the call is successful:
      * Redirect them to the Forgot Password page
    * Else, an error toast message with "We hit a snag. Please give it another try in a bit. We're on it!" 


### Request Verification Code

Sends a verification code to the specified email address.

```
POST /api/v1/users/email_verification
```

#### Request Parameters

| Parameter | Type   | Required | Description                                |
|-----------|--------|----------|--------------------------------------------|
| email     | string | Yes      | The email address to send the code to      |

#### Response

**Success (200 OK)**

```json
{
  "message": "If your email exists in our system, a verification code has been sent."
}
```

> Note: For security reasons, the response is the same whether the email exists or not to prevent user enumeration attacks.

**Error (422 Unprocessable Entity)**

```json
{
  "error": "Email is required"
}
```

**Error (429 Too Many Requests)**

```json
{
  "error": "Too many verification code requests. Please try again later.",
  "code": "rate_limited"
}
```


## Forgot Password Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/forgot-password-page.png)

* User populates code once they get the email
* "name@gmail.com" will change to whatever email they populated on the previous page
* Note: the image shows "From Messages", but this is wrong (the code won't come from SMS)
* After six numbers are entered, the number is submitted for checking. 
  * If it's wrong: 
    * Reset the numbers fields to nil
    * Show the an error toast with the message from the API
  * If the code, is correct, the user is taken to the Change Password Page.

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


## Change Password Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/change-password-page.png)

* The button should be disabled (gray and not clickable) until: (1) the user enters a valid password meeting the minimum criteria; and (2) the password confirmation field matches the first password field.
* By default, the password fields are masked (they click the eye icon to toggle it and show the password)
* The password must meet the criteria under the first field
* The criteria are changed to green as they are met (and changed back to gray, if the password changes and the criteria isn't met anymore)

### Password Reset
Updates the password for the user in the database.

Request Body:
TBD