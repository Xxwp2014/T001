import  P  from"public.js"; 
let vodapi="";//"https://madoucun.com/api.php/provide/vod/";
let VODS_CACHE={};
let PROXY_PIC=false;//"https://corsproxy.bunkum.us/corsproxy/?apiurl=";//"https://api.allorigins.win/raw?url=";
let mcode="";
let to_db_type=0;//0 不保存 1 保存 
let defaultProxyIndex=0;
request=function(url){
  	let data=  P.proxyReq(url,{"proxyIndex":1,"headers":{'User-Agent':'MOBILE_UA'}});
	if(typeof data==="string")data=JSON.parse(data);
	return data;
}

function doVods(vods){
	// if(to_db_type==1){
	// 	let list=JSON.parse(JSON.stringify(vods.list));
	// 	setTimeout(function(){
	// 		try{
	// 			for(var i=0;i<list.length;i++){
	// 				let vod=list[i];
	// 				vod.mcode=mcode;
	// 				vod.mtype=mcode.toUpperCase();
	// 				P.saveToDb(vod);
	// 			}
	// 		}catch(e){
	// 			J.toast(e.msg||e.message)
	// 		}
	// 	},1); 
	// }
	vods.list.forEach((item,i)=>{
		if(item.vod_play_url && item.vod_play_url.length>0){
			item.vod_id=item.vod_id+"_"+mcode+"_mytag"
			item.vod_pic=PROXY_PIC?P.getImgProxyUrl(item.vod_pic):item.vod_pic;
			VODS_CACHE[item.vod_id]=item;
		}
	});
	return vods;
}
function init (ext){
	 let params=P.getQueryParams(ext);
	 vodapi=params["url"];
	 PROXY_PIC=params["imgproxy"]==1;
	 mcode=vodapi;
	 defaultProxyIndex=params["defaultProxyIndex"]||0;
	 if(mcode.indexOf("://")>0){
		 mcode=mcode.split("://")[1];
	 }
	 mcode=mcode.split("/")[0];
	 mcode=mcode.split(".");
	 if(mcode.length>1)mcode=mcode[mcode.length-2];
	 else mcode=mcode[0];
	 if(params["db"])to_db_type=params["db"];
	 P.initTables();
	 J.toast(mcode+"|"+to_db_type);
}

function getClassList(){
	let data=request(vodapi)
	let classList=data.class;
	localStorage.setItem(mcode+".class",JSON.stringify(classList));
	localStorage.setItem(mcode+".class.last",new Date().getTime());
	return classList;
}

function homeContent(filter){
	let classList=[];
	let classStr=localStorage.getItem(mcode+".class");
	if(classStr && classStr.length>3){
		classList=JSON.parse(classStr);
		 setTimeout(function(){
			 if(new Date().getTime()-localStorage.getItem(mcode+".class.last")>600000){
				 J.toast("init classes")
				getClassList();
			 }
		 },2);
	}else{
		classList=getClassList();
	}
	return{
		"class":classList
	};
}

function categoryContent(tid,pg,filter,extend){
	let result={};
	try{
		let vods=request(vodapi+"?ac=detail&t="+tid+"&pg="+pg);
		result= doVods(vods);
	}catch(e){
		J.toast(e.msg||e.message);
	}
	return result;
}
function detailContent(ids){
	console.log("==detail==ids:"+JSON.stringify(ids));
	let id=ids[0];
	let vod=VODS_CACHE[id+""];
	setTimeout(function(){
		vod.mcode=mcode;
		vod.mtype=mcode.toUpperCase();
		P.saveToDb(vod,true,2);
	},10);
	return {
	    list: [vod]
	};
}
function searchContent(key,isquick){
	console.log("====search==8x01==key:"+key+"|isquick:"+isquick); 
	let vods=request(vodapi+"?ac=detail&wd="+key);
	return doVods(vods);
 }

export default {init,homeContent,categoryContent,detailContent,searchContent}