# nodejs-fm

[![Build Status](https://travis-ci.org/chrisvrose/nodejs-fm.svg?branch=master)](https://travis-ci.org/chrisvrose/nodejs-fm)

A simple file manager for managing files on a remote fs using Node.

Dependencies: `express` `body-parser` `@fortawesome/fontawesome-free` `chai` `mocha` `chai-http` `jquery` `requests` `sqlite3`

## Checklist

- [x] Folder Traversal
- [X] File Downloads
- [ ] Upload
- [ ] Auth

## Usage

Use `settings.json` and point it to a valid address, and select a required port. Default `8080`

For the backend, the jsons have this form

Requests:

```json
{
    'loc': "<valid location>"
}
```

Responses (Only for directory traversals):

```javascript
{
    'loc': "<location>",
    'back': "<location|null>",
    'contents':[
        {
            'name':"<filename>",
            'path':"<location>",
            'isDir': "<true|false>"
        },
        ...
    ]
}
```

## Credit

- Samuel Thornton: [Material Design Box Shadows]("https://codepen.io/sdthornton/pen/wBZdXq")
- Chris Pratt: [File Download via Ajax]('https://codepen.io/chrisdpratt/pen/RKxJNo')
- StackOverflow: Troubleshooting errors
- Google: All knowing