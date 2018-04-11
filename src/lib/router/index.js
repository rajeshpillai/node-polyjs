const url = require('url');
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

        console.log("router->handle", parsedUrl.query, parsedUrl.pathname);
        
        let result = this.match(req.url, req.method);

        if (!result) { return res.end();}
        //console.log("PARAMS: ", result.params);

        req = this._setUpRequestParams(req, result.params, result.qs);
        result.match.callback(req, res);
    }

    _setUpRequestParams(req, params,qs) {
        req.params= {};
        req.qs = {};
        for(let p in params) {
            req.params[p] = params[p];
        }

        for(let p in qs) {
            req.qs[p] = qs[p];
        }

        return req;

    }

    match(urlpath, method="get") {
        let methods = this.routes[method.toLowerCase()]; 
        let oldUrl = urlpath;

        let urlPaths = null;   // Store URL as token
        let patternToken = null;  // Store route pattern as token

        let parsedUrl = url.parse(urlpath, true); // parse query string

        urlpath = parsedUrl.pathname;

        //console.log("router->handle", parsedUrl.query, parsedUrl.pathname);

        //console.log("methods: ", methods);
        urlPaths = urlpath.split("/");  // Convert the url to token array

        // Match token - 3 steps
        // 1.  Extract pattern from routes as string excluding dynamic params
        // 2.  Extract url as string from url excluding dynamic params
        // 3.  Compare the two


        let flatPath = {};

        let match = null;
        let matchCount= {};
        //methods.forEach((r) => {
        for(let i in methods) {
            let r = methods[i];
            patternToken =r.path.split("/");  // Convert the route path to token array

            console.log("key: ", urlpath, r.path);
            // combine 'terms' from pattern with url
            var combinedUrlPatterns;
            var found = true;
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
                //break;
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
