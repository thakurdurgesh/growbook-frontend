
# Chapters

Chapters shows the: Favorites, Likes, Dislikes, Achievements, Firsts and Measurements for children that the user is in the Inner Circle of.

You can get to the Chapters page by clicking on the link in the navbar.

* By default, on page load, the user starts on the Favorites filter and sees all children (that they are an Inner Circle Member of)
* To filter by child the user clicks on one
* To see Favorite, Like, Dislike, Achievement, First or Measurement, the user clicks on the chip (and it changes from gray to purple)
* If a child is the Inner Circle of a Premium Account, then we show the Favorite, Like, Dislike, Achievement, First and Measurement history for that child 




## Chapters Page

![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-favorites-all-children.png)

* Shows the children that the user is an Inner Circle Member of
* On page load:
  * It's filtered for the Favorites
  * Shows the Favorites history for all children that are in an Premium Account
* (+) Shows the additions on that date
* (-) Shows the subtractions on that date
* Gray shows are the other remaining ones on that date

### Get Chapters API 👥
Get comprehensive chapters data for all accessible children, including their histories.
Requires inner circle membership. Data is cached and refreshed when relevant records change.

```http
GET /api/v1/users/get_chapters
```

Optional Query Parameters:
```
selected_child_id: If provided, returns historical data only for this child
```

Response (200 OK):
```json
{
  "children": [
    {
      "id": 123,
      "first_name": "John",
      "age": "2 years old",
      "profile_image_url": "https://example.com/image.jpg",
      "initials": "JD",
      "is_parent": true,
      "is_premium": true,
      "inner_circle_role": "admin",
      "current_data": {
        "favorites": "swimming, reading, legos",
        "likes": "hugs, playing outside",
        "dislikes": "broccoli, naps",
        "measurement": {
          "height_formatted": "3' 2\"",
          "weight_formatted": "32 lbs",
          "height_change": "+3 in",
          "weight_change": "-6.0 lbs"
        }
      }
    }
  ],
  "historical_data": [
    {
      "child_id": 123,
      "measurements": [
        {
          "id": 1,
          "height_formatted": "3' 2\"",
          "weight_formatted": "32.5 lbs",
          "created_at": "2025-03-01T08:00:00Z",
          "post_id": 45,
          "height_change": "+1.5 in",
          "weight_change": "+2.0 lbs"
        }
      ],
      "firsts": [
        {
          "id": 1,
          "title": "First Word",
          "description": "Said 'mama' for the first time!",
          "created_at": "2025-03-01T08:00:00Z",
          "image_url": "https://example.com/first_word.jpg",
          "post_id": 42
        }
      ],
      "achievements": [
        {
          "id": 1,
          "title": "First Steps",
          "description": "Took their first steps today!",
          "created_at": "2025-03-01T08:00:00Z",
          "image_url": "https://example.com/first_steps.jpg",
          "post_id": 43
        }
      ],
      "favorites_history": [
        {
          "date": "2025-03-01",
          "formatted_date": "March 1, 2025",
          "tags": [
            {
              "id": 1,
              "tag_name": "swimming",
              "context": "favorites",
              "change_type": "addition",
              "created_at": "2025-03-01T08:00:00Z",
              "child_age": "2 years old"
            }
          ]
        }
      ],
      "likes_history": [...],
      "dislikes_history": [...]
    }
  ]
}
```

Notes:
- The response is cached for 1 minute using the key `chapters_v16/[user_id]/[child_id]`.
- Current data includes the latest favorites, likes, dislikes, and measurement for each child.
- Historical data includes all measurements, firsts, achievements, and tag history for each child.
- Measurement data includes formatted height and weight values, as well as the change since the previous measurement (if available).
- Tag history is grouped by date.
- Only children with premium parent accounts will have historical data.
- When `selected_child_id` is provided, historical data only includes that child.
- Response is cached and automatically refreshed when:
  - Child records are updated
  - Account status changes
  - Tags are modified
  - Measurements, firsts, or achievements are added/modified
- Cache expires after 24 hours as a safeguard

#### When a child is selected, then it shows a card with their current favorites
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-favorites-one-child-collapsed.png)

**Child Card**
* If the user is in the Inner Circle Member with a admin or poster role of the selected child, they will see the trash can and + icons
  * The trash can deletes the Favorite
  * The + adds a Favorite
  * Note: Favorites is a list, so if we delete one, we need to make sure that we still are passing back the other current Favorites (or they will also be deleted)
  * Note: Favorites is I want a list, so if we add one, we need to make sure that we still are passing back the other current Favorites (or they will be deleted)
* When clicked the 'x' icon: 
  * hides the card
  * shows all of the children again
  * shows the history of all of the children belonging to Inner Circles with Premium Accounts (and their names above the dates) again

**History (below card)**
* The Favorites below show, IF they child is in an Inner Circle that is associated with a Premium account. These reflect the history, so clicking the + or - icons in this section don't do anything.

## Other Filters

* When the chips are clicked, it shows the info related to Favorites, Likes, Dislikes, Achievements, Firsts and Measurements
* The rules are similar to above:
  * If they selected a child:
    * the child's card will show
    * under that the history will show the card if the child is in an Inner Circle Member with a Premium Account
    * only users who has a role with admin or poster in the child's Inner Circle will see the trash can and + icons in the Child Card section
  * If they don't have a child selected:
    * it will show all children (that the user is an Inner Circle Member of) with their avatars and their name 
    * under that the history will show (under the children avatars and names) for all of the children is in an Inner Circle Member with a Premium Account

Below are examples of what the pages would look like with other chips selected.  

Note: these all show when a child has been selected (Child Card shown), if no child has been selected, or if the user clicks on the 'x' icon in the Child Card to close it; then all children are shown (and the history of all children are considered - because nothing is filtered by child then).

#### Favorites Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-favorites-one-child-collapsed.png)

#### Show Premium Upgrade Message and Modal (Favorites tab)

This will show in two situations:

1. If a child is selected and they have one current favorite, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a favorite currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal


### Update Favorites API 👥
Updates the favorite tags for a child. Requires inner circle membership.

```http
PATCH /api/v1/children/:child_id/favorites
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `child_id` | ID of the child |

Request Body:
```json
{
  "tags": ["reading", "drawing"]
}
```

Response (200 OK):
```json
{
  "message": "Favorites updated successfully"
}
```

#### Favorites Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-favorites-one-child-expanded.png)

#### Likes Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-likes-one-child-collapsed.png)

### Update Likes API 👥
Updates the like tags for a child. Requires inner circle membership.

```http
PATCH /api/v1/children/:child_id/likes
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `child_id` | ID of the child |

Request Body:
```json
{
  "tags": ["broccoli", "naps"]
}
```

Response (200 OK):
```json
{
  "message": "Likes updated successfully"
}
```

#### Likes Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-likes-one-child-expanded.png)

#### Show Premium Upgrade Message and Modal (Likes tab)

This will show in two situations:

1. If a child is selected and they have one current Like, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a Like currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal


#### Disikes Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-dislikes-one-child-collapsed.png)

#### Show Premium Upgrade Message and Modal (Dislikes tab)

This will show in two situations:

1. If a child is selected and they have one current Dislike, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a Dislike currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal

### Update Dislikes API 👥
Updates the dislike tags for a child. Requires inner circle membership.

```http
PATCH /api/v1/children/:child_id/dislikes
```

| Parameter | Description |
| :-------- | :-------------------------------- |
| `child_id` | ID of the child |

Request Body:
```json
{
  "tags": ["broccoli", "naps"]
}
```

Response (200 OK):
```json
{
  "message": "Dislikes updated successfully"
}
```

#### Dislikes Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-dislikes-one-child-expanded.png)

#### Achievements Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-achievements-one-child-collapsed.png)

#### Show Premium Upgrade Message and Modal (Achievements tab)

This will show in two situations:

1. If a child is selected and they have one current Achievement, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a Achievement currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal

#### Achievements Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-achievements-one-child-expanded.png)

#### Firsts Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-firsts-one-child-collapsed.png)

#### Firsts Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-firsts-one-child-expanded.png)

#### Show Premium Upgrade Message and Modal (Firsts tab)

This will show in two situations:

1. If a child is selected and they have one current First, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a First currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal

#### Measurements Selected (Collapsed Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-measurements-one-child-collapsed.png)

#### Measurements Selected (Expanded Child Card)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/chapters-measurements-one-child-expanded.png)

#### Show Premium Upgrade Message and Modal (Measurements tab)

This will show in two situations:

1. If a child is selected and they have one current Measurement, and are NOT a premium account

TODO: Screenshot (show message on page)

TODO: Show modal


2. If no child has been selected and there's at least one with a Measurement currently and the child is NOT a Premium Account

TODO: Screenshot (show message on page)

TODO: Show modal