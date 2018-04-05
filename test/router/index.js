const Router = require ("../../lib/router");
const assert = require("assert");

describe("Router", function () {
    beforeEach(function () {
    })
    
    it("can store one GET route", () => {
        var router = new Router();
        var callback = function () {};
        router.route("GET", "/", callback);
        
        assert.deepEqual(router.routes["get"], 
            [
                { 
                    //regexp: new RegExp("^/$", "i"),
                    path: "/",
                    callback: callback
                }
            ]
        )
    });

    it("can store a GET route with dynamic parameter", () => {
        var router = new Router();
        var callback = function (id) {};
        router.route("GET", "/:id", callback);
        
        assert.deepEqual(router.routes["get"], 
            [
                { 
                    //regexp: new RegExp("^/$", "i"),
                    path: "/:id",
                    callback: callback
                }
            ]
        )
    });

    it("can store a GET route with multiple dynamic parameter", () => {
        var router = new Router();
        var callback = function (from, to) {};
        router.route("GET", "message/:from/:to", callback);
        
        assert.deepEqual(router.routes["get"], 
            [
                { 
                    path: "message/:from/:to",
                    callback: callback
                }
            ]
        )
    });

    it("can attach GET method to the router instance", () => {
        var router = new Router();
        var callback = function (from, to) {};
        router.get("message/:from/:to", callback);
        
        assert.deepEqual(router.routes["get"], 
            [
                { 
                    path: "message/:from/:to",
                    callback: callback
                }
            ]
        )
    });

    it("can attach POST method to the router instance", () => {
        var router = new Router();
        var callback = function () {};
        router.post("save_user", callback);
        
        assert.deepEqual(router.routes["post"], 
            [
                { 
                    path: "save_user",
                    callback: callback
                }
            ]
        )
    });
})
