/* 
  ** Public Properties:
    - routes, Array[GotenRoute]. Es un array con las rutas de la version.
    - ignorePrevious, ?Array[string]. Por defecto es una lista vacía. En caso de querer ignorar rutas de
    versiones previas, se pasa una string que debe coincidir con su 'name'.
*/

class GotenVersion {
  constructor(routes, ignorePrevious = []){
    this.routes = routes
    this.ignorePrevious = ignorePrevious
    this.deprecated = false
  }

  deprecate() {
    this.deprecated = true    
  }
}

module.exports = GotenVersion