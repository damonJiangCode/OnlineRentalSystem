// load packages
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const { disabled } = require('express/lib/application');
const cors = require("cors");
const bcrypt = require("bcrypt");
const saltRounds = 10;
app.use(express.json());
app.use(cors());

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());

// load pages
app.use(express.static('../frontEnd/the_actually_website'));


// create the info of the connection 
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cmpt370'
});


// connect DB
mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB connection successful');
    else
        console.log('DB connection failed \n Error: '+ JSON.stringify(err,undefined,2));
});


// a function to check whether input (checkbox) is checked
function parserInt(input) {
    if (input == null) {
        return 0;
    }
    else {
        return 1;
    }
}


// a function to test whether the input is valid
function validInput(input) {
    if (input == null) {
        return 0;
    }
    else {
        return 1;
    }
}


// Add a room
app.post('/postRoom',function(req,res) {
    console.log(req.body);
    var name = req.body.room_name;
    nameIsValid = validInput(name)
    var desc = req.body.room_desc;
    descIsValid = validInput(desc)
    var address = req.body.room_address;
    adressIsValid = validInput(address)
    var image = req.body.filename;
    imageIsValid = validInput(image)
    var star = req.body.star;
    starIsValid = validInput(star)
    var price = req.body.room_price;
    priceIsValid = validInput(price)

    // check whether the inputs are valid
    if (nameIsValid == 0 || descIsValid == 0 || adressIsValid == 0 || imageIsValid == 0 || starIsValid == 0 || priceIsValid == 0) {
        console.log("Inputs should be valid!\n")
    }
    
    var pet = parserInt(req.body.pet);
    var disabledAccess = parserInt(req.body.Disable);
    var wifi = parserInt(req.body.Wifi);
    var pool = parserInt(req.body.Pool);
    var spa = parserInt(req.body.Spa);
    var parking = parserInt(req.body.Parking);
    var gym = parserInt(req.body.Gym);
    var ac = parserInt(req.body.AC);
    var food = parserInt(req.body.Food);
    var bar = parserInt(req.body.Bar);
    var laundry = parserInt(req.body.Laundry);

    var post = {
        name: name, 
        desc: desc, 
        address: address,
        image: image,
        star: star,
        price:price,
        pet:pet, 
        disabledAccess:disabledAccess, 
        wifi:wifi, 
        pool:pool, 
        spa:spa,
        parking:parking, 
        gym:gym,
        ac:ac, 
        food:food, 
        bar:bar, 
        laundry:laundry
    };
    // console.log(post);

    // insert the information from frontend to DB
    var response = new Object();
    let sql = 'INSERT INTO roominfo SET ?';
    mysqlConnection.query(sql, post, (err, result) => {
        if(err) throw err;
        // console.log(result);
        else {
            console.log('added!');
        }
        res.send(true);
    });
});


// sort and filter the posting rooms by the given order
app.post('/read', (req, res) => {
    var sql = "SELECT * FROM roominfo";
    var mode = req.body.mode;
    if (mode=='ap'){sql = "SELECT * FROM roominfo ORDER BY price ASC"}; // sort by ascending price order
    if (mode=='dp'){sql = "SELECT * FROM roominfo ORDER BY price DESC"};// sort by descending price order
    if (mode=='ar'){sql = "SELECT * FROM roominfo ORDER BY star ASC"};  // sort by ascending star order
    if (mode=='dr'){sql = "SELECT * FROM roominfo ORDER BY star DESC"}; // sort by descending star order

    //filtering
    if (mode=='pf'){sql = "SELECT * FROM cmpt370.roominfo WHERE pet = 1"};
    if (mode=='npf'){sql = "SELECT * FROM cmpt370.roominfo WHERE pet = 0"};
    if (mode=='5s'){sql = "SELECT * FROM cmpt370.roominfo WHERE star = 5"};
    if (mode=='4s'){sql = "SELECT * FROM cmpt370.roominfo WHERE star = 4"};
    if (mode=='3s'){sql = "SELECT * FROM cmpt370.roominfo WHERE star = 3"};
    if (mode=='2s'){sql = "SELECT * FROM cmpt370.roominfo WHERE star = 2"};
    if (mode=='1s'){sql = "SELECT * FROM cmpt370.roominfo WHERE star = 1"};


    mysqlConnection.query(sql, function (err, result){
            if (err) throw err;
            else {
                console.log(result);
                res.send(result);
            }
    });                   
});


// Delete rooms
app.post('/delRoom', function(req,res){
    var name = req.body.name;
    let sql = 'DELETE FROM roominfo WHERE name=?';

    console.log(name);

    mysqlConnection.query(sql,[name], (err, result) => {
        if(err) throw err;
        console.log(result);

    });

    res.send("all done");
})


// Get all rooms
app.get('/getRooms',function(req,res){
    let sql = 'SELECT * FROM roominfo';
    mysqlConnection.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);

        var response = '';
    
        for(let i = 0;i<result.length;i++){
            response += JSON.stringify(result[i])+',';
            
        }
        response.substring(0, response.length - 1);
        console.log(response);
        res.send(result);
    });
})

// create manager account
app.post('/createAccount',(req, res) => {

    var manager_name = req.body.manager_name;
    var manager_email = req.body.manager_email;
    var manager_phone = req.body.manager_phone;
    const manager_password = req.body.manager_password;

    bcrypt.hash(manager_password,saltRounds, (err, hash) => {

        if(err){
            console.log(err);
        }

        mysqlConnection.query("INSERT INTO managerinfo (manager_name, manager_email, manager_phone, manager_password ) VALUES (?,?,?,?)",
            [manager_name,manager_email,manager_phone, hash],(err, result) => {
            console.log(result);
        });
    })
    res.send(true);
});

// manager login
app.post('/login',(req, res) =>{

    const manager_name = req.body.manager_name;
    const manager_password = req.body.manager_password;

    mysqlConnection.query("SELECT * FROM managerinfo WHERE manager_name = ?",manager_name,(err, result) => {
        if(err){
            res.send({err: err});
        }

        if (result.length > 0){
            bcrypt.compare(manager_password, result[0].manager_password, (error , response) => {
                if (response){
                    res.send("logged in")
                    //res.send(result)
                } else {
                    //res.send("failed")
                    res.send({ message: "Wrong username/Password combination! Try again!"});
                }
            })
        } else {
            res.send({message: "User not found!"});
        }

    });
});

// add comments and rating
app.post('/addComment',(req,res) =>{
    var room_id = req.body.room_id;
    var comment = req.body.comment;
    var rating = req.body.rating;
    var post = {room_id: room_id, comment: comment, rating: rating};
    console.log(post);


    mysqlConnection.query('INSERT INTO comments (room_id,comment,rating) VALUES (?,?,?)',[room_id,comment,rating], (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('added');
    });
    res.send("all done");
});


// Get comments and ratings for a room
app.get('/getComments',function(req,res){
    var room_id = req.body.room_id;


    mysqlConnection.query('SELECT * FROM comments WHERE room_id = ?',room_id, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})

// add customers
app.post('/addCustomer',(req,res) =>{
    var customer_name = req.body.customer_name;
    var customer_email = req.body.customer_email;
    var customer_phone = req.body.customer_phone;
    var vegetarian = req.body.vegetarian;
    var vegan = req.body.vegan;
    var gluten = req.body.gluten;
    var deaf = req.body.deaf;
    var blind = req.body.blind;
    var wheelchair = req.body.wheelchair;

    var post = {customer_name: customer_name, customer_email: customer_email, customer_phone: customer_phone,
        vegetarian: vegetarian, vegan: vegan, gluten: gluten, deaf: deaf, blind: blind, wheelchair: wheelchair};
    console.log(post);


    mysqlConnection.query('INSERT INTO customerinfo (customer_name,customer_email,customer_phone,vegetarian,vegan,gluten,deaf,blind,wheelchair) VALUES (?,?,?,?,?,?,?,?,?)',
        [customer_name,customer_email,customer_phone,vegetarian,vegan,gluten,deaf,blind,wheelchair], (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('added');
    });
    res.send("all done");
});








var port = 3000;
app.listen(3000,()=>console.log('Express server running at port '+ port +""));
