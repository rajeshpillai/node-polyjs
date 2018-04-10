let rocket = require('../lib/rocket');

let app = rocket();

app.get('/', (req, res) => {
    console.log(`Fetching...`);
});

app.get('/greeting/:message', (req, res) => {
    console.log(`Welcome...${req.url} -> ${req.message}`);
});

app.get('/send/:message/:bye', (req, res) => {
    console.log(`Welcome...${req.url} -> ${req.message} -> -> ${req.bye}`);
});



//console.log(app.router.routes);

app.listen(3000);

