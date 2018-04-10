let rocket = require('../lib/rocket');

let app = rocket();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    console.log(`Fetching...${req.url}`);
    res.render('index', {title: 'Our own MVC Framework'});
});

app.get('/users', (req, res) => {
    res.json([
        {"user_id": "1", "hobbies":["drawing","coding"]},
        {"user_id": "2", "hobbies":["cooking","drawing"]},
    ]);
});

app.get('/aboutus', (req, res) => {
    console.log(`Fetching...${req.url}`);
    res.render('aboutus', {text: 'An agile startup'});
});

app.get('/greeting/:message', (req, res) => {
    console.log(`Welcome...${req.url} -> ${req.message}`);
});

app.get('/send/:message/:to', (req, res) => {
    console.log(`Welcome...${req.url} -> ${req.message} -> -> ${req.bye}`);
});



//console.log(app.router.routes);

app.listen(3000);

