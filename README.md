# nodejs-fm

[![Build Status](https://travis-ci.org/chrisvrose/nodejs-fm.svg?branch=master)](https://travis-ci.org/chrisvrose/nodejs-fm)

A simple file manager for managing files on a remote fs using Node.

![Sample Image](https://github.com/chrisvrose/chrisvrose.github.io/raw/master/static/projects/screenshots/nodejs-fm.png)

Dependencies: `express` `body-parser` `@fortawesome/fontawesome-free`  `jquery` `connect-busboy`
Dependencies(testing): `chai` `mocha` `chai-http`

## Checklist

- [x] Folder Traversal
- [X] File Downloads
- [X] File Moving
- [X] Upload

### Why

Personal requirement.
Because of this, only renaming/moving(only in same fs, due to `fs.rename()`) is available, and uploading/downloading.
No authentication, as it is based on a small local server, and the major way of accessing it, is ssh.

## Usage

Use `settings.json` and point it to a valid path, and select a required port. Default `8080`.

*_Travis only checks the backend, which is a separate entity._*

For running it:

```shell
# Clone repo
git clone https://github.com/chrisvrose/nodejs-fm.git
# Move into repo folder
cd nodejs-fm/
# Setup the project
npm i
# Your own config, start with settings.json
#...
# Start the server
npm start
```

### Server requests

Requests:

```javascript
{
    'loc': "<valid location>"
}
```

Responses (View directory):

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

Responses(Rename/Move Success,Upload)

```javascript
{
    'loc':"<new location>"
}
```

## Credit

- Samuel Thornton: [Material Design Box Shadows]("https://codepen.io/sdthornton/pen/wBZdXq")
- Chris Pratt: [File Download via Ajax]('https://codepen.io/chrisdpratt/pen/RKxJNo')
- StackOverflow: Troubleshooting errors
- Google: All knowing
