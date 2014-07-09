mirror
======

mirror your exsisting apis to static files based mock apis

how-to
======

1. if you have to login to consume the apis, please set the `login` in settings.json
2. if you want to force re-generate, use the `-f` flag, otherwise just remove the json file of which you'd like to refresh

endpoints.json
==============

An endpoint object should follow the [conventions](http://nodejs.org/api/url.html).

We can do the auto-completion for you, but there is a priority.

    # if ep.href
    # !!!RECOMMENDED!!!
    {
      "href": "http://localhost/DIWAPI_CMT/API/Scopes?a=1&b=2"
    }

    # elif ep.path and ep.path.startWith('./')
    # will append setting:url_prefix to the left
    {
      "path": "./Scopes?a=1&b=2"
    }

    # elif ep.pathname and ep.pathname.startWith('./') and ep.query
    {
      "pathname": "./Scopes",
      "query": {
        "a": 1,
        "b": 2
      }
    }

    # else follow the conventions or error
