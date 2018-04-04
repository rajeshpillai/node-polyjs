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
            path: url,
            callback: callback
        })
    }

    navigate(url) {
        let gets = this.routes["GET"];  // Get all the get methods;

        let urlPaths = null;   // Store URL as token
        let patternToken = null;  // Store route pattern as token

        let match = gets.filter((r) => {
            patternToken = r.path.split("/");  // Convert the route path to token array
            urlPaths = url.split("/");  // Convert the url to token array

            // combine 'terms' and compare
            let combinedPatternSearchTerms = patternToken.reduce((arr,token, index) => {
                //console.log(`Found ${token} at index ${index}`);
                if (!token.startsWith(":")) {
                    //console.log(`About to return ${patternToken[index]}`)
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

        console.log("FOUND: ", match.path);

        // Make parameter array
        let params = patternToken.reduce((arr,token, index) => {
            //console.log(`Found ${token} at index ${index}`);
            if (token.startsWith(":")) {
                //console.log(`About to return ${urlPaths[index]}`)
                return arr.concat(urlPaths[index]);
            } else return arr;
        },[])

        console.log("PARAMS: ", params);
        if (match) {
            //match.callback(params[0]);
            match.callback.apply(null,params);
        }
    }
}

let router = new Router();
var callback = function () { console.log("CALLBACK: Default route")};
router.route("GET", "", callback);
router.route("GET", "goodbye", ()=> { console.log("CALLBACK: good bye")});
router.route("GET", "greeting/:msg", (msg) => { console.log(`CALLBACK: Greeting with ${msg}`)});
router.route("GET", "message/:from/:to", (from, to) => { console.log(`CALLBACK: Message from ${from} -> ${to}`)});

router.route("GET","blog/:id/show", (id) => {
    console.log(`Showing blog with id ${id}`);
});
router.route("GET","blog/:id/edit", (id) => {
    console.log(`Editing blog with id ${id}`);
});


//console.log("ROUTES: ", router.routes["GET"]);

// router.navigate("");
// router.navigate("goodbye");
// router.navigate("greeting/hello");
// router.navigate("message/rajesh/radhika");
router.navigate("blog/1/show");
router.navigate("blog/2/edit"); // This will not work, only 1st matches: FIX NEEDED


module.exports = Router;

