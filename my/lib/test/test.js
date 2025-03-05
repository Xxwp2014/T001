import getNewUrl from"../cr/public.js";
const DEBUG=true;
function init(ext){
	console.log("=hhhhhhhhhhhhh=====init==ext222:"+ext);
	//initHosts();
}
function homeContent(filter){
	console.log("hhhhhhhhhhhhhhhh==222==========");
	
	//return  request("http://192.168.2.9:8848/TVbox/my/lib/cr/hc.js");
   let nUrl = "";
   nUrl=getNewUrl("https://n9sd04mx.xyz/?key=ok")
	console.log('hhhhhhhhh=====',nUrl);
}

export default {DEBUG,init,homeContent}