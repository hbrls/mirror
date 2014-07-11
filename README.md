mirror
======

mirror your exsisting apis to static files based mock apis.

how-to
======

1. if you have to login to consume the apis, please set the `login` in settings.json
2. if you want to force re-generate, use the `-f` flag, otherwise just remove the json file of which you'd like to refresh
3. use `node find.js --name org` to find the endpoint
4. and you have to implement a `Access-Control-Allow-Origin: http://localhost:9876` policy to enable karma tests

endpoints.json
==============

An endpoint object should follow the [conventions](http://nodejs.org/api/url.html).

We can do the auto-completion for you, but there is a priority.

    # if ep.href
    # !!!RECOMMENDED!!!
    {
      "href": "http://host/pathname?a=1&b=2"
    }

    # elif ep.path and ep.path.startWith('./')
    # will append setting:url_prefix to the left
    {
      "path": "./pathname?a=1&b=2"
    }

    # elif ep.pathname and ep.pathname.startWith('./') and ep.query
    {
      "pathname": "./pathname",
      "query": {
        "a": 1,
        "b": 2
      }
    }

    # else follow the conventions or error

same pathname, different query
==============================

`query` will be sorted asc, so that the `href` will always be unique if the queries are de facto the same one.

    # unique
    http://host/pathname?a=1&b=2
    http://host/pathname?b=2&a=1

    # different without conflict, but your code smells
    http://host/pathname?a=y1.y2&b=2
    http://host/pathname?a=y2.y1&b=2
    http://host/pathname?a=y1.y2&B=2

and you have to implement the same `normalize` and `hash_id` functions in your backend code.

    # string before search shall be lowercased, search shall stay unchanged
    http://host/pathname?A=AlBeRt&b=BaRack

    # hash_id is the md5 of the original api
    http://original_host/pathname?a=1&b=2
