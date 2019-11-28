[![CircleCI](https://circleci.com/gh/squadded/widget/tree/master.svg?style=svg&circle-token=2025ce5fc3b5de9246280fb68da07286c0534bb6)](https://circleci.com/gh/squadded/widget/tree/master)


# Widget

>

## Build Setup

~~~bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
~~~

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Build Env Vars
- `WS_LINK`: fully qualified URL (with port) of the Websocket endpoint (example: `https://api.squadded.co/`)
- `BASE`: Base URL of the HTML document in the iframe (example: `/widget/`)
- `FB_APP_ID`
- `API_ENDPOINT`: the fully qualified endpoint root of the backend services, no trailing slash (example: `https://api.squadded.co`)
