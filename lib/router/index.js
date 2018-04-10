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
        routes.push({
            path: url,
            callback: callback
        })
    }

    handle(req, res) {
        console.log("router->handle");
        let match = this.match(req.url, req.method);
        if (!match) { return res.end();}
        match.callback(req, res);
        res.end(); 
    }

    match(url, method="get") {
        let methods = this.routes[method.toLowerCase()]; 

        let urlPaths = null;   // Store URL as token
        let patternToken = null;  // Store route pattern as token

        let match = methods.filter((r) => {
            patternToken = r.path.split("/");  // Convert the route path to token array
            urlPaths = url.split("/");  // Convert the url to token array

            // combine 'terms' and compare
            let combinedPatternSearchTerms = patternToken.reduce((arr,token, index) => {
                console.log(`Found ${token} at index ${index}`);
                if (!token.startsWith(":")) {
                    console.log(`About to return ${patternToken[index]}`)
                    return arr.concat(patternToken[index]);
                } else return arr;
            },[]).join();

             // combine 'terms' from pattern with url
             let combinedUrlPatterns = patternToken.reduce((arr,token, index) => {
                //console.log(`Found ${token} at index ${index}`);
                if (!token.startsWith(":")) {
                    //console.log(`About to return ${urlPaths[index]}`)
                    return arr.concat(urlPaths[index]);  // get it from url
                } else return arr;
            },[]).join();

            console.log("combinedPatterns: ",combinedPatternSearchTerms, combinedUrlPatterns);

            // If the base url matches, return the token as a match.  Since filter returns an array,
            // we just grab the first element at index 0
            if (combinedPatternSearchTerms  === combinedUrlPatterns) {
                return r;
            }
        })[0];

        if (!match) return;
        console.log("FOUND: ", match.path);

        // Make parameter array
        let params = patternToken.reduce((arr,token, index) => {
            //console.log(`Found ${token} at index ${index}`);
            if (token.startsWith(":")) {
                //console.log(`About to return ${urlPaths[index]}`)
                return arr.concat(urlPaths[index]);
            } else return arr;
        },[])
        return match;
    }
}

module.exports = Router;
