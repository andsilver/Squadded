# squad-widget

>

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).

## Inject lib

To inject squad-widget add this code to your page

```javascript
(function(d, s, id) {
  var js, sjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://static.squad-shopping.com/lib/squad-widget.min.js";
  sjs.parentNode.insertBefore(js, sjs);
}(document, 'script', 'squad-js'));
```
