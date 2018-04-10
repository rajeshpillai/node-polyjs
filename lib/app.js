let Router = require('./router'),
    http = require('http'),
    cons = require('consolidate'),
    Response = require('./response');

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
        res.__proto__ = Response.prototype;
        res.app = this; // used in res.render
        console.log("app->handle: ", req.url);
        this.router.handle(req, res);
    }

    set(name, value) {
        this.settings[name] = value;
    }

    render(file, locals, callback) {
        console.log("app->rendering...");
        let engineName = this.settings['view engine'],
                engine = cons[engineName],
                path = this.settings['views'] + '/' + file  + '.' + engineName;

        console.log(`Rendering ${path}`)
        engine(path, locals, function (err, html) {
            if (err) throw err;
            console.log("html-> ", html);
            callback(html);
        })
    }

    listen(port) {
        let server = http.createServer((req, res) => {
            this.handle(req, res);
        });

        server.listen(port, () => { console.log(`server running on port ${port}`)});
    }
}


module.exports = App;