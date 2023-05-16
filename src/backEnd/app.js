// load packages
const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const { disabled } = require('express/lib/application');

app.use(express.json());

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
        console.log('database connection successful');
    else
        console.log('database connection failed \n Error: '+ JSON.stringify(err,undefined,2));
});

// var for which room is selected
var selectedRoom = 0;

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


//add room from provider
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
    
    // if not get the inputs
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
    var manager = req.body.room_manager;
    var manager_email = req.body.manager_email;
    var manager_phone = req.body.manager_phone;

    // wrap the data in a JSON structure
    var post = {
        name: name,
        manager:manager,
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
        laundry:laundry,
        manager_email:manager_email,
        manager_phone:manager_phone
    };
    // console.log(post);

    
    // insert the data set from frontend to DB
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
    // sort by ascending price order
    if (mode=='ap'){sql = "SELECT * FROM roominfo ORDER BY price ASC"};
    // sort by descending price order
    if (mode=='dp'){sql = "SELECT * FROM roominfo ORDER BY price DESC"};
    // sort by ascending star order
    if (mode=='ar'){sql = "SELECT * FROM roominfo ORDER BY star ASC"};  
    // sort by descending star order
    if (mode=='dr'){sql = "SELECT * FROM roominfo ORDER BY star DESC"}; 

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


// delete rooms
app.post('/delRoom', function(req,res){
    var room_name = req.body.room_name;
    var room_manager = req.body.room_manager;
    let sql = 'SELECT manager FROM roominfo WHERE name=?';

    // console.log(room_name);
    // console.log(room_manager);

    mysqlConnection.query(sql, room_name, (err, result) => {
        if(err) throw err;
        else if (room_manager == result[0].manager) {
            let sql1 = 'DELETE FROM roominfo WHERE name=?';
            mysqlConnection.query(sql1, [room_name], (err, result) => {
                if(err) throw err;
                // console.log(result);
                res.send("all done.");
            });
            // res.send("all done.")
        }
        else res.send("The room name and room manager do not match.")
        // console.log(sql);
        // console.log(result[0].manager);
    });
})


// get all rooms as a list
app.post('/getRooms',function(req,res){
    var manager=req.body.manager_name;
    let sql = 'SELECT * FROM roominfo WHERE manager=?';
    mysqlConnection.query(sql,manager, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
})
/**
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
});**/

// add comments and rating
app.post('/postComment',(req,res) =>{
    var room_id = selectedRoom;
    if (room_id == 0){
        res.send("no room")
    } else {
        var comment = req.body.comment;
        var rate = req.body.rate;
        var post = {room_id: room_id, comment: comment, rate: rate};
        console.log(post);


        mysqlConnection.query('INSERT INTO comments (room_id,comment,rating) VALUES (?,?,?)',[room_id,comment,rate], (err, result) => {
            if(err) throw err;
            console.log(result);
            console.log('added');
        });
        res.send("all done");
    }  
});


// get comments and ratings for a room
app.get('/getComments',function(req,res){
    var room_id = selectedRoom;

    mysqlConnection.query('SELECT * FROM comments WHERE room_id=?',room_id, (err, result) => {
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

// route for getting the room id of selected room
app.post('/selectRoom', (req, res) => {
    //console.log(req.body);
    selectedRoom = req.body.selectedRoom;
    res.send("room "+selectedRoom+" is selected!");
});


var port = 3000;
app.listen(3000,()=>console.log('Express server running at port '+ port +""));
