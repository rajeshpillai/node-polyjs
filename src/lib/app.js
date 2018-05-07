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

    use(callback) {
        this.middlewares.push(callback);
        return this;
    }

    handle(req, res) {
        let index = 0;
        res.__proto__ = Response.prototype;
        res.app = this; // used in res.render
        
        let  next = () => {
            let middleware = this.middlewares[index++];
            try {
                if (middleware) {
                    middleware(req, res, next);
                } else {
                    //console.log("app->handle: ", req.url);
                    this.router.handle(req, res);
                }

            } catch(e) {
                if (e.status) {
                    res.send(e.status, e.message);
                } else {
                    throw e;
                }
            }
        }

        next ();
    }

    set(name, value) {
        this.settings[name] = value;
    }

    render(file, locals, callback) {
        let engineName = this.settings['view engine'],
                engine = cons[engineName],
                path = this.settings['views'] + '/' + file  + '.' + engineName;

        engine(path, locals, function (err, html) {
            if (err) throw err;
            callback(html);
        })
    }

    listen(port, hostname) {
        let server = http.createServer((req, res) => {
            this.handle(req, res);
        });
        return new Promise((res, rej) => {
            server.listen(port, hostname, (err) => { 
                if (err) rej(err);
                console.log(`server running on port ${port}`);
                res();
            });
        });
    }
}


module.exports = App;