var mongoconf=require('./mongoconf');
			

var DbConnect=function(){

}
DbConnect.connect=function(callback){
	if(mongoconf.ISLOCAL){
		var mongodb = require('mongodb');
		var mongodbServer = new mongodb.Server('localhost', 27017, { auto_reconnect: true, poolSize: 10 });
		var db = new mongodb.Db('mydb', mongodbServer);		
		var DBUtil=require('./mess_util');	
		db.open(function() {
   			callback(db);
		});

	}else{
		var Db = require('mongodb').Db;
		var Server = require('mongodb').Server;
		var http = require('http'); 
		/*数据库连接信息host,port,user,pwd*/
		var db_name = mongoconf.MONGONAME; //数据库名称
		var db_host = mongoconf.MONGOHOST; //数据库地址
		var db_port = mongoconf.MONGOPORT; // 数据库端口
		var username =mongoconf.USERAK; //用户AK
		var password = mongoconf.USERSK; //用户SK
		var db = new Db(db_name, new Server(db_host, db_port, {}), {
 		   w: 1
		});

		//启动时建立连接
		db.open(function(err, db) {
  			db.authenticate(username, password, function(err, result) {
      			if (err) {
               		db.close();
           			res.end('Authenticate failed!');
            		return;
        		}
       			console.log("open db");
       			callback(db);
   			});
		});

	}
}
module.exports=DbConnect;