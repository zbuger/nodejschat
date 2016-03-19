var http = require('http'); 
var url=require('url');
var DBUtil=require('./db_util/mess_util');
var DbConnect=require('./db_util/db_connect');

var db;
DbConnect.connect(true,function(db1){
    db=db1;
});


var port = 18080;
var i=0;
//每次来请求时复用已有连接执行query，如果连接已被server端断开底层驱动会自动重连
http.createServer(function(req, res) {
    if(url.parse(req.url).path=='/favicon.ico')
        return;
   
    var db_util=new DBUtil();
    db_util.setName('zhaoguoqin'+1);
    db_util.setFrom('erdan5'+0);
    db_util.setMess('this is message '+5);
    db_util.insert(db,"test_insert1");//插入*/
 /*   DBUtil.getUnRead(db,"test_insert1",function(data){//查询
        //console.log(data);
        console.log(data);
   //     res.end(data);
    });
    */
 //   DBUtil.update(db,"test_insert1");
 //   DBUtil.remove(db,"test_insert1");
    i++;
   
    res.end("end");
}).listen(port);
console.log('listening on 18080');

