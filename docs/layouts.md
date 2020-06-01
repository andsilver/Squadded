## default.vue

[source](../layouts/default.vue)

This defines the layout of this application.

There are 5 main components on the page:

1. Notification Banner - shows the [notifications](./components.md#notifications) while you are using the app. A notification appears here for 4 seconds. You can see notifications history in [Notifications](./pages.md#notifications/index.vue) page
2. Overlay - transparent top layer prevents clicking any element before authentication.
3. Content - includes the actual page component
4. TabBar - includes main buttons

    - `Home` - go to [My Squad](./pages.md#feed.vue) page
    - `Explore` - go to [Explore](./pages.md#explore.vue) page
    - `Messages` - go to [Notifications](./pages.md#notifications/index.vue) page
    - `Profile` - go to [Profile](./pages.md#me.vue)
    - `Create` Button to create posts.

5. Loading Animation - shows animation loader while the application loads the authenticated user data. This covers whole screen.

We also have a vuex mutations subscription to handle proper actions based on a mutation type.
