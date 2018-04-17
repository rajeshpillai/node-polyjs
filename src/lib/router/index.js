const url = require('url');
const qs = require("querystring");
const { METHODS } = require("http");

class Router {
    constructor() {
        this.routes = {};
        METHODS.forEach(verb => {
            this.routes[verb.toLowerCase()] = [];
            // Add methods to 'this' instance
            this[verb.toLowerCase()] = function (path, callback) {
                this.route(verb, path, callback);
            }
        })
    }

    route(method, url, callback) {
        let routes = this.routes[method.toLowerCase()];
       
        let patternToken = url.split("/");
        let combinedPatternSearchTerms = patternToken.reduce((arr,token, index) => {
            if (!token.startsWith(":")) {
                return arr.concat(patternToken[index]);
            } else return arr;
        },[]).join('');

        routes.push({
            path: url,
            key: combinedPatternSearchTerms,
            callback: callback
        })
    }

    handle(req, res) {
        let parsedUrl = url.parse(req.url, true); // parse query string

        console.log("router->handle", parsedUrl.query, parsedUrl.pathname, req.method);
        
        let result = this.match(req.url, req.method);

        if (!result) { return res.notFound().end('Not found!');}
        //console.log("PARAMS: ", result.params);

        req = this._setUpRequestParams(req, result.params, result.qs);
        
        if (req.method.toLowerCase() === 'get') {
            result.match.callback(req, res);
            return;
        }
        this._setUpPost(req, res, function postComplete(req,res) {
            result.match.callback(req, res);
            return;
        });
    }

    _setUpPost(req, res, onComplete) {
        // POST method
        if (req.method == "POST") {
            let postedData = "";
            req.on("data", function (chunk) {
                console.log(chunk);
                postedData += chunk;
            });
            req.on("end", function () {
                let body = qs.parse(postedData);

                console.log('POST: ', body);
                req.body = body;
                //res.writeHead(302, {"Location": req.url});  // Status: 302->found
                res.writeHead(302);
                onComplete(req,res);
            })
        }
    }
    _setUpRequestParams(req, params,query) {
        req.params= {};
        req.qs = {};
        for(let p in params) {
            req.params[p] = params[p];
        }

        for(let p in query) {
            req.qs[p] = query[p];
        }
        return req;
    }

    match(urlpath, method="get") {
        let methods = this.routes[method.toLowerCase()]; 

        let urlPaths = null;   // Store URL as token
        let patternToken = null;  // Store route pattern as token

        let parsedUrl = url.parse(urlpath, true); // parse query string

        urlpath = parsedUrl.pathname;

        urlPaths = urlpath.split("/").filter(String);  // Convert the url to token array


        let flatPath = {};

        let match = null;

        for(let i in methods) {
            let r = methods[i];
            patternToken =r.path.split("/").filter(String);  // Convert the route path to token array
            console.log('patternToken : ', patternToken);
            
            var found = true;

            //  If the url token and pattern token not same lenght,then false.
            if (urlPaths.length !== patternToken.length) {
                found = false;
                continue;
            }
            for(let j = 0; j < urlPaths.length; j++) {
                for(let k = 0; k < patternToken.length; k++) {
                    let token = patternToken[k];
                    if (!token.startsWith(":")) {
                        if (token !== urlPaths[k]) {
                            found = false;
                        }
                    } 
                };
            }

            if (found) {
                match = r;
                break;
            }
        }

        if (!match) return;

        console.log('match: ', match);

        let paramsMap = patternToken.reduce((arr,token, index) => {
            if (token.trim().length === 0) return arr;
            if (token.startsWith(":")) {
                let cleanToken = token.substr(1);
                arr[cleanToken] = urlPaths[index];
                return arr;
            } else return arr;
        },{});

        console.log("params: ", paramsMap);

        //let qs = urltoken[1].split("&");
        return {
            match,
            params: paramsMap,
            qs: parsedUrl.query
        };
    }
}

module.exports = Router;
