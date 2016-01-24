# hapi-react-starter-kit
A hapi React Starter kit with react-router, redux, react-transform

[![Build Status](https://travis-ci.org/Dindaleon/hapi-react-starter-kit.svg)](https://travis-ci.org/Dindaleon/hapi-react-starter-kit)
[![Dependency status](https://david-dm.org/Dindaleon/hapi-react-starter-kit.svg)](https://david-dm.org/Dindaleon/hapi-react-starter-kit "Dependency status")
[![Dev dependency status](https://david-dm.org/Dindaleon/hapi-react-starter-kit/dev-status.svg)](https://david-dm.org/Dindaleon/hapi-react-starter-kit#info=devDependencies "Dev dependency status")
[![Coverage Status](https://coveralls.io/repos/Dindaleon/hapi-react-starter-kit/badge.svg?branch=master&service=github)](https://coveralls.io/github/Dindaleon/hapi-react-starter-kit?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/16a9c5ea08814e8ebdf1cc64f680b1f3)](https://www.codacy.com/app/Dindaleon/hapi-react-starter-kit)
[![demo on OpenShift](https://img.shields.io/badge/demo-OpenShift%20--%20online-brightgreen.svg)](http://hapi-reactstarterkit.rhcloud.com)
[![npm](https://img.shields.io/npm/v/hapi-react-starter-kit.svg?style=flat-square)](https://www.npmjs.com/package/hapi-react-starter-kit)
[![NPM](https://nodei.co/npm/hapi-react-starter-kit.png?compact=true)](https://npmjs.org/package/hapi-react-starter-kit)

_Light and fast - Don't be sad, be hapi!_

**Inspired by**

This repo was inspired by the following projects and their authors 
* [react-kickstart](https://github.com/vesparny/react-kickstart) by [Alessandro Arnodo](https://github.com/vesparny)
* [react-isomorphic-starterkit](https://github.com/RickWong/react-isomorphic-starterkit) by [RickWong](https://github.com/RickWong)
* [react-transform](https://github.com/gaearon/react-transform) by [Dan Abramov](https://github.com/gaearon)
* [webpack-express-boilerplate](https://github.com/christianalfoni/webpack-express-boilerplate) by [Christian Alfoni](https://github.com/christianalfoni)
* Heavily based on [Erikras](https://github.com/erikras)' [react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example)
* [redux-react-router-async-example](https://github.com/emmenko/redux-react-router-async-example) by [emmenko](https://github.com/emmenko)
* [hapi-socketio-redis-chat-example](https://github.com/dwyl/hapi-socketio-redis-chat-example) by [dwyl](https://github.com/dwyl)
* Scaling Redis/Socketio [redispubsub](https://github.com/rajaraodv/redispubsub)

##Features
* Hapi server framework for Node. - [hapijs](https://github.com/hapijs/hapi)
* React JS Library for user interfaces. - [reactjs](https://github.com/reactjs)
* Webpack + [React-transform](https://github.com/gaearon/babel-plugin-react-transform) and [react-transform-hmr](https://github.com/gaearon/react-transform-hmr)
* React Router keeps your UI in sync with the URL. - [react-router](https://github.com/rackt/react-router)
* Flux implementation - [Redux](https://github.com/rackt/redux)
* Document Head SSR by [React-Helmet](https://github.com/nfl/react-helmet)
* ES6 and ES7 ready. - [BabelJs](https://babeljs.io/)
* Linting with eslint & jscs
* Testing with karma, mocha, isparta, webpack, sinon-chai
* Coverage with karma-coverage
* API Interface - [Swagger](https://github.com/glennjones/hapi-swagger)
* API Validation - [Joi](https://github.com/hapijs/joi)
* Database for storing user data (CRUD) - [Redis](https://github.com/NodeRedis/node_redis)
* Password encryption - [Iron](https://github.com/hueniverse/iron)
* Promises - [bluebird](https://github.com/petkaantonov/bluebird)
* Fetch [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)
* Authentication Oauth2 - Refresh/Access tokens
* Token Encoding with [node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
* Token Encryption with [node-forge](https://github.com/digitalbazaar/forge)
* i18n - [react-intl by yahoo](https://github.com/yahoo/react-intl)
* Real-time messaging - [Socket.io](https://github.com/socketio/socket.io)
* Inline CSS Styling - [Radium](https://github.com/FormidableLabs/radium)
* OpenShift deployment READY.

**_NEW_ Theming System** WIP
* Drop in themes
  - Drop your theme inside the `Themes` folder and it will just work.
* Theme switcher extension: swtich to other themes on the fly.
* Fallback to default theme.
* Themes included
  - Default (light theme)
  - Alternative (dark theme)
* Powered by Radium.

**_NEW_ Extensions System** WIP
* Drop in extensions
  - Drop your extension inside the `Extensions` folder and it will just work.
  - Extensions can have react components and redux reducers.
* Examples included
  - Counter
  - Theme switcher.

**User Accounts**
* Create/Update user accounts
* Login/Logout
* Set language (english/spanish)
* Access/Refresh token sessions (Oauth2)

**User Rooms** (powered by socket.io)
* Users can create multiple chat rooms
* Users can see who is typing

## DEMO

    http://hapi-reactstarterkit.rhcloud.com/

## Usage
**Clone this repository**

    git clone https://github.com/Dindaleon/hapi-react-starter-kit.git
    
Or

    npm i hapi-react-starter-kit

**Install**

    npm install    

**Production server**

    npm run prod   

**Development server**

    npm run dev

**Linting**

    npm run eslint
    npm run jscs

**Testing**

To check coverage check the coverage folder after running the test.
Tests are incomplete.

    npm test

**API Interface**

    Path: /api/v1/documentation
    
**Deployment Guide**

[OpenShift Deployment](https://github.com/Dindaleon/hapi-react-starter-kit/blob/master/Guides/OpenShift_Deployment.md)

##Todo
* [ ] testing, testing, testing...
* [x] improve redux implementation
* [x] Testing
* [x] Coverage
* [x] Linting
* [x] Coveralls support
* [x] add redis
* [x] add socketio
* [x] add authentication
* [x] OpenShift Deployment guide
* [ ] Heroku Deployment guide
* [ ] Documentation
* [ ] Fix webpack's HMR on server
* [ ] Implement error handling on react components
* [x] Implement geolocalization
* [x] Implement styling and theming system
* [ ] Implement layout system for themes
* [x] Implement extensions system
* [ ] Implement pages system with routing
* [ ] Invalidate reducers
* [ ] More translations
* [x] Re-structure components and pages
* [ ] Scaling Redis/Socketio
* [ ] Social integration with bell for user accounts

## License 
The MIT License (MIT)

Copyright (c) 2015 Roberto Ortis

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.