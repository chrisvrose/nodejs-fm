# nodejs-fm

![Build Status](https://github.com/chrisvrose/nodejs-fm/workflows/Node.js%20CI/badge.svg)]

A simple file manager for managing files on a remote fs using Node.

![Sample Image](https://github.com/chrisvrose/chrisvrose.github.io/raw/gh-pages/static/projects/screenshots/nodejs-fm.png)

Dependencies: `express` `body-parser` `@fortawesome/fontawesome-free`  `jquery` `connect-busboy`,`morgan`
Dependencies(testing): `chai` `mocha` `chai-http`

### Why

Personal requirement.
Because of this, only renaming/moving(only in same fs, due to `fs.rename()`) is available, and uploading/downloading.
No authentication, as it is based on a small local server, and the major way of accessing it, is ssh.

## TOC

- [nodejs-fm](#nodejs-fm)
    - [Why](#why)
  - [TOC](#toc)
  - [Usage](#usage)
    - [Using settings.json](#using-settingsjson)
    - [Server requests](#server-requests)
  - [Credit](#credit)
  - [Checklist](#checklist)
  - [Dev Checklist](#dev-checklist)

## Usage

Use `settings.json` and point it to a valid path, and select a required port. Default `8080`. Refer [how to use settings.json](#using-settingsjson).

*_Travis only checks the backend, which is a separate entity._*

For running it:

```bash
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

### Using settings.json

You need to have a `settings.json` in the project directory. A sample has been provided for usage.

|Key       |Type     |Default    |Desc                    |
|:---------|:-------:|----------:|:-----------------------|
|dirname   |`string` |`./sandbox`|Directory to serve      |
|showHidden|`boolean`|false      |Show hidden files       |
|port      |`number` |8080       |Webserver listening port|



### Server requests

Requests:

```json
{
    "loc": "<valid location>"
}
```

Responses (View directory):

```json
{
    "loc": "<location>",
    "back": "<location|null>",
    "contents":[
        {
            "name":"<filename>",
            "path":"<location>",
            "isDir": "<true|false>"
        },
    ]
}
```

Responses(Rename/Move Success,Upload)

```json
{
    "loc":"<new location>"
}
```

## Credit

- Samuel Thornton: [Material Design Box Shadows]("https://codepen.io/sdthornton/pen/wBZdXq")
- Chris Pratt: [File Download via Ajax]('https://codepen.io/chrisdpratt/pen/RKxJNo')
- StackOverflow: Troubleshooting errors
- Google: All knowing


## Checklist

- [x] Folder Traversal
- [X] File Downloads
- [X] File Moving
- [X] Upload

## Dev Checklist

- [x] Folder Traversal
- [X] File Downloads
- [X] File Moving
- [X] Upload
- [X] Integration with frontend
