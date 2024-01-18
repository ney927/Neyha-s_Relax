
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose(); //verbose provides more detailed stack trace
var db = new sqlite3.Database('data/db_relax');
db.serialize(function(){
    //create tables (Student, Takes, Course)
    db.run('CREATE TABLE IF NOT EXISTS Student (sid INTEGER PRIMARY KEY, name TEXT, email TEXT);')
    db.run('CREATE TABLE IF NOT EXISTS Course (cid INTEGER PRIMARY KEY, title INTEGER, hours INTEGER);')
    db.run('CREATE TABLE IF NOT EXISTS Takes (sid INTEGER, cid INTEGER, mark INTEGER, unique (sid, cid, mark));')

    db.run("INSERT or REPLACE INTO Student VALUES (1, 'Neyha', 'neyha@carleton.ca'), (2, 'Alia', 'alia@carleton.ca'), (3, 'Shiza', 'shiza@carleton.ca');")
    db.run("INSERT or REPLACE INTO Course VALUES (1, 'Programming', 0.5), (2, 'Sociology', 0.5), (3, 'Physics', 0.5), (4, 'Calculus', 0.5), (5, 'DBMS', 0.5);") 
    db.run("INSERT or REPLACE INTO Takes VALUES (1, 1, 10), (1, 2, 8), (1, 5, 7), (2, 3, 9), (2, 4, 7), (3, 3, 9), (3, 4, 5);")

});

const PORT = process.env.PORT || 3000
var app = express(); //create express middleware dispatcher


//middleware
app.use(express.static(__dirname + '/public')) //provide static server
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes
app.get("/",  function (req, res){
    res.sendFile(path.join(process.cwd() + '/views/home.html'));
})

app.post("/createRelation", function(req, res){
    console.log("creating relation", req.body)
    // var createRelation = `CREATE TABLE IF NOT EXISTS ${req.body.title} (;`
    // for (let i =0; i<req.body.cols; i++){
    //     createRelation += String.fromCharCode(1+64) + "NUMBER"
    // }
    // let response = db.run(createRelation)
    // console.log(response)
})

app.get("/relations", function(req, res){
    console.log("getting relations")
    let relations = {
        Student: [],
        Course: [],
        Takes: []
    };
    db.all("SELECT * from Student", function(err, srows) {
        db.all("SELECT * from Course", function(err, crows){
            db.all("SELECT * from Takes", function(err, trows){
                res.json({ Student: srows, Course: crows, Takes: trows });
                res.end();
            })
        })
    })
})

//handle non-existing requests
app.use((req,res)=>{
    res.status(404).send('404: Page Not Found')
})

//start server
app.listen(PORT, err => {
    if(err) console.log(err)
    else {console.log(`Server listening on port: ${PORT}`)}
})
