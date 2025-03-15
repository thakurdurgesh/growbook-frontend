
# Resource Center

Parents come here for tips on how to raise their children.  There's a generic landing page (that shows when the user has no children), age group landing pages (shows the topics related to a specific age group - like teenagers), and article pages.


## Resource Center Landing Page

The Resource Landing Page shows when someone clicks on the resource link from the navbar. 

What's returned is going to be different based on if they are a parent (have children) or not.
* If they have no children, we should a page with static links to pages with Resource Articles for a specific Age Group
* If they have children, we show the children and by default show the Resource Articles (broken down by category) of the youngest child

### Get Current User Resources API 🔒
Returns resources tailored to the current user's children (or all age groups if no children).

```http
GET /api/v1/age_groups/current_user_resources
```

Response for users with children (200 OK):
```json
{
  "has_children": true,
  "children": [
    {
      "first_name": "Jane",
      "age": "2 years 3 months",
      "profile_image_url": "https://example.com/image.jpg",
      "initials": "JD"
    }
  ],
  "age_group": {
    "id": 1,
    "name": "Toddler",
    "main_image_url": "https://example.com/toddler.jpg",
    "min_age_months": 12,
    "max_age_months": 36,
    "description": "Toddlers (1-3 years)"
  },
  "resource_categories": [
    {
      "id": 1,
      "name": "Sleep",
      "category_type": "topic",
      "articles": [
        {
          "id": 1,
          "title": "Sleep Training Tips",
          "slug": "sleep-training-tips",
          "main_image_url": "https://example.com/sleep.jpg"
        }
      ]
    }
  ]
}
```

Response for users without children (200 OK):
```json
{
  "has_children": false,
  "age_groups": [
    {
      "id": 1,
      "name": "Infant",
      "main_image_url": "https://example.com/infant.jpg",
      "min_age_months": 0,
      "max_age_months": 12,
      "description": "Infants (0-12 months)"
    }
  ]
}
```

## Generic Resource Landing Page (if they have no children)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/resource-center-generic-landing-page.png)

* If the user doesn't have any children, then they see this page with static content and links when they click the Resources link in the navbar
* We show the description and image for each age group
* When the description or image is clicked, we show them the Resource Articles (page looks the same as Resource Landing Page with Children with the section with the children at the top hidden) for that Age Group.

To get the articles for an Age Group, we use the Age Group ID returned and make an API call.

### Get Age Group Resources API 🔒
Returns detailed information about an age group's resources, including articles sorted by popularity and view status.

```http
GET /api/v1/age_groups/:id/resource_articles
```

Response (200 OK):
```json
{
  "age_group": {
    "id": 1,
    "name": "Infant",
    "age_range": "0-12 months",
    "main_image_url": "https://example.com/infant.jpg",
    "description": "Infants (0-12 months)"
  },
  "tools_articles": {
    "unviewed": [
      {
        "id": 1,
        "title": "Sleep Training Tips",
        "main_image_url": "https://example.com/sleep.jpg",
        "slug": "sleep-training-tips",
        "view_count": 150
      }
    ],
    "viewed": [
      {
        "id": 2,
        "title": "Feeding Schedule",
        "main_image_url": "https://example.com/feeding.jpg",
        "slug": "feeding-schedule",
        "last_viewed_at": "2025-02-28T15:30:00Z"
      }
    ]
  },
  "topic_articles": {
    "Sleep": {
      "unviewed": [
        {
          "id": 3,
          "title": "Sleep Training Methods",
          "main_image_url": "https://example.com/methods.jpg",
          "slug": "sleep-training-methods",
          "view_count": 120
        }
      ],
      "viewed": [
        {
          "id": 4,
          "title": "Sleep Safety",
          "main_image_url": "https://example.com/safety.jpg",
          "slug": "sleep-safety",
          "last_viewed_at": "2025-02-27T10:15:00Z"
        }
      ]
    }
  }
}
```


## Resource Landing Page with Children
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/resource-center-age-group-page.png)

If they have a children, the children will be returned in order of their age, youngest to 
oldest

**Children Section**
* In addition, the resource categories and resource articles for the youngest child will be returned (to show)
* We show each child's first name and image
* If multiple children are returned, we should show the youngest child (the first one returned) as selected (purple rectangle around them)
  * Else (means only one child returned), no need to show them as selected


**Resource Article Section**
* Age Group Name ("Toddler")
* Name of Resource Category with type == 'tool' ("Toddler tools")
  * Main image for Article
  * Article Name giving you the best that I got
  * Both linked to the Show Resource Article Page
* Age Group Name Topics ("Toddler Topics")

{Iterate through the remaining Resource Categories}
* Name of Resource Categories ("Toddler sleep guide") - section collapses(hiding links to articles) and expands (expanded on page load)
  * Article Name
  * Linked to the Show Resource Article Page
  * After the first three are shown, show "View more" - when this is clicked, show links to the remaining Resource Articles in the Resource Category
  
#### Children Section Example with 3 Children
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/resource-center-age-group-page-3.png)

#### Children Section Example with 4 Children
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/resource-center-age-group-page-4.png)

#### Children Section Example with 5 or more (carousel scroll)
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/resource-center-age-group-page-5%2B.png)


## Show Resource Article Page
![App Screenshot](https://growbook-doc-screenprints.s3.us-east-1.amazonaws.com/show-resource-article-page.png)

* Article Title ("Toddler")
* Article Main Image (if present)
* Article Body (will be HTML)

### Show Resource Article API 🔒
Returns the full content of a resource article.

```http
GET /api/v1/resource_articles/:slug
```

Response (200 OK):
```json
{
  "id": 1,
  "title": "Sleep Training Tips",
  "content": "Full article content in markdown format...",
  "summary": "Guide to helping your infant sleep through the night",
  "slug": "sleep-training-tips",
  "published_at": "2024-01-01T12:00:00Z",
  "age_group": {
    "id": 1,
    "name": "Infant",
    "age_range": "0-12 months",
    "description": "The first year of life, from birth to 12 months"
  },
  "main_image_url": "https://example.com/article1.jpg"
}
```