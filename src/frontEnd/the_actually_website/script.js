// insert into table --  function
function insert() {
    var http = new XMLHttpRequest();
    var insert_url = '/postRoom';
    var params = 'name=' + document.getElementById('room_name').value +
            '&desc=' + document.getElementById('room_desc').value + 
            '&address=' + document.getElementsById('room_address').value +;
    http.open('POST', insert_url, true);
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    http.send(params);
}
