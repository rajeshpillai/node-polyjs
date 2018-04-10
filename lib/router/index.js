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
            //regexp: new RegExp("^" + url + "$", "i"),
            path: url,
            callback: callback
        })
    }

    handle(req, res) {
        console.log("router->handle");
        this.navigate(req.url, req.method, req, res);
        res.end();
    }

    navigate(url, method="get", req=null, res=null) {
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

        //console.log("PARAMS: ", params);

        if (match) {
            //match.callback(params[0]);
            //match.callback.apply(null,params);
            console.log("Calling callback: ");
            match.callback(req, res);
        }
    }
}

// let router = new Router();
// var callback = function () { console.log("CALLBACK: Default route")};
// router.route("GET", "", callback);
// router.route("GET", "goodbye", ()=> { console.log("CALLBACK: good bye")});
// router.route("GET", "greeting/:msg", (msg) => { console.log(`CALLBACK: Greeting with ${msg}`)});
// router.route("GET", "message/:from/:to", (from, to) => { console.log(`CALLBACK: Message from ${from} -> ${to}`)});


// router.route("GET","blog/:id/show", (id) => {
//     console.log(`Showing blog with id ${id}`);
// });
// router.route("GET","blog/:id/edit", (id) => {
//     console.log(`Editing blog with id ${id}`);
// });

// router.get("hey", ()=> {console.log("hey")});

// router.navigate("blog/1/show");
// router.navigate("blog/2/edit"); // This will not work, only 1st matches: FIX NEEDED
// router.navigate("hey");

module.exports = Router;

//console.log(router);