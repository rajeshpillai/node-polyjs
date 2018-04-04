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
        console.log(`Navigating to ${url}`)
        let gets = this.routes["GET"];
        console.log("GETS: ", gets);
        let urlPaths = null;
        let patternToken = null;
        let match = gets.filter((r) => {
            patternToken = r.path.split("/");
            urlPaths = url.split("/");
            console.log("SPLITS: ", patternToken, patternToken.length);
            console.log("urlPaths: ",urlPaths);
            if (!patternToken) return null;
            if (patternToken[0].toLowerCase() === urlPaths[0].toLowerCase()) {
                return r;
            }
        })[0];

        console.log("FOUND: ", match);

        // Make parameter array
        let params = patternToken.reduce((arr,token, index) => {
            console.log(`Found ${token} at index ${index}`);
            if (token.startsWith(":")) {
                console.log(`About to return ${urlPaths[index]}`)
                return arr.concat(urlPaths[index]);
            } else return [];
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


//console.log("ROUTES: ", router.routes["GET"]);

router.navigate("");
router.navigate("goodbye");

router.navigate("greeting/hello");
router.navigate("message/rajesh/radhika");
module.exports = Router;

