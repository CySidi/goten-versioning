let router = require('express').Router()

const gotenVersionManager = {
  createRoutes: (routes) => {
    const {v1, ...versions} = routes
    if (!v1.deprecated)    
      createEndpoints(v1.routes)
    let previousEndpoints = null
    for (let versionName in routes){
      let versionedRoutes = routes[versionName]
      let endpoints = versionedRoutes.routes
      if (previousEndpoints)
        endpoints = mergeRoutes(previousEndpoints, endpoints, versionedRoutes.ignorePrevious)
      if (!versionedRoutes.deprecated)
        createEndpoints(endpoints, '/'+versionName)
      previousEndpoints = endpoints
    }
  },
  getRouter: () => {
    return router
  }
}

const createEndpoints = (routes, relativePath = '') => {
  let path
  routes.forEach((route) => {
    //TODO: previopath = {...previous, [route.name]: route.method(router)}
    path = relativePath + route.path
    route.method(router)(path, route.middlewares) // TODO - ver como evitar duplicar (redireccionar)
  })
}

// Mergea los arrays 'previousEndpoints' y 'endpoints', ignorando aquellos valores
// cuyos 'name' se encuentren en el array de strings 'ignorePrevious'. Si algun
// valor comparte el 'name', prevalece el de 'endpoints'
const mergeRoutes = (previousEndpoints, endpoints, ignorePrevious = []) => {
  const validPreviousEndpoints = previousEndpoints.filter(
    (previousEndpoint) => {
      return !(
        ignorePrevious.includes(previousEndpoint.name) || 
        endpoints.map(e => e.name).includes(previousEndpoint.name)
      )
    }
  )
  return endpoints.concat(validPreviousEndpoints)
}

module.exports = gotenVersionManager