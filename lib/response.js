var http = require('http')

// Our own Response class.
// We make `res` inherit from this to add our own helper methods.
function Response() {}

Response.prototype = Object.create(http.ServerResponse.prototype)
Response.prototype.constructor = Response


// Default Content-Type to HTML.
Response.prototype.contentType = 'text/html'

// Helper to send a response.
// Usage:
//   res.send('body')
//   res.send(404, 'Not found')
Response.prototype.send = function(status, body) {
  if (body == null) {
    body = status
    status = 200
  }

  this.writeHead(status, {
    'Content-Length': body.length,
    'Content-Type': this.contentType
  })
  this.end(body)
}

Response.prototype.json = function( body) {
  let status = 200;
  if (body == null) {
    body = status
  }
  this.contentType = "application/json";
  
  body = JSON.stringify(body);
  this.send(body);
}

Response.prototype.render = function(file, locals) {
  var self = this

  this.app.render(file, locals, function(html) {
    self.send(html)
  })
}

module.exports = Response;
