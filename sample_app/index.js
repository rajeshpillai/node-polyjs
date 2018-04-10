let rocket = require('../lib/rocket');

let app = rocket();

app.get('/', (req, res) => {
    console.log(`Fetching...`);
});

app.get('/greeting', (req, res) => {
    console.log(`Welcome...${req.url}`);
});


//console.log(app.router.routes);

app.listen(3000);

