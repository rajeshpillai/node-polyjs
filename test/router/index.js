const Router = require ("../../lib/router");
const assert = require("assert");

describe("Router", function () {
    beforeEach(function () {
    })
    
    it("can store one GET route", () => {
        var router = new Router();
        var callback = function () {};
        router.route("GET", "/", callback);
        
        assert.deepEqual(router.routes["GET"], 
            [
                { 
                    regexp: new RegExp("^/$", "i"),
                    callback: callback
                }
            ]
        )
    });

    it("can store multiple GET routes", () => {
        var router = new Router();
        var callback = function () {};
        router.route("GET", "/", callback);
        router.route("GET", "/home", callback);
        
        assert.deepEqual(router.routes["GET"], 
            [
                { 
                    regexp: new RegExp("^/$", "i"),
                    callback: callback
                },
                { 
                    regexp: new RegExp("^/home$", "i"),
                    callback: callback
                }
            ]
        )
    });

    it("Get route with one parameter", () => {
        var router = new Router();
        var callback = function () {};
        router.route("GET", "/:id", callback);
        
        assert.deepEqual(router.routes["GET"], 
            [
                { 
                    regexp: new RegExp("^/:id$", "i"),
                    callback: callback
                }
            ]
        )
    });
})
