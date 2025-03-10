```mermaid
erDiagram
    USERS {
        ObjectId _id
        string name
        string email
        date date_of_birth
        string password
        date created_at
        date updated_at
        string verify_email_token
        string forgot_password_token
        string bio
        string location
        string website
        string username
        string avatar
    }
    REFRESH_TOKENS {
        ObjectId _id
        string token
        ObjectId user_id
        date created_at
        int iat
        int exp
    }
    POSTS {
        ObjectId _id
        ObjectId user_id
        string type
        string audience
        string content
        ObjectId parent_id
        ObjectId[] hashtags
        string[] mentions
        Media[] medias
        int guest_views
        int user_views
        date created_at
        date updated_at
    }
    POST_LIKES {
        ObjectId _id
        ObjectId user_id
        ObjectId post_id
        date created_at
    }
    POST_BOOKMARKS {
        ObjectId _id
        ObjectId user_id
        ObjectId post_id
        date created_at
    }
    HASHTAGS {
        ObjectId _id
        string name
        date created_at
    }
    FOLLOWERS {
        ObjectId _id
        ObjectId user_id
        ObjectId followed_user_id
        date created_at
    }
    COMMENTS {
        ObjectId _id
        ObjectId user_id
        ObjectId post_id
        ObjectId parent_comment_id
        string content
        int likes_count
        date created_at
        date updated_at
    }
    COMMENT_LIKES {
        ObjectId _id
        ObjectId user_id
        ObjectId comment_id
        date created_at
    }
    NOTIFICATIONS {
        ObjectId _id
        string type
        boolean read
        ObjectId recipent_id
        ObjectId sender_id
        ObjectId resource_id
        string message
        date created_at
    }

    USERS ||--o{ REFRESH_TOKENS : "has"
    USERS ||--o{ POSTS : "writes"
    USERS ||--o{ COMMENTS : "makes"
    USERS ||--o{ POST_LIKES : "likes"
    USERS ||--o{ FOLLOWERS : "follows"
    USERS ||--o{ POST_BOOKMARKS : "saves"
    USERS ||--o{ COMMENT_LIKES : "likes"
    USERS ||--o{ NOTIFICATIONS : "receives"
    USERS ||--o{ NOTIFICATIONS : "sends"

    POSTS ||--o{ COMMENTS : "has"
    POSTS ||--o{ POST_LIKES : "has"
    POSTS ||--o{ POST_BOOKMARKS : "has"

    COMMENTS ||--o| COMMENTS : "replies to"
    COMMENTS ||--o| COMMENT_LIKES : "like"

    POSTS ||--o{ HASHTAGS : "contains"
    HASHTAGS ||--o{ POSTS : "tagged in"

    NOTIFICATIONS ||--|{ USERS : "notifies"
    NOTIFICATIONS ||--o| POSTS : "related to"
    NOTIFICATIONS ||--o| COMMENTS : "related to"


```
