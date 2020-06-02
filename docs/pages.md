## index

[source](../pages/index.vue)

Signin/Signup Page with Social Account/Email.
When `Squadded-slogin` is true in merchant's localStorage, Social Login is not visible.

This page is reachable at very first loading or using invite link.

Email Signin is consists of two steps:

1. Email Input
2. Pin Code input to verify 4 digits code sent to your email

After signin, the user can goes to:

1. [Select Username](#select-username) page if he didn't select a username.
2. [Invite Friends](#invite-friends) page if he still doesn't have no friends on this platform.
3. [Home](#feed) page if he already set username and has some friends.
4. Or it lets the user go to the last page before he closed the browser.

---

## community

[source](../pages/community.vue)

This page displays some example posts before authentication.
Using [Feed](./components.md#Feed) component for displaying posts.
It's not available after the user sign in.
No elements is clickable and any click will let the user redirect to [index](#index) page.

---

## select-username

`Select Username` Page

[source](../pages/select-username)

You can set your `username` or `avatar` on this page.
`Avatar` is optional but `username` is required.

Each time a user sign in, we check if he set his `username`, if not, we force him to go to this page.

This page is not reachable again after he initially set his `username`.
To change the `username` again, the user can go to [My ](#me) page.

After he set the `username`, he goes to [invite-friends](#invite-friends) page.

---

## invite-friends

[source](../pages/invite-friends.vue)

There are two sections in this page:

-   The authenticated user can invite friends via invite link, whatsapp, facebook messenger or email. The receiver will get a link to the inviter's profile.

-   He can search friends already signed up to the app by `name`.
    Clicking `Invite` on a searched user will send a request notification to the user. This kind of requests notifications will be appeared at [Requests Notifications](#notificationsrequests) page.

You will see this page everytime you sign in when you don't have a friends.
If you have at least one in your squadded list, then you goes to [my-squad](#feed) page

---

## feed

`Home` Page

[source](../pages/feed.vue)

There are three sections on this page:

1. TopBar includes two navigation buttons: [The Community](#all) and `Home` page.
2. A bar contains friends of the user and a plus button to add a friend. Clicking the plus button will open `add-friends` dialog that can search friends, send invite notification or invite a friend via `Messenger`, `Facebook`, `Email` or `Invite Link`.
   This dialog is being used across the platform for adding a friend.
3. Feed section where we show all posts from you and your friends. Using [Feed](./components.md#Feed) component for displaying posts.

    Check [here](./components.md#Post) to get all post types, how to create them, common functionality of each post.

---

## all

`The Community` Page

[source](../pages/all.vue)

Showing some posts from all users in the application based on activity.
Using [Feed](./components.md#Feed) component for displaying posts.

If you visit this page for the first time, it will redirect you to [walkthrough](#walkthrough) page.

---

## profile-settings

`Profile Settings` Page

[source](../pages/profile-settings.vue)

A user can edit his profile on this page.
There are two tabs:

1. `Profile` tab
   Update `avatar`, `username`, `bio`, `name` and `profile privacy` in this tab.
2. `General` tab
   Update `language` in this tab.
   And he can read `Term of use`, submit `Feedback`, logout or delete the account.

Before leaving this page, we check if there is any unsaved changes. If there are, we show a confirmation dialog.

This page is reachable by clicking `Edit` or **`⋮`** Button at the left top corner of [My Profile](#me) page.

---

## me

`My Profile` Page

[source](../pages/me.vue)

Showing my `Profile`, `Posts` and `Wishlist`.

The page has three sections:

1. Top bar has:
    - **`⋮`** Button to go to [Profile Settings](#profile-settings) page
    - Button to show a dialog to add a friend
2. Displaying my profile picture and username.
   And contains `My Squad` button to go to [My Squadders](#mymysquad) page, `Edit` button to go to [Profile Settings](#profile-settings) page.

3. Tabs container
    - `Posts` tab contains all of my posts. Using [Feed](./components.md#Feed) component for displaying posts.
    - `Wishlist` tab contains all of my wish items.

---

## my/mysquad

[source](../pages/my/mysquad.vue)

Displaying all of my friends and has a button to show a dialog to add a new friend.

---

# Notifications

## notifications/index

`Notifications` Page

[source](../pages/notifications/index.vue)

Showing last 30 notifications except `Request type notification` that the current user received in the past.
`Request` notifications are displayed in the next [Requests](#notificationsrequests) tab.
If there is any new unread messages, they are displayed under a section named `New`.
Check [here](./components.md#Notifications) to check the type of notifications.

---

## notifications/requests

`Requests` Page

[source](../pages/notifications/index.vue)

Showing last 30 request type notifications.
This includes `Invite` and `Invite Accepted` notifications.

Check [here](./components.md#Notifications) to check the type of notifications.

---

# Create

## create/outfit

[source](../pages/create/outfit.vue)

This page is to create `multi-item` post.
You have to have some items in your wishlist to create a new post.

In the first page, the user selects max 4 items to be grouped in the post.
In the next page, add caption and select the post's privacy.

---

## create/poll

[source](../pages/create/poll.vue)

This page is to create `poll` post.
`poll` post has two items and other users can vote on one of them.
To create a `poll` post, you have to have some items in your wishlist.

There are two steps to create a `Poll` post:

1. Select two items will be voted.
2. Add caption, Select `Expiration` and select the post's privacy.

---

## create/upload

[source](../pages/create/upload.vue)

This page is to create `gallery` and `video` post.
On this page, there are options - if you want to create a `gallery` or `video` post.

1. `gallery` post

    The user will upload a picture and crop it.
    After that, the user tags images by clicking on the picture.
    Each tag will be matching to an item in his wishlist by selecting one by one.

2. `video` post

    The user just adds a url of `youtube` or `instagrm` video.

---

## paired-item

[source](../pages/paired-item/_id.vue)

This page shows a status of an item.
The page have 3 main sections:

1. Shows item information like price, picture, etc and having buttons let the user can add or remove from wishlist, create a post.
2. List of users having the item in their wishlist.
3. Tabs for each type of posts having this item.

This page is reachable by clicking <img src="../assets/img/recycle.svg" width="16"> button on an item of any post.

---

## poll

[source](../pages/poll/_id.vue)

Poll Post Details page.
It shows current status of the poll post including votes and voters for each item in the poll post.

This page is reachable by clicking `Voting Slider` on a poll post.

---

# Post

## post/\_id/index.vue

Post Details page

[source](../pages/post/_id/index.vue)

This page shows a specific post with comments on it.
A user can also leave a comment on this page.
This page is reachable by shared link of the post.

---

## post/\_id/reactions.vue

This pages shows `comments` and `likes` of a specific post.
A user can also leave a comment on this page.
This page is reachable by clicking <img src="../assets/img/notify-comment.svg" width="16"> **`Comment`** or **`🖤 Like`** button on a post.

---

# User

## user/\_id/index.vue

User Profile Page(not me)

Showing a user's `Profile`, `Posts` and `Wishlist`.

The page has three sections:

1. Top bar has **`⋮`** Button opens a menu having options:

    - Getting `link` to the profile
    - `add` or `remove` the user from my squadders list
    - `report`

2. Displaying the user's profile picture and username.
   And contains a button:

    - `IN SQUAD` when the user is my squad. Clicking this button will remove the user from my squadders list
    - `INVITE` when the user is not my squad. Clicking this button will send `invite` request to him.
    - `PENDING` when I already sent an invite to him and he still didn't accept it.

3. Tabs container
    - `Posts` tab contains all of the user's posts. Using [Feed](./components.md#Feed) component for displaying posts.
    - `Wishlist` tab contains all of the user's wish items.

---
