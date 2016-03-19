// Setup basic express server
var express = require('express');//需要加一个room
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = process.env.PORT || 18080;
var utils=require('./utils');
var FriendUtil=require('./db_util/friend_util');
var MsgUtil=require('./db_util/mess_util');
var DbConnect=require('./db_util/db_connect');
var db;
DbConnect.connect(true,function(db1){//连接数据库成功了
    db=db1;
});

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});


app.use(express.static(__dirname + '/public'));

// usernames which are currently connected to the chat
var usernames = {};//单线程都是共享的,阻止重复登陆
var userrooms = {};//这是用户的房间号
var roomusers = [];//每个房间的用户数
var numUsers = 0;
var userRoom=new Array();
userRoom.push('test');
userRoom.push('test1');
 
io.on('connection', function (socket) {//注册一个回调函数，客户端是先建立连接再注册用户的
  console.log('some one connect');
  var addedUser = false;
  
  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {//登陆成功了，建立了连接后的
    addedUser = true;
    // we store the username in the socket session for this client
    socket.username = username;
    usernames[username]=socket;//全局用户登陆的列表，防止重复登陆
    /*
    if(mongodb中有本用户未读信息){
      取出未读信息，通过socket.emit发送给自己
    }
    */
    showOnline();
    console.log('some one add:'+username);//
    //这里要检查数据库中是否有未读信息，然后传给client
    var msg_util=new MsgUtil();
    msg_util.setName(username);
    msg_util.getUnRead(db,"we_chat_messages",function(data){
      console.log(data);
      socket.emit('add success', {//这个应该是给用户自己的
      numUsers: 1
    });

    });
    
  });

  // when the client emits 'add user', this listens and executes
  socket.on('get friends', function (username) {//登陆成功了，建立了连接后的   
    var db_util=new FriendUtil();
    db_util.setName(username);
    db_util.getFriends(db,"we_chat_friends",function(friends){
      socket.emit('friend list', {//这个应该是给用户自己的
       friendList: friends
      });
      console.log(friends);
    });
    
  });

  

  socket.on('message to',function(data){//只是向某个人发送信息
    parse=JSON.parse(data);
    var from = socket.username;
    var to = parse.to;
    var message=parse.message;
    var type=parse.type;
    if(type=='message')
      type='message';
    else
      type='voice';

  //  console.log(parse);
    console.log('to:'+to);
    if(utils.ifLogin(to,usernames)){
      usernames[to].emit('message from',{
      from:from,
      message:message,
      type:type
      });  
    }else{     //判断如果用户在线就发送，如果不在线就存储进入mongodb
      console.log("未登录");

    }
    

  });/*
  socket.on('join room',function(roomid){
    console.log('join room id:'+roomid);  
    socket.join(roomid);//加入房间的代码单独拿出来
    socket.room=roomid;
    console.log('socket.room:'+roomid);
    socket.emit('join sucess', {//这个应该是给用户自己的
      numUsers: numUsers
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.to(roomid).emit('user joined', {//除了刚加的用户的所有人
      username: socket.username,
      numUsers: numUsers
    });
  
  });

  socket.on('leave room',function(roomid){
    socket.leave(roomid);//加入房间的代码单独拿出来
    socket.emit('leave success', {//这个应该是给用户自己的
      numUsers: numUsers
    });
    socket.broadcast.to(roomid).emit('user leave', {//这个还没做
      username: socket.username,
      numUsers: numUsers
    });
    console.log('leave:'+roomid);
  });
   // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    parse=JSON.parse(data);
    socket.broadcast.to(socket.room).emit('new message', {
      username: socket.username,
      message: parse.message,
      type:parse.type
    });
    console.log("data:"+data);
  });

  */
  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    
    if (addedUser) {
      console.log(socket.username+' disconnect');
      delete usernames[socket.username];
      --numUsers;
      showOnline();
      /*
      socket.broadcast.to('test').emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
*/
    }
  });
});
function showOnline(){
  for(var p in usernames){  
    console.log("现在在线:"+p);
  }
}