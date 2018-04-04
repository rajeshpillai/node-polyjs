const { METHODS } = require("http");
class Router {
    constructor() {
        this.routes = {};
        METHODS.forEach(verb => {
            this.routes[verb] = [];
        })
    }

    route(method, url, callback) {
        let routes = this.routes[method];
        routes.push({
            regexp: new RegExp("^" + url + "$", "i"),
            callback: callback
        })
    }
}

let router = new Router();
var callback = function () {};
router.route("GET", "/", callback);
console.log("ROUTER: ", router);
console.log("ROUTES: ", router.routes["GET"]);

module.exports = Router;

