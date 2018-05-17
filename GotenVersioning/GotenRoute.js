/* 
  ** Public Properties:
    - method, string. Debe coincidir con alguno de los métodos usados por express ('get','post',etc...)
    - path, string. El path relativo a la ruta, sin version.
    - middlewares, Array[AsyncFunction]. Es un array con middlewares aceptados por express.
    - name, ?string. Por defecto es 'method'+'path' (ej., con method 'get' y path '/test' => 'get/test')
*/

class GotenRoute {
  constructor(method, path, middlewares, name = null){
    this.method = (router) => (path, midd) => router[method](path, midd)
    this.path = path
    this.middlewares = middlewares
    this.name = name || (method + path) 
  }
}

module.exports = GotenRoute
