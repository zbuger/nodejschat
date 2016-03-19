var MessUtil=function(mess,name,from){
	this.mess=mess;	
	this.from=from;
	this.name=name;
}

MessUtil.prototype.setMess=function(mess){
	this.mess=mess;
}
MessUtil.prototype.setFrom=function(from){
	this.from=from;
}
MessUtil.prototype.setName=function(name){
	this.name=name;
}

MessUtil.prototype.insert=function(db,collection){
	var data={name:this.name,unread:[{from:this.from,mess:[this.mess]}]};
	console.log(data);
	db.collection(collection,function(err, collection) {
        collection.insert(data, function(err, docs) {
            if (err) {
                console.log(err);
                return;
            }
        });
    });
}

MessUtil.prototype.update=function(db,collection){
    var name=this.name;
    var from=this.from;
    var mess=this.mess;
    var query={name:name,'unread.from':from};
    var queryGeneral={name:this.name};
    var data={unread:{from:from,mess:[mess]}};
    var queryGeneral2={name:name,'unread.from':from};
    var data2={'unread.$.mess':mess};

    db.collection(collection,function(err, collection) {
        collection.find(query).toArray(function(err, docs) {
            if (err) {
                console.log(err);
                return;
            }
            if(docs[0]==null){  //找不到这条消息
                collection.update(queryGeneral,{$push:data},{upsert:true},function(err, docs) {
                    if (err) {
                        console.log('err'+err);
                        return;
                        }
                });
            }else{
                collection.update(queryGeneral2,{$push:data2},function(err, docs) {
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }
        });
    });
}



MessUtil.prototype.getUnRead=function(db,collection,callback){
	var query={name:this.name};
	db.collection(collection,function(err, collection) {
        if(err){
            console.log(err);
            return;
        }
        collection.find(query).toArray(function(err,docs){
        	callback(docs);
            /////////////
            if(docs[0]!=null){
                collection.remove(query,function(error){
                    if (err) {
                        console.log(err);
                        return;
                    }
                });
            }
            /////////////
        });    
    });  
}

MessUtil.prototype.remove=function(db,collection){
    var query={name:this.name};
    db.collection(collection,function(err, collection) {
        collection.remove(query,function(error){
            if (err) {
                console.log(err);
                return;
            }
        });
    }); 
}
var mess_util=new MessUtil();
module.exports=MessUtil;