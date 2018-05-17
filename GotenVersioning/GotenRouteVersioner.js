/* 
  ** Public Properties:
    - versions, Array[GotenVersion]. Es un array con las versiones a usar.
*/

class GotenRouteVersioner {
  constructor(versions){
    this.routeVersions = transformRoutes(versions)
  }

  getVersionedRoutes() {
    return this.routeVersions
  }
}

const transformRoutes = (versions) => {
  const transformedRoutes = {}
  versions.forEach((version, index) => {
    let versionName = "v" + (index+1)
    transformedRoutes[versionName] = version
  })
  return transformedRoutes
}

module.exports = GotenRouteVersioner