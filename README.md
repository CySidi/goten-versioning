Goten Versioning
====

## Installation

To install this package, currently we should do it like:

`$ npm install -s git+https://github.com/CySidi/goten-versioning`

## Usage

To use it,

`const GotenVersioning = require('goten-versioning')`

And then you can access the **GotenVersioning** classes and functions. Here's a list of defined ones:

  - [GotenMethods](#gotenmethods)
  - [GotenRoute](#gotenroute)
  - [GotenRouteVersioner](#gotenrouteversioner)
  - [GotenVersion](#gotenversion)
  - [GotenVersionManager](#gotenversionmanager)

## Description

This package aims to help versioning routes for a project with the following structure. Example:
```js
const express = require('express')
const app = express()
const router = express.Router()

const controllerV1 = require('./routes/api/v1/testController')
const controllerV2 = require('./routes/api/v2/testController')

// default (same as v1)
router.get('/test', controllerV1.getTestV1)

// v1
router.get('/v1/test', controllerV1.getTestV1)

// v2
router.get('/v2/test', controllerV1.getTestV1)
router.get('/v2/test2', controllerV2.getTestV2)

// v3
router.get('/v3/test2', controllerV1.getTestV1)

app.use(router)

app.listen(8001, () => {
  console.log("Running on port 8001")
})
```

Using Goten Versioning, you would do it this way:

```js
const express = require('express')
const app = express()
const router = express.Router()

// Goten imports
const GotenRoute = require('goten-versioning').GotenRoute
const GotenVersion = require('goten-versioning').GotenVersion
const GotenRouteVersioner = require('goten-versioning').GotenRouteVersioner
const gotenVersionManager = require('goten-versioning').GotenVersionManager
const METHOD = require('goten-versioning').GotenMethods

const controllerV1 = require('./routes/api/v1/testController')
const controllerV2 = require('./routes/api/v2/testController')

// v1 and default
const version1 = new GotenVersion([
  new GotenRoute(METHOD.GET, "/test", [controllerV1.getTestV1]),
])

// v2
const version2 = new GotenVersion([
    new GotenRoute(METHOD.GET, "/test2", [controllerV2.getTestV2]),
])

// v3
const version3 = new GotenVersion([
    new GotenRoute(METHOD.GET, "/test2", [controllerV1.getTestV1]),
  ],
  ["get/test"]
)

const routeVersioner = new GotenRouteVersioner([version1, version2, version3])

// creates router and sets versioned routes
gotenVersionManager.createRoutes(routeVersioner.getVersionedRoutes())

app.use(gotenVersionManager.getRouter())

app.listen(8001, () => {
  console.log("Running on port 8001")
})
```

----

### GotenMethods

Exports an object that defines HTTP methods (supported by express) as strings.

```js
const METHOD = require('goten-versioning').GotenMethods

console.log(METHOD.GET) // prints 'get'
```

----

### GotenRoute

Exports the class **GotenRoute**. An instance of this class represents a route that has as attributes *method* (one of **GotenMethod**), *path* (a string that represents the relative path, which does **NOT** include the version), *middlewares* (an array of middlewares that express supports, where the last one is the controller to use) and *name*, which is an optional argument where we define the name of the **GotenRoute** (by default, it gets defined as `method + path`).

```js
const METHOD = require('goten-versioning').GotenMethods
const GotenRoute = require('goten-versioning').GotenRoute

const controllerV1 = require('./routes/api/v1/testController')
const controllerV2 = require('./routes/api/v2/testController')

// in this case the name is "get/test"
const routeGetTest = new GotenRoute(METHOD.GET, "/test", [controllerV1.getTestV1])

// in this case the name is "testRoute"
const routeGetTestWithName = new GotenRoute(METHOD.GET, "/test2", [controllerV2.getTestV2], "testRoute")
```

----

### GotenVersion

Exports the class **GotenVersion**. An instance of this class represents a version that has as attributes *routes* (an array of **GotenRoute**) and *ignorePrevious*, which is an optional attribute to define which routes from previous versions should get ignored. It should receive an array of strings, which map to the name of the **GotenRoute** (by default, it gets defined as an empty array '[]').

```js
const METHOD = require('goten-versioning').GotenMethods
const GotenRoute = require('goten-versioning').GotenRoute
const GotenVersion = require('goten-versioning').GotenVersion

const controllerV1 = require('./routes/api/v1/testController')
const controllerV2 = require('./routes/api/v2/testController')
const controllerV3 = require('./routes/api/v3/testController')


// v1 routes
const version1Route1 = new GotenRoute(METHOD.GET, "/test", [controllerV1.getTestV1])
const version1Route2 = new GotenRoute(METHOD.POST, "/test", [controllerV1.postTestV1])
const version1Route3 = new GotenRoute(METHOD.GET, "/test/:id", [controllerV1.getTestByIdV1])

// v2 routes
const version2Route1 = new GotenRoute(METHOD.GET, "/test2", [controllerV2.getTestV2], "testRoute")

// v3 routes
const version3Route1 = new GotenRoute(METHOD.POST, "/test", [controllerV3.postTestV3])


// default and v1
const version1 = new GotenVersion([
  version1Route1,
  version1Route2,
  version1Route3
])

// v2
const version2 = new GotenVersion([
    version2Route1
])
 
// v3
const version3 = new GotenVersion([
    version3Route1
  ],
  ["get/test/:id"]
)
```

In this example, we defined some routes, which we will use in different versions. For instance, *version1* will have the following endpoints:

> GET .../test  
> POST .../test  
> GET .../test/:id

*version2* uses *version1*, and adds *'version2Route1'*. Results in:

> GET .../test  
> POST .../test  
> GET .../test/:id  
> GET .../test2

*version3* uses *version2*, adds *'version3Route1'* that replaces *version1Route2* (the route with the same name, 'post/test'), and ignores the route that has 'get/test/:id' as name (*version1Route3*).

> GET .../test  
> GET .../test2  
> POST .../test

You can also **deprecate()** a version. By calling this method you will prohibit users from using '/{{deprecatedVersionName}}/*', but any subsequent versions will be able to use every endpoint of the deprecated version.

For instance, if we don't want users to access *version1*, but we want to use its endpoints in subsequent versions:

```js
version1.deprecate()
```

----

### GotenRouteVersioner

Exports the class **GotenRouteVersioner**. An instance of this class is used to encapsulate versions. We pass *versions* as an array of **GotenVersion**. These will be transformed to generate versioned routes. The order of the array **DOES** matter, being the first element considered the **v1** route, the second, **v2**, and so on.

```js
const GotenRouteVersioner = require('goten-versioning').GotenRouteVersioner

const routeVersioner = new GotenRouteVersioner([version1, version2, version3])
```

After instanciating, we can get the versioned routes by accessing `routeVersioner.getVersionedRoutes()`. This returns an object where the keys are the name of each version (*v1*, *v2*, etc...) and the values are the associated **GotenVersion**.

----

### GotenVersionManager

Exports an object that has functions as attributes. We can call these two functions:

 - **createRoutes(routes)**, where routes is the object '**GotenRouteVersioner**.getVersionedRoutes()' (as seen in [GotenRouteVersioner](#gotenrouteversioner)). It creates endpoints on a express.Router(), based on the routes for each version.

 - **getRouter()**, returns the express.Router().

```js
const express = require('express')
const app = express()

const gotenVersionManager = require('goten-versioning').GotenVersionManager


gotenVersionManager.createRoutes(routeVersioner.getVersionedRoutes())

app.use(gotenVersionManager.getRouter())
```

## Contribution

To contribute to this package, we propose the following workflow:

- Add an issue with related tags to describe the contribution (is it a bug?, a feature request?)
- Branch your solution from *develop*, with the name as `#<issue_number>_<descriptive_name>`
- Pull request and wait for approval/corrections
