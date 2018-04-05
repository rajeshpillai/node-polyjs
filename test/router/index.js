const Router = require ("../../lib/router");
const assert = require("assert");
const sinon = require("sinon");

function once(fn) {
    var returnValue, called = false;
    return function () {
        if (!called) {
            called = true;
            returnValue = fn.apply(this, arguments);
        }
        return returnValue;
    };
}

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

    it("invokes callback when navigating to GET url without params", () => {
        // Arrange
        let router = new Router();
        let called = false;
        let callback = () => { called = true };;
        router.get("users", callback);

        // Act
        router.navigate("users");
        // Assert
        assert.equal(called, true, "Should invoke the GET call back");
    });

    it("invokes callback when navigating to GET url with params", () => {
        // Arrange
        let router = new Router();
        let called = null;
        let callback = (id) => { called = id; console.log("id: ", id); };
        router.get("users/:id", callback);

        // Act
        router.navigate("users/1");
        // Assert
        assert.equal(called, 1, "Should invoke the GET call back  with params");
    });
})
