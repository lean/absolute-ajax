absolut-ajax
============

native ajax library

- no dependecies 
- crossbrowser
- tested on mobile and desktop browsers
- support XHR & XDR
- less than 2k after compression and gzip


##methods
```javascript
abjax.ajax({
    url: "http://someurl.com"
    type: "GET",
    success: function(response){},
    error: function(response){},
    complete: function(response){}, //XHR only
    context: undefined,
    timeout: 0,
    crossDomain: null
});

abjax.get({
    url: "http://someurl.com"
    success: function(response){},
    error: function(response){},
    complete: function(response){}, //XHR only
    context: undefined,
    timeout: 0,
    crossDomain: null
});

abjax.post({
    url: "http://someurl.com",
    data: {
        username: options.username,
        password: options.pass
    },
    type: "GET",
    success: function(response){},
    error: function(response){},
    complete: function(response){}, //XHR only
    context: undefined,
    timeout: 0,
    crossDomain: null
});
```

TODO:
- jsonp