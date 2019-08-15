"use strict";

var css = "span{position:absolute;top:105px;right:100%;width:47px;height:80px;overflow:hidden;}.container{position:absolute;right:0;border-left:7px solid black;height:100%;background:white;}.container button{border:none;outline:none;width:80px;height:80px;background:black 17px center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAA1CAIAAAARVSbWAAAFdUlEQVR42p1VfUyVVRw+H+997ydXKC3GJhDNzGp+oCEOURA/kHAaWDpy4he1dOiMaqklpmZMU0LF2GyWWDpjoARzs5aIIn5QIVOapcgQYeYX4JXLvfd9zzmd817uB9ybW50/7u455znn/H7P8/x+LwT/ZcCAP4MGC0BDgJmUMjmFEKoCpgJAEaQMuWy915rr+xgVKDoQ3XGz497fD10EEQRcHC8brl75NTdnoZMQ7xs+dOu11hEvvkCA2GQQJqSmLcjKWr34Df+I+tGISbdvdkbHDKfAqfI1BFLmZqRnvLV2cSakvtjdyUkA4Mbfrk6Mn6io9iFDn+5++KCppW3xoqVN9acgdXjC9lEhZWYs3Lzls5/q6o5XVxXu2f3Y9mjKhFhIXEB1sEGc8Mcs5lAAcdGeYkvokA8+Xnfr2h+AQ4PwDd1JQIwxISqEYs4XEAKUeN9nAaJA4KYWazMKtUPBtBy4yjkFsoxkJ3EQoAZH8wm/lW8inUSx0fpM5KOOVkjsXgMINBKPQ3EhoBaGHsvWzE8/XLYk+2R51e68NdDlBKA/JIHGWqgQyywkZFVh8ZTkefcZXRMfq/S0YVcfV1dLwj8SKANkHhYVtWp93qYNG78698u7o+P09m4FqBT6jAj7CZSN3zc2/1B1onpbAbXd3Xni+HuZWaCvm78LVcS5oQMYRBiYzblbP4+Ynal03cuflYFsNkDvEKgRKVIjAzjhouh1BtOwyIjEV3PX54cpOCc1qaernXPEGWBa4IMZ5LcwIaJlWPiIBSuX7960GqrclJAG11IjXCe2JclkcDpsgZF4GGdAD0wEMCLmCk9QxwQFChK08F3/u5G4Uefhi/UbBYsD/LDQx+fvzZsKEJUszCJR8PuFS5WnKrtAN9MpRsWQOGbimcv1fdjlRctvZi7Vy2bsVPUqey15xsjnRkyYF+tEjjBqqjt6NiFr+l340O1RWYubiv8MQ63yMlIypqYkrdz4Tqhqbay8GDd3wn3Y218NPAOk8cELmmg2jAgdfuDAwdT5SVZqbai+GJ8+vgvaodvNIhOoE4nybiKUZl/vP9TcdLlo71YDs178uSF+1rhejtYohqpkqrx+4zGUoM1ucjGDXXX22F6fk4RYjwSsdTUNk2aMU4Ddx6DValUJ63OJSmGEiAe1KkYIafVKKKUDfKKxLGoSSxJP1uVyBKv5AQr5OhkD4Elot03cg3r6UwCa08skrDPJevOKj9b1EEdF6eHe+z0pyVNqyw8piArWiMeD/D4C8fzlK/LWf1JzvvFKe8vMuemywXCytPTwlnyoKoq3P4lYIX9UamptHTtylOQU7YlicLSx4cvivef3l0iUqf5oYEChT4UfK6tMnjYVUDtWhEThr7y0Yde+3JnJGo7f540EQWNIaNmxqtmpqVBjTdbJ4aNeXrutIC99Oi+mIJG0tHfGjhlnf3BX4Wt6XNv8V86S7OtnazyN0VM72kE8enzc4YqKzt5Hd7ofhEWE3/7zxso56Vwiyk8zNBiNZQNE0tBnI2Iioy/V10NGEHbwXs+43sTdHv+POsHmgbIP7j6idCDklgKUMsoY/2UsKBpGRUV3dnbwVhY/OXFfSUn9ubrVOW9TKowK/BkUVmZS+63OmJgYvcVw9kJzYuKkIz+Wn6o8VlSwWftu+3GCEIwc/nxa2pz9336jGFFNdd20hDi9WV6UnX2guHAwmo8QS5jRaLE7ndt2ba85WXu87CBXWG+0IrXXzmn0R0OIGEO32m4vW7biix07x8aOxTq19Mh3Ldfb89e9z7ytz/PN4wYH0dHRxXuLd2wvPH3mNK/FM7U1ydMSFO7WAE7645EkSfV87vR6GULicDgC0P4SBVXl37R88vgHZN1jZ384CwgAAAAASUVORK5CYII=);border-radius:50%;}.container.open span{width:40px;}.container.open button{background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAfCAYAAAAWRbZDAAAAz0lEQVRIS+2U0Q3CMAxE7zaBTegmdBJgEroJ3aTdxOiqIFX81E6afMV/VZM83bMTomGxIQsddortrrG9RjN7A3iRXHPo7p4l0B3ATHKoDXsCeCSI0uk7VO5kOtXMioAhWCkwDEtADYr6p3IrzYVdAAh4S8CB5HzUwCxYSifQJwFWkteasAWAEqrqJTMzJfopHElOR6n0P6xxd7m13w0Kw5rdMzPTqGsCVRPJ0aNuv8atsfXbuN2t3Ec43LOotv/1bo2loJ7sDIPbGb1np6j8Av8PSiDShYtYAAAAAElFTkSuQmCC);background-position-x:7px;}";

(function () {
  function getFrame(frameWidth) {
    var frame = document.createElement('iframe');
    frame.frameBorder = 0;
    frame.width = frameWidth;
    frame.src = 'http://static.squad-shopping.com/';
    return frame;
  }

  if (document.body.attachShadow) {
    var root = document.createElement('aside');
    var state = {
      open: false,
      frame: false
    };
    root.style.position = 'fixed';
    root.style.top = '0px';
    root.style.bottom = '0px';
    root.style.right = '0px';
    root.style.zIndex = '9999';
    var style = document.createElement('style');
    style.innerHTML = css;
    var button = document.createElement('button');
    var cut = document.createElement('span');
    var container = document.createElement('div');
    container.classList.add('container');
    button.addEventListener('click', function () {
      var frameWidth = Math.min(window.innerWidth, 400) - 42;

      if (!state.open) {
        container.style.width = "".concat(frameWidth, "px");

        if (!state.frame) {
          var frame = getFrame(frameWidth);
          frame.height = container.offsetHeight;
          container.append(frame);
          state.frame = true;
        }
      } else {
        container.style.width = '0';
      }

      container.classList.toggle('open');
      state.open = !state.open;
    });
    cut.appendChild(button);
    container.appendChild(cut);
    var shadow = root.attachShadow({
      mode: 'closed'
    }); // Forbidden JS access inside

    shadow.appendChild(style);
    shadow.appendChild(container);
    document.body.appendChild(root);
  } else {// TODO log legacy browser
  }
})();
