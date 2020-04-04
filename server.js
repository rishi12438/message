var express = require('express');
var bodyParser = require('body-parser');
var Pusher = require('pusher');
var sqlite3 = require('sqlite3').verbose();

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var pusher = new Pusher({ appId: '973191', key: 'd5be97218238cb28d452', secret:  "b532db701bb05c7c0d36", cluster:  "ap1" });

let db = new sqlite3.Database('test.db', (err) => {
       if (err) {
                 console.error(err.message);
       }
       else{ 

       console.log('Connected to the chinook database.');
       } 
      });

app.post('/pusher/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

app.post('/get_messages',function(req,res){ 
   
  sql = `SELECT  message_id,
		  sender_id,
                  text
           FROM messages
           WHERE reciever_id = ? AND reply = 0`;
let playlistId = 1;
 
// first row only
  db.all(sql, [req.body.user_id], (err, rows) => {
     if (err) {
       return console.error(err.message);
     }
     rows.forEach(row=>console.log(`${ row.message_id} is a ${row.sender_id}`)); 
     console.log("ejje",JSON.stringify(rows));
     res.json(JSON.stringify(rows));
  });
});
app.post('/message', function(req, res) {
  
  var message = req.body.message;
  var name = req.body.name;
  var sender_id = req.body.sender_id;
  var reciever_id = req.body.reciever_id; 
  var ts = Math.round((new Date()).getTime() / 1000);
  db.run(`INSERT INTO messages (reciever_id,sender_id,text,reply,recieved_on) VALUES(?,?,?,?,?)`, [reciever_id,sender_id,message,0,ts], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid`);
  });
 
  // close the database connection
  console.log("hello",req.body);
  pusher.trigger( 'private-chat', 'message-added', { message, name , sender_id,reciever_id});
  res.sendStatus(200);
});

app.post('/reply_ans',function(req,res){ 

  var message = req.body.message;
  var message_id = req.body.message_id; 
  var sender_id = req.body.sender_id;
  var reciever_id = -1;
  var ts = Math.round((new Date()).getTime() / 1000);
  db.run(`UPDATE messages SET reply = 1, reply_text = ?, reply_id = ?, recieved_on = ? WHERE message_id = ?`, [message,sender_id,ts,message_id], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been updated with rowid`);
  });

  // close the database connection
  console.log("hello",req.body);
  pusher.trigger( 'private-chat', 'message-added', { message, sender_id,reciever_id});
  res.sendStatus(200);



}); 

app.get('/',function(req,res){
     res.sendFile('/public/index.html', {root: __dirname });
});
app.get('/question_ans/:user_id',function(req,res){ 
     res.redirect('/answer_system.html?user_id='+req.params.user_id);
});
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`app listening on port ${port}!`)
});
