const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const { disabled } = require('express/lib/application');

app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static('../frontEnd/the_actually_website'));
/*
app.get('/',function(req,res) {
    res.sendFile('../frontEnd/the_actually_website/landing-page.html');
});
 */


var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'cmpt370'
});


mysqlConnection.connect((err) => {
    if(!err)
        console.log('DB connection successful');
    else
        console.log('DB connection failed \n Error: '+ JSON.stringify(err,undefined,2));

});

app.post('/postRoom',function(req,res) {
    console.log(req.body);
    var name = req.body.room_name;
    var desc = req.body.room_desc;
    var address = req.body.room_address;
    var image = req.body.filename;
    var star = req.body.star;
    var price = req.body.room_price;
    var pet = req.body.pet;
    var disabledAccess = req.body.Disable;
    var wifi = req.body.Wifi;
    var pool = req.body.Pool;
    var spa = req.body.Spa;
    var parking = req.body.Parking;
    var gym = req.body.Gym;
    var ac = req.body.AC;
    var food = req.body.Food;
    var bar = req.body.Bar;
    var laundry = req.body.Laundry;
    // console.log(laundry == null)

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
    console.log(post);

    /*
    let sql = 'INSERT INTO roominfo SET ?';
    mysqlConnection.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('added');
    });
    */

    res.send("all done");
});


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


var port = 3000;
app.listen(3000,()=>console.log('Express server running at port '+ port +""));