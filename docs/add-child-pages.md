
# Add Child Pages

Allows a parent add their children in the app.

## Add Child Name Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/add-child-name-page.png)

* Hint text shows in the first and last name fields until the user types text
* The button should be disabled (gray and not clickable) until both fields are populated
* The password must meet the criteria under the first field
* When Next is enabled (purple) and clicked, it creates the child user, and then redirects them to the Add Child Birthdate Page
* "Cancel Adding Child" link takes the user to the home page

### Register Child 👑
Registers a new child user. Requires authentication as a parent user.

```http
POST /api/v1/users
```

Request Body:
```json
{
  "user": {
    "user_type": "child",
    "first_name": "Jane",
    "last_name": "Doe"
  }
}
```

Response (201 Created):
```json
{
  "user": {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Doe",
    "role": "child",
    "date_of_birth": "2020-01-01",
    "inner_circle": {
      "id": 1,
      "name": "Jane's Inner Circle"
    },
    "profile": {
      "has_image": false,
      "image_url": null,
      "initials": "JD"
    }
  }
}
```




## Add Child Birthdate Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/add-child-birthdate-page.png)

* The button should be disabled (gray and not clickable) until a birthdate is entered
* Focus on the birthdate brings up the native date selector for the phone
* "Cancel Adding Child" link takes the user to the home page
* After the birthdate is updated, the user is redirected to the Add Child Photo Upload Page

### Update User 👤
Updates a user's information. A user can only update their own information. For child users, members with admin role in their inner circle can also update their information.

```http
PATCH /api/v1/users/:id
```

Request Body (multipart/form-data):
```json
{
  "user": {
    "birthdate": "2020-01-01"
  }
}
```



## Add Child Photo Upload Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/add-child-photo-upload-page.png)

* "Choose a photo" opens the Photo Upload Bottom Sheet
* "Skip" takes the user to the Inner Circle Page


## Photo Upload Bottom Sheet

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/add-child-photo-upload-bottom-sheet.png)

* This should be a shared component (used in every place where a photo upload is allowed)
* "Take a photo" opens the camera for the user to take a photo and upload
* "Choose from library" takes the person to their phone's photo library to select a photo to upload
* After they've selected a photo, they will be taken to the Add Child Photo Confirmation Page


## Add Child Photo Confirmation Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/add-child-photo-confirmation-page.png)

* "Confirm" uploads the photo, and then takes them to the Inner Circle page for the child
* In case of an error, show a toast message with the API error message in a toast message
* "Choose a different photo" opens the Photo Upload Bottom Sheet

### Update Profile Image 👤
Updates a user's profile image. A user can only update their own profile image. For child users, members with admin role in their inner circle can also update their profile image.

```http
PATCH /api/v1/users/:id/profile_image
```

Request Body (multipart/form-data):
```
profile_image: [file]
```