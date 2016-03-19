var Utils=function(){

}
Utils.prototype.ifLogin=function(index,array){
	if(index in array)
		return true;
	else
		return false;
}
var util=new Utils();
module.exports=util;
