let rocket = require('../lib/rocket');
let logger = require("morgan");
let serveStatic = require('serve-static');

let app = rocket();

let data=[
    {id: "1", item:'get milk'},
    {id: "2",item:'walk'},
    {id: "3",item:'get some food'}
];


//set up templete engine
app.set('views', __dirname + '/views');
app.set('view engine','ejs');

//static file
app.use(serveStatic(__dirname + '/public'));

app.get('/',function(req, res){
    res.render('todo',{todos: data });
 });
 
 app.post('/todo',function(req, res){
    data.push(req.body);
    res.json(data);
});

app.delete('/todo/delete/:id',function(req, res){
    console.log(`Deleting record with id ${req.params.id}`);
    data = data.filter(function(todo){
        return todo.id !== req.params.id;
    });
    res.json(data);
}); 

app.get('/getTodo/:id',function(req, res){
    // res.render('todo',{todoItem: data });
    objIndex = data.findIndex((obj => obj.id == req.params.id));
    
    res.json(data[objIndex].item);
  });
 
  app.post('/editTodo',function(req, res){
    objIndex = data.findIndex((obj => obj.id == req.body.id));
    data[objIndex].item =  req.body.item;
    res.json(data);
});
 
//listen to port
app.listen(4000)
.then(()=> {
    console.log("Server running huhu!!!");
});