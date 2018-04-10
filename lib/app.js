let Router = require('./router'),
    http = require('http');

class App {
    constructor () {
        this.router = new Router();
        this.middlewares = [];
        this.settings = {};
        this.methods = ['GET','POST','PUT','PATCH','DELETE'];

        this.init();
    }

    init() {
        this.methods.forEach((method) => {
            this[method.toLowerCase()] = function (path, callback) {
                this.router.route(method, path, callback);
            }
        });
    }

    handle(req, res) {
        console.log("app->handle: ", req.url);
        this.router.handle(req, res);
    }

    listen(port) {
        let server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        server.listen(port, () => { console.log(`server running on port ${port}`)});
    }
}


module.exports = App;