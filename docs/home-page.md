# Home Page

The feed that shows the posts of children that this user is an Inner Circle Member of.


## Features

From this page, the user can:

- Search posts (clicking the search icon)
- Filter the children that show in the feed (filter icon at the top of the page)
- See when they have Notifications (and click to go to the Notifications page)
- Scroll through posts
- Like and bookmark posts
- Comment on posts


## Top and Bottom Nav

***Top Navigation***

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/top-nav.png)

* Magnifying glass Icon goes to the Search Page
* Filter icon goes to the Filter Page
* Bell icon goes to the Notifications Page
  * When there notifications that haven't been seen then a red dot appears over the icon

***Bottom Navigation***

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/bottom-nav.png)

* Home goes to Home Page
* Resource goes to Resources Page
* Post
  * If this is a Parent, it opens Select Post bottom sheet (show on the New Post page)
  * If this is NOT a parent, it goes to the New Post page
* Timeline (which should say Chapters instead) goes to Chapters Page
* Settings goes to Settings page

## Search Page
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/search-page.png)

* The top of the page has a search bar (ignore the results shown below it, instead show posts component used on the Posts page)
  * As soon as the user clicks two characters submit the Search
  * Submit a new search when the value in the search box changes (as long as there at least two characters)
* "Cancel" closes the page and returns the user to the home page

#### Empty State Search Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/search-empty-state.png)

If no Posts are returned after a search is submitted.

### Search Posts 🔒
Searches for posts based on query.

```http
GET /api/v1/search/posts
```

Query Parameters:
| Parameter | Description |
| :-------- | :-------------------------------- |
| `q` | Search query |

Response (200 OK):
```json
{
  "posts": [
    {
      "id": 1,
      "content": "First steps today!",
      "date": "2024-01-01",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "child": {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Doe",
        "profile": {
          "has_image": true,
          "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
          "initials": "JD"
        }
      },
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
          "has_image": true,
          "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
          "initials": "JD"
        }
      },
      "bookmarked_by_current_user": true,
      "age": "18 months old"
    }
  ],
  "meta": {
    "total_pages": 1,
    "current_page": 1,
    "total_count": 1
  }
}
```

## Filter Children Page
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/filter.png)

* This overlay shows all of the children that the user is a Inner Circle Member of, and it allows them to select only certain children's Posts to show on the Home page
* "Apply" button is disabled until they select at least one children
* When they type at least two characters in the search, it filters the children shown
* When the user makes changes to the search field, as long as there are two characters, another search should be done (e.g. when they add a letter or delete a letter from the search field)
* Once a child is selected, they should remain selected unless they are unselected
* When they click the enabled "Apply" button, it filters closes the page, and shows only the Posts for the Children selected on the Home page

When a child is selected:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/filter-selected.png)

### Search Children API 👥
Searches for children the user has access to via inner circle membership.

```http
GET /api/v1/search/children
```

Query Parameters:
| Parameter | Description |
| :-------- | :-------------------------------- |
| `q` | Search query |

Response (200 OK):
```json
{
  "children": [
    {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "last_name_initial": "D.",
      "date_of_birth": "2020-01-01",
      "age": 3,
      "age_in_months": 47,
      "age_in_days": 1460,
      "measurement_type": "centimeters_kilograms",
      "inner_circle_role": "admin",
      "profile": {
        "has_image": true,
        "image_url": "https://example.com/profile.jpg",
        "initials": "JD"
      }
    }
  ]
}
```


## Notifications Page
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/notifications-page.png)


* There are different notifications, so we may need to account for the different types as they have different layouts.
  * Notification with no View Button
  * Notification with View Button
  * If there's no view button, there will only be one place that people can can go with a notification is clicked
  * If there's a view button, they will go to one page if they click the view button, and another if they click on the rest of the notification
* The API will send the text to post and where to go when someone clicks (one link if there's no view button, two if there's a view button)
* When a post has never been viewed (read_at: null), put a purple background (otherwise white)

### Empty State (no Notifications returned)

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/notifications-empty-page.png)

***Note: for notifications to work, we'll need to send the device token sent to the server:***

```
// When the app starts up
useEffect(() => {
  // Request notification permissions
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    
    if (authStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      // Get the token
      const token = await messaging().getToken();
      
      // Send token to your backend
      registerDeviceToken(token);
    }
  }
  
  requestUserPermission();
  
  // Listen for token refresh
  const unsubscribe = messaging().onTokenRefresh(token => {
    // Send the new token to your backend
    registerDeviceToken(token);
  });
  
  return unsubscribe;
}, []);

// Function to send token to backend
const registerDeviceToken = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/notification_tokens`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification_token: {
          token: token,
          platform: Platform.OS // 'ios' or 'android'
        }
      }),
    });
    
    const data = await response.json();
    console.log('Device token registered:', data);
  } catch (error) {
    console.error('Error registering device token:', error);
  }
};
```

### GET /api/v1/notifications

Returns the current user's notifications and automatically marks them as read.

**Parameters:**
- `page` (optional): The page number (default: 1)
- `per_page` (optional): The number of notifications per page (default: 20)

**Response:**
```json
{
  "notifications": [
    {
      "id": 1,
      "action": "liked_post",
      "read_at": "2025-03-04T06:00:00Z",
      "created_at": "2025-03-04T05:00:00Z",
      "message": "John Doe loved your post! 🤩",
      "url": "/posts/123",
      "data": {
        "post_id": 123
      },
      "actor": {
        "id": 456,
        "name": "John Doe"
      },
      "notifiable": {
        "id": 123,
        "type": "Post"
      }
    }
  ],
  "meta": {
    "total_count": 10,
    "unread_count": 5,
    "current_page": 1,
    "total_pages": 1
  }
}
```

## Home Page
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/home-page.png)

The posts should be built as a reusable component since they can show on different pages

* The name of the child and their avatar are at the top of the post
* Bookmark - Bookmarks (or remove from user's Bookmarks if they clicked after previously bookmarking the post)
* Three dot icon opens Post More Actions (bottom sheet)
* Next, photo/videos if present
  * This is a carousel section that the user can swipe to see more
  * Thumbnails of the photos/videos show to indicate where they are in the carousel
* Then, data from the posts and associated records
  * Chips that show only IF, there is a:
    * First record associated with the Post
    * Achievement record associated with the Post
    * Meaurement record associated with the Post
    * Favorite tag associated with the Post
    * Likes tag associated with the Post 
    * Dislikes tag associated with the Post
  * Post body ("Liam, just...")
  * Show the changes made to the values of the associated records above (not shown here)
  * Post date (age of the child) ("Aug 14, 2024 (18 months old)")  
  * Icons
    * Heart - Likes (or Unlikes if they already liked) Post - changes count and color without reload
    * Talk bubble - Comments bottom sheet opens - count of comments changes without page reload
    * [ignore the airplane icon - do not include in UX]

## Post More Actions Bottom Sheet
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/post-more-actions.png)

- Report user will allow them to flag this Post/user
- Edit post, show if they created the post (they are the post.user)
  - Closes the bottom sheet
  - Takes them to a page like the Create one, with the values populated based on the post data
- Make private, show if this is an Inner Circle Member with an admin role for this child
  - Closes the bottom sheet
  - Hides the post for everyone
- Delete post, show if they created the post (they are the post.user)
  - Closes the bottom sheet
  - Opens Delete Post Bottom Sheet (or changes to it)

## Delete Post Bottom Sheet
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/delete-post-bottom-sheet.png)

Allows the person to delete a Post, if they posted it.


## Empty States for Home Page

The empty state (no posts returned needs to be different based on if this is a parent or not because most non-parents can not Post.  There's a boolean value to check for if there are no Posts returned, in the response.

***If they are a parent***

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/home-empty-state-parent.png)

***If they are a parent***

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/home-empty-state-not-a-parent.png)

### List All Posts 🔒
Returns all posts the current user has access to through their inner circle memberships.

Response (200 OK):
```json
{
  "posts": [
    {
      "id": 1,
      "content": "First steps today!",
      "date": "2024-12-30",
      "created_at": "2024-12-30T12:00:00Z",
      "updated_at": "2024-12-30T12:00:00Z",
      "first_changed": false,
      "achievement_changed": false,
      "measurement_changed": false,
      "favorites_changed": false,
      "dislikes_changed": false,
      "likes_changed": false,
      "first": null,
      "achievement": null,
      "measurement": null,
      "favorites": null,
      "dislikes": null,
      "likes": null,
      "bookmarked_by_current_user": false,
      "age": "2 years old",
      "child": {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Doe",
        "profile": {
          "has_image": true,
          "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
          "initials": "JD"
        }
      },
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
      }
    }
  ],
  "meta": {
    "is_parent": true,
    "children": [
      {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Doe",
        "is_parent": true,
        "is_premium": true,
        "can_post": true
      },
      {
        "id": 3,
        "first_name": "John",
        "last_name": "Smith",
        "is_parent": false,
        "is_premium": false,
        "can_post": false
      }
    ]
  }
}
```

The response always includes metadata about the user and children, even when posts are found:
- `is_parent`: Boolean indicating if the current user is a parent user
- `children`: Array of children data with the following properties:
  - `id`: The child's ID
  - `first_name`: The child's first name
  - `last_name`: The child's last name
  - `is_parent`: Boolean indicating if the current user is the parent of this child
  - `is_premium`: Boolean indicating if the child's inner circle has a premium account
  - `can_post`: Boolean indicating if the current user is authorized to post about this child

When no posts are found, the response will have an empty posts array:

```json
{
  "posts": [],
  "meta": {
    "is_parent": true,
    "children": [
      {
        "id": 2,
        "first_name": "Jane",
        "last_name": "Doe",
        "is_parent": true,
        "is_premium": true,
        "can_post": true
      }
    ]
  }
}
```


### Delete Post API 👤
Deletes a post. User must be the post author.

```http
DELETE /api/v1/posts/:id
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `id` | ID of the post |

Response (200 OK):
```json
{
  "message": "Post deleted successfully"
}
```

### Like a Post API

```http
POST /api/v1/posts/:post_id/like
```

Likes a post. The user must be in the inner circle of the child associated with the post.

Response:

Returns the post object with updated like information:

```json
{
  "id": 1,
  "content": "First steps!",
  "date": "2023-01-15",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T10:30:00Z",
  "time_capsule_publish_date": null,
  "is_time_capsule": false,
  "is_published": true,
  "child_age": {
    "years": 1,
    "months": 2,
    "days": 15
  },
  "image_urls": [...],
  "video_details": null,
  "bookmarks_count": 3,
  "bookmarked_by_current_user": true,
  "likes_count": 6,
  "liked_by_current_user": true,
  "comments_count": 2,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "child": {
    "id": 2,
    "first_name": "Baby",
    "last_name": "Doe"
  },
  "firsts": [...],
  "measurements": [...]
}
```

### Unlike a Post API

```http
DELETE /api/v1/posts/:post_id/like
```

Removes a like from a post. The user must be in the inner circle of the child associated with the post.

Response:

Returns the post object with updated like information:

```json
{
  "id": 1,
  "content": "First steps!",
  "date": "2023-01-15",
  "created_at": "2023-01-15T10:30:00Z",
  "updated_at": "2023-01-15T10:30:00Z",
  "time_capsule_publish_date": null,
  "is_time_capsule": false,
  "is_published": true,
  "child_age": {
    "years": 1,
    "months": 2,
    "days": 15
  },
  "image_urls": [...],
  "video_details": null,
  "bookmarks_count": 3,
  "bookmarked_by_current_user": true,
  "likes_count": 5,
  "liked_by_current_user": false,
  "comments_count": 2,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe"
  },
  "child": {
    "id": 2,
    "first_name": "Baby",
    "last_name": "Doe"
  },
  "firsts": [...],
  "measurements": [...]
}
```



## Comments Bottom Sheet
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/comments-bottom-sheet-no-text.png)

* Shows Comments, along with the Comment creator
* When a user clicks Like:
  * the heart icon turns red (and when they click it again, it turs to the no fill version again and deletes the like) without page reload
  * the likes count under the comment updates without page reload
* No button shows in the Comment field until they type something in there
* If they enter a comment without clicking Reply (to a comment), a new comment is created and shown on the page at the bottom without a page reload
* If they click reply, and they enter text in the comment and click the button, it creates a reply to that comment
* the icon to the left of "View replies" expands the section and shows the replies to the Comment

When the replies section (to comments) is expanded:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/comments-bottom-sheet-expanded.png)


When text is entered in the comment field:

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/comments-bottom-sheet-with-text.png)

## Comments APIs

### List Comments 👥
Returns all comments for a post. Replies to comments are included as nested objects.

```http
GET /api/v1/posts/:post_id/comments
```

Response (200 OK):
```json
{
  "comments": [
    {
      "id": 1,
      "content": "What a wonderful milestone!",
      "created_at": "2024-01-01T12:00:00Z",
      "updated_at": "2024-01-01T12:00:00Z",
      "parent_comment_id": null,
      "likes_count": 2,
      "liked_by_current_user": false,
      "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "profile": {
          "has_image": true,
          "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
          "initials": "JD"
        }
      },
      "replies": [
        {
          "id": 2,
          "content": "I agree, such a special moment!",
          "created_at": "2024-01-01T12:30:00Z",
          "updated_at": "2024-01-01T12:30:00Z",
          "parent_comment_id": 1,
          "likes_count": 0,
          "liked_by_current_user": false,
          "user": {
            "id": 3,
            "first_name": "Jane",
            "last_name": "Smith",
            "profile": {
              "has_image": false,
              "image_url": null,
              "initials": "JS"
            }
          },
          "replies": []
        }
      ]
    }
  ]
}
```

### Create Comment or Reply 👥
Creates a new comment on a post, or a reply to a comment (reply requires paren_comment_id).

```http
POST /api/v1/posts/:post_id/comments
```

Request Body:
```json
{
  "comment": {
    "content": "What a wonderful milestone!",
    "parent_comment_id": 123  // Optional: Include this parameter to create a reply to another comment
  }
}
```

Response (201 Created):
```json
{
  "id": 1,
  "content": "What a wonderful milestone!",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "parent_comment_id": 123,  // Will be null for top-level comments
  "likes_count": 0,
  "liked_by_current_user": false,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "profile": {
      "has_image": true,
      "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
      "initials": "JD"
    }
  }
}
```

### Update Comment 👤
Updates an existing comment. Users can only update their own comments.

```http
PUT /api/v1/comments/:id
```

Request Body:
```json
{
  "comment": {
    "content": "Updated comment text"
  }
}
```

Response (200 OK):
```json
{
  "id": 1,
  "content": "Updated comment text",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "likes_count": 0,
  "liked_by_current_user": false,
  "user": {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "profile": {
      "has_image": true,
      "image_url": "/rails/active_storage/blobs/xxxx/profile.jpg",
      "initials": "JD"
    }
  }
}
```

### Delete Comment 👤
Deletes a comment. Users can only delete their own comments.

```http
DELETE /api/v1/comments/:id
```

Response (200 OK):
```json
{
  "message": "Comment deleted successfully"
}
```

### Like Comment 👥
Likes a comment.

```http
POST /api/v1/comments/:id/like
```

Response (200 OK):
```json
{
  "likes_count": 1,
  "liked_by_current_user": true
}
```

### Unlike Comment 👥
Removes a like from a comment.

```http
DELETE /api/v1/comments/:id/like
```

Response (200 OK):
```json
{
  "likes_count": 0,
  "liked_by_current_user": false
}
```
