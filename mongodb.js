/*-------server.js---------*/
var Db = require('mongodb').Db;
var mongoconf=require('./mongoconf');
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
    });
});

var port = 18080;

//每次来请求时复用已有连接执行query，如果连接已被server端断开底层驱动会自动重连
http.createServer(function(request, res) { 
    db.collection("test_insert", test);//这是一个回调
}).listen(port);
function test(err, collection) {
        collection.insert({
            a: 1
        }, function(err, docs) {
            if (err) {
                console.log(err);
                res.end('insert error');
                return;
            }
            collection.count(function(err, count) {
                if (err) {
                    console.log(err);
                    res.end('count error');
                    return;
                }
                res.end('count: ' + count + '\n');
            });
        });
    }