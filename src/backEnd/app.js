const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const { disabled } = require('express/lib/application');

app.use(bodyparser.json());

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
    var name = req.body.name;
    var desc = req.body.desc;
    var address = req.body.address;
    var image = req.body.image;
    var star = req.body.star;
    var price = req.body.price;
    var pet = req.body.pet;
    var disabledAccess = req.body.disabledAccess;
    var wifi = req.body.wifi;
    var pool = req.body.pool;
    var spa = req.body.spa;
    var parking = req.body.parking;
    var gym = req.body.gym;
    var ac = req.body.ac;
    var food = req.body.food;
    var bar = req.body.bar;
    var laundry = req.body.laundry;

    var post = {name: name, desc: desc, address: address,image: image,star: star,price:price,
        pet:pet, disabledAccess:disabledAccess, wifi:wifi, pool:pool, spa:spa,parking:parking, gym:gym,
        ac:ac, food:food, bar:bar, laundry:laundry};
    console.log(post);

    let sql = 'INSERT INTO roominfo SET ?';
    mysqlConnection.query(sql, post, (err, result) => {
        if(err) throw err;
        console.log(result);
        console.log('added');
    });

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


var port = 3000;
app.listen(3000,()=>console.log('Express server running at port '+ port +""));