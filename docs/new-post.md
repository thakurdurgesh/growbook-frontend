
# New Post Page

Posts allow parents and other authorized users (members of a child's Inner Circle with a What is going on here).  Time Capsule Posts are similar, but have different fields and don't show immediately.

## Features

- Only people who have proper access can make a Post about a child (someone who is an Inner Circle Member for the child and has a role of 'admin' 'owner') - the APIs will provide these details
- If the person isn't authorized, we show them a message that let's them request access
- If the child isn't on an Account with a Premium plan, the only the Parent can Post about the child (unless the Account is upgraded) - so we show a message that they should upgrade

## New Post Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/new-post-page.png)

* On page load, we call the Get Post Creation Data API to determine which children this user can post about, and we get the measurement_type, favorites, likes, and dislikes of the child
* If the user has access to only one child, select the child on page load
* If the user has access to more than one child, they need to select a child
* As soon as we know which child they want to post for (they select one, or we know because they can only post for one child), we need to:
  * Populate the list in the favorites section
  * Populate the list in the likes section
  * Populate the list in the dislikes section
  * If the child has: `measurement data: {has_preference:true}`, then we: 
    * set the toggle according to their `measurement data: {measurement_type}`
    * hide the section where they select the toggle for unit of measurement 
* "Add Attachment"
  * Disabled until a child is selected
  * Shows Photo Upload Bottom Sheet to allow user to select photos and or a video (only if the Account associated with the Inner Circle is Premium)
  * After the files are selected, a thumbnails shows as a carousel
  * We take the meta data from the first photo/video they select and use the creation date to populated the Post date field
* "Share" button is disabled until: child is selected, Post date and Description field populated
* Post date field should show in the format MM/DD/YYYY and when the field is clicked, it should show the native date picker for the OS on the phone

### Get Post Creation Data API👥
Get all children that the current user can create posts for, including their preferences and measurements.
Requires inner circle membership with admin or poster role.

```http
GET /api/v1/users/post_creation_data
```

Response (200 OK):
```json
{
  "accessible_children": [
    {
      "id": 123,
      "first_name": "John",
      "age": "2 years old",
      "profile_image_url": "https://example.com/image.jpg",
      "initials": "JD",
      "role": "admin",
      "measurement_data": {
        "measurement_type": "feet_pounds",
        "has_preference": true,
        "latest_measurement": {
          "date": "2025-03-01T08:00:00Z",
          "height": "3 feet 2 inches",
          "weight": "32lbs"
        }
      },
      "tag_data": {
        "favorites": ["swimming", "reading", "dogs"],
        "dislikes": ["broccoli", "naps"],
        "likes": ["hugs", "playing outside"]
      }
    },
    {
      "id": 124,
      "first_name": "Jane",
      "age": "3 years old",
      "profile_image_url": "https://example.com/image2.jpg",
      "initials": "JS",
      "role": "poster",
      "measurement_data": {
        "measurement_type": "centimeters_kilograms",
        "has_preference": true,
        "latest_measurement": {
          "date": "2025-03-01T08:00:00Z",
          "height": "92cm",
          "weight": "14kg"
        }
      },
      "tag_data": {
        "favorites": ["painting", "dancing"],
        "dislikes": ["loud noises"],
        "likes": ["music", "coloring"]
      }
    }
  ]
}
```

#### Enabled Buttons and Selected child

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/new-post-page-child-selected.png)

* Note: this example has null Post Date and Description, so in reality the "Share" button should not be enabled, but this is just for showing what the buttons look like enabled, and what a selected (and a not selected) child looks like.


## Fully Expanded Page


![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/new-post-fully-expanded-feet-and-pounds.png)

* There's a set of accordions under the description fields
  * These are gray, unless they are expanded, OR, they have field values that are changed under them (in this case, they remain purple even when collapsed)
* Update Height/Weight
  * Depending on where the user is in the world, they will want to use different measurements for height and weight
  * By default, on the first post where they are updating a height/weight, we can default them to "Use feet and pounds for measurement" -> toggle on)
  * One toggle must be on, either "Use feet and pounds for measurements" or "Use kilograms and centimeters for measurements" - this means if one is turned on, the other must be turned off autometically by the UI
  * Whichever one has the toggle on, also has purple text (and the one that has the toggle off has gray text)
  * Those toggles only show when the "Select Measurement Units" section is expanded
  * This controls what shows in the section below:
    * Three fields (feet, inches and pounds), or
    * Two fields (kilograms and centimeters)
    * The icon and unit of measurement text parts of these fields should not be editable ("feet", "inches", "pounds", "kilograms", "centimeters") only the number part of the field (and all of the parts of the field including the icon, "Height", "Weight", unit of measurement text and outline should be in purple if a value is entered)
* Update Favorites
  * Allows the user to delete them (clicking the 'x' icon)
  * They can also add ones
* Update Likes (not shown in the UI, but it will look just like the Update Favorites section)
  * Allows the user to delete them (clicking the 'x' icon)
  * They can also add ones  
* Update Dislikes Nice
  * Allows the user to delete them (clicking the 'x' icon)
  * They can also add ones
* Add an Achievement - text area field that creates a new achievement record
* Add a First - text area field that creates a new first record

#### If fields were changes in all of the expandable sections (and the sections were collapsed)

They'd all be highlighted in purple.

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/new-post-all-sections-populated.png)

### Create Post API 🔒
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

# Nested Firsts (Milestones)
post[firsts_attributes][0][title]: string       # Optional
post[firsts_attributes][0][date]: string        # Optional (YYYY-MM-DD format)
post[firsts_attributes][0][_destroy]: boolean   # Optional, set to true to remove

# Nested Measurements
post[measurements_attributes][0][measurement_type]: string  # Required for measurements, either 'feet_pounds' or 'centimeters_kilograms'

# For feet_pounds measurement type:
post[measurements_attributes][0][height_feet]: integer     # Required if measurement_type is feet_pounds
post[measurements_attributes][0][height_inches]: integer   # Required if measurement_type is feet_pounds (0-11)
post[measurements_attributes][0][weight_pounds]: float     # Required if measurement_type is feet_pounds

# For centimeters_kilograms measurement type:
post[measurements_attributes][0][height_centimeters]: float  # Required if measurement_type is centimeters_kilograms
post[measurements_attributes][0][weight_kilograms]: float    # Required if measurement_type is centimeters_kilograms

post[measurements_attributes][0][_destroy]: boolean        # Optional, set to true to remove

# Tags
post[favorites]: string[]      # Optional, array of favorite tags
post[dislikes]: string[]      # Optional, array of dislike tags
post[likes]: string[]         # Optional, array of like tags
```

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
  "firsts": [
    {
      "id": 1,
      "title": "First Steps",
      "date": "2025-01-03"
    }
  ],
  "measurements": [
    {
      "id": 1,
      "measurement_type": "feet_pounds",
      "height_feet": 3,
      "height_inches": 2,
      "weight_pounds": 24.6,
      "formatted_height": "3'2\"",
      "formatted_weight": "24.6 lbs"
    }
  ],
  "favorites": ["walking", "playing"],
  "dislikes": ["naps"],
  "likes": ["music"],
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