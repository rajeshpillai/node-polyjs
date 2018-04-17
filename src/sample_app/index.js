let rocket = require('../lib/rocket');
let logger = require("morgan");
let serveStatic = require('serve-static');

let app = rocket();

let users = [
    {"user_id": "1", "hobbies":["drawing","coding"]},
    {"user_id": "2", "hobbies":["cooking","drawing"]},
];

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


function one(req, res, next) {
    //console.log("Middleware 1");
    next();
}

function two(req, res, next) {
    //console.log("Middleware 2");
    next();
}

//app.use(logger());

app.use(one).use(two);

app.use(serveStatic(__dirname + '/public'));


app.get('/', (req, res) => {
    console.log(`Fetching...${req.url}`);
    res.render('index', {title: 'Our own MVC Framework'});
});

app.get('/users/register', (req, res) => {
    res.render('users/register');
});

app.get('/users/show/:id/modal', (req, res) => {
    let id = req.params.id;
    console.log(`User/Show/Modal with id->${id}`);
    let user = users.find(u => u.user_id == id);
    res.status(200).json(user);
});

app.get('/users', (req, res) => {
    res.status(200).json(users);
});


app.get('/users/show/:id', (req, res) => {
    let id = req.params.id;
    console.log(`User/Show with id->${id}`);
    let user = users.find(u => u.user_id == id);
    res.status(200).json(user);
});

app.get('/:id/users/show/', (req, res) => {
    let id = req.params.id;
    console.log(`id/User/Show with id->${id}`);
    let user = users.find(u => u.user_id == id);
    res.status(200).json(user);
});

app.get('/users/show/:id/edit', (req, res) => {
    let id = req.params.id;
    console.log(`User/Show/Edit with id->${id}`);
    let user = users.find(u => u.user_id == id);

    res.status(200).json(user);
});

app.get('/users/show/:id/edit/:account', (req, res) => {
    let id = req.params.id;
    let account = req.params.account;
    console.log(`User/Show/Edit/account with id->${id}->${account}`);
    let user = users.find(u => u.user_id == id);

    res.status(200).json(user);
});


/*
app.get('/aboutus', (req, res) => {
    console.log(`Fetching...${req.url}`);
    res.render('aboutus', {text: 'An agile startup'});
});

app.get('/greeting/:message', (req, res) => {
    res.send(`Welcome...-> ${req.params.message} ->${req.qs}`);
});

app.get('/send/:message/:to', (req, res) => {
    res.send(`Welcome...${req.url} -> ${req.params.message} -> -> ${req.params} ->${req.qs.name}`);
});
*/


//console.log(app.router.routes);

app.listen(3000)
    .then(()=> {
        console.log("Server running huhu!!!");
    });

