
# Time Capsules and New Time Capsule Pages

A Time Capsule Post is a special kind of Post where parents are making post for their children to be read in the future.  This allows them to see Time Capsule Posts that parents created.

## Features

- Scheduled to show only at a future date (to the children)
- Parents can see Time Capsules even when they are posted yet to edit and delete
- Unlike normal posts, Time Capsules do not show in the feed or other places until they are published
  - Only the children on the posts, or the parent who created the post, can see the post
- Only parents can make Time Capsule Posts
  - They can only make Posts for their Children

## New/Edit Time Capsule Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/new-time-capsule-post-page.png)

- Buttons disabled until at least one child is selected

### For New Time Capsule Post

### Create Post (only one child selected) 🔒
Creates a new post for a child. Only users with admin or poster roles in the child's inner circle can create posts.

```http
POST /api/v1/children/:child_id/posts
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `child_id` | ID of the child |

Request Body (form-data):
```
# Basic Post Information
post[content]: string           # Required unless images/video are present
post[date]: string             # Required (YYYY-MM-DD format)
post[images]: file[]           # Optional, up to 10 images
post[video]: file              # Optional, one video file
post[time_capsule_publish_date]: string  # Optional (YYYY-MM-DD format)
post[child_ids]: array         # Optional, array of child IDs for time capsule posts only
```

#### Time Capsule Posts with Multiple Children
When creating a time capsule post (by providing `time_capsule_publish_date`), you can associate it with multiple children by including the `child_ids` parameter. The `child_id` in the URL is still required and will be used as the primary child for backward compatibility.

Example:
```
post[content]: "Happy birthday message for the future!"
post[date]: "2025-01-15"
post[time_capsule_publish_date]: "2030-01-15"
post[child_ids]: [123, 456, 789]
```

Notes:
- Time capsule posts will never have favorites, likes, dislikes, achievements, or firsts
- Time capsule posts can only include children that belong to the parent user
- The parent must be the legal guardian of all children included in the post
- Notifications will be sent to all inner circle members of all associated children

#### Image Requirements
- Allowed formats: JPEG, PNG, GIF, HEIC, HEIF
- Images are uploaded to Cloudflare Images
- Maximum 10 images per post

#### Video Requirements
- Allowed formats: MP4, MOV, AVI
- Videos are uploaded to Cloudflare Stream
- Maximum 1 video per post

Response (201 Created):
```json
{
  "id": 1,
  "content": "First steps!",
  "date": "January 3, 2025",
  "created_at": "2025-01-03T04:30:08.546Z",
  "updated_at": "2025-01-03T04:30:08.546Z",
  "time_capsule_publish_date": null,
  "is_time_capsule": false,
  "is_published": true,
  "child_age": {
    "years": 2,
    "months": 3,
    "days": 15
  },
  "image_urls": [
    {
      "id": "abc123",
      "original": "https://example.com/original.jpg",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "medium": "https://example.com/medium.jpg"
    }
  ],
  "video_details": {
    "id": "xyz789",
    "status": "ready",
    "thumbnail_url": "https://videodelivery.net/hash/xyz789/thumbnails/thumbnail.jpg",
    "playback_url": "https://videodelivery.net/hash/xyz789/manifest/video.m3u8"
  },
  "user": {
    "id": 1,
    "email": "parent@example.com",
    "first_name": "Parent",
    "last_name": "User",
    "full_name": "Parent User"
  },
  "children": [
    {
      "id": 2,
      "first_name": "Child",
      "last_name": "User",
      "full_name": "Child User"
    }
  ]
}
```


#### For Editing

If this is for editing, we need to populate the fields with the existing data.

### Show Post 🔒
Returns a specific post.

```http
GET /api/v1/posts/:id
```

Response (200 OK):
```json
{
  "post": {
    "id": 1,
    "content": "First steps today!",
    "date": "2024-01-01",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z",
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
    "age": "18 months old",
    "child": {
      "id": 2,
      "first_name": "Jane",
      "last_name": "Doe",
      "birthdate": "2020-01-01",
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
}
```

### Update Post 👤
Updates an existing post. User must be the post author. For time capsule posts, they can only be updated if they haven't been published yet.

```http
PUT/PATCH /api/v1/posts/:id
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `id` | ID of the post |

Request Body (form-data):
```
# Basic Post Information
post[content]: string           # Required unless images/video are present
post[date]: string             # Required (YYYY-MM-DD format)
post[images]: file[]           # Optional, up to 10 images
post[time_capsule_publish_date]: string  # Optional (YYYY-MM-DD format)
post[child_ids]: array         # Optional, array of child IDs for time capsule posts only
```

Response (200 OK):
```json
{
  "id": 1,
  "content": "Updated post content",
  "date": "January 3, 2025",
  "created_at": "2025-01-03T04:30:08.546Z",
  "updated_at": "2025-01-03T05:15:22.123Z",
  "time_capsule_publish_date": null,
  "is_time_capsule": false,
  "is_published": true,
  "child_age": {
    "years": 2,
    "months": 3,
    "days": 15
  },
  "image_urls": [
    {
      "id": "abc123",
      "original": "https://example.com/original.jpg",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "medium": "https://example.com/medium.jpg"
    }
  ]
}
```


### Delete Post 👤
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

## Time Capsules Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/time-capsule-page.png)

* Works almost identically to what we show on the Post Page, but it shows a scheduled date
* Multiple children can be selected, unlike normal Posts
* The image/video section only shows if one was uploaded for the Post
* Far right ellipse icon (far right of avatar and child name)
  * Triggers a menu with links: Edit Post, Delete Post

### Empty State Time Capsule

<img src="https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/time-capsule-page-empty-state.png" width="50%" alt="App Screenshot">

If no Posts are returned.

### List Time Capsule Posts 🔒
Lists time capsule posts visible to the current user:
- For parents: all their time capsule posts
- For parents: all their time capsule posts
- For children: only published time capsule posts addressed to them

```http
GET /api/v1/posts/time_capsules
```

Query Parameters:
| Parameter | Description |
| :-------- | :-------------------------------- |
| `page` | Page number for pagination (optional, default: 1) |
| `per_page` | Items per page (optional, default: 20) |

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
      "time_capsule_publish_date": "2042-01-01",
      "is_time_capsule": true,
      "is_published": false,
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