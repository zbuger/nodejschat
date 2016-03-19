var MONGOCON=function(){
	this.MONGONAME = 'zJRAwSffaYFdcRCJpDhm'; //数据库名称
	this.MONGOHOST = 'mongo.duapp.com'; //数据库地址
	this.MONGOPORT = '8908'; // 数据库端口
	this.USERAK = 'Skm1gSaDLvjHsexECxI1TgqB'; //用户AK
	this.USERSK = '1A8n5MPad4M20OGhllwZdVArjBgQwznB'; //用户SK
	this.ISLOCAL=true;
}

var mongoconf = new MONGOCON();
module.exports = mongoconf;