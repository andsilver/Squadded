## Post

#### Common

Each post has 4 common sections:

-   Top Header having Post Owner and menu button contains `Share`, `Report`, `Remove` or `Add` to remove or add the post owner to my squadders list.
    If it's my post, there are options to `Delete`, `Edit` and `Set as Private` or `Set as Public`.
-   Main section shows the items of the post. This section is different based on the type of a post.
-   `Actions` section contains buttons to `Like` and `Comment`.
-   `Comments` section shows last comment and an input box to leave a comment.

Each post has at least one item.

And each item has a <img src="../assets/img/squad-logo-white.svg" width="20"> button to add or remove it from my wishlist.

A user can leave a comment on a post.
Inside [Feed](#Feed) component, the comment input box will be shown for the post which is most exposed in viewport.

Each post has a unique shareable link.

#### Post types

1. SingleItemPost
   [source](../components/Posts/SingleItemPost.vue)

2. PollPost
   [source](../components/Posts/PollPost.vue)

3. GalleryPost
   [source](../components/Posts/GalleryPost.vue)

4. MultiItemPost
   [source](../components/Posts/MultiItemPost.vue)

5. Grouped Posts
   [source](../components/Posts/GroupedPosts.vue)

---

## Feed

[source](../components/Feed/index.vue)

A component to show list of posts.

## Notifications

## Create
