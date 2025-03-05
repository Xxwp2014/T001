//https://avone.me/api/v1/search/videos?start=0&count=100&categoryOneOf=20&sort=-match&searchTarget=local
//https://avone.me/api/v1/overviews/videos?page=1
//
//https://avone.me/api/v1/search/videos?start=0&count=10&search=M&sort=-match&searchTarget=local
// https://avone.me/api/v1/videos/categories //{"20":"日韓線上","21":"亞洲線上","22":"自拍線上","23":"歐美線上","24":"動漫線上"}
import  P  from"public.js"; 
const host="https://avone.me/api/v1";
const videoApi='/search/videos?start={start}&count={limit}&categoryOneOf={class}&sort=-match&searchTarget=local';
const searchApi='/search/videos?start=0&count=100&search={wd}&sort=-match&searchTarget=local';
const classApi="/videos/categories";
const detailApi="/videos/";
const size=20;
let VODS_CACHE={};
let classes=[];
let mcode="avone"
request=function(url){
	if(!url.toLowerCase().startsWith("http")){
		return J.get(host+url);
	}else{
		return  J.get(url);
	}
}
function doVods(vods){
	let results=[];
	vods.data.forEach((item,i)=>{
		 let xvod={
					vod_name: item.name,
					vod_pic: "https://avone.me"+item.thumbnailPath,
					vod_remarks: (item.category && item.category["label"])||'',
					vod_content: item.truncatedDescription||item.description,
					vod_id: item.id,
					mcode:mcode,
					mtype:mcode.toUpperCase(),
					shortUUID:item.shortUUID
		 };
		 VODS_CACHE[item.id+""]=xvod;
		 results.push(xvod);
	});
	return results;
}
function getClassList(){
	let data=request(classApi);
	if(typeof data==="string")data=JSON.parse(data);
	let classList=[];
	for(var k in data){
		let c={};
		c.type_id=k;
		c.type_name=data[k];
		classList.push(c);
	}
	
	localStorage.setItem(mcode+".class",JSON.stringify(classList));
	localStorage.setItem(mcode+".class.last",new Date().getTime());
	return classList;
}
function init (ext){
	
	
}

function homeContent(filter){
	let classList=getClassList();
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
	let VODS=[];
	try{
		let vods=request(videoApi.replaceAll("{class}",tid).replaceAll("{start}",(pg-1)*size).replaceAll("{limit}",size));
		if(typeof vods==="string")vods=JSON.parse(vods);
		VODS= doVods(vods);
	}catch(e){
		J.toast(e.msg||e.message);
	}
	return {
	    'page': pg,
	    'pagecount': 999,
	    'limit': 10,
	    'total': 999999,
	    'list': VODS,
	}
}
function detailContent(ids){
	console.log("==detail==ids:"+JSON.stringify(ids));
	let id=ids[0];
	let vod=VODS_CACHE[id+""];
	let detail=request(detailApi+vod.shortUUID);
	if(typeof detail=="string")detail=JSON.parse(detail);
	//tags
	vod.vod_remarks=detail.tags.join(",");
	let m3u8Url=detail.streamingPlaylists[0].playlistUrl;
	vod.vod_play_url=detail.tags[0] + '$' + m3u8Url;
	
	vod.vod_play_from=m3u8Url.split("://")[1].split("/")[0].split(".")[1];
	setTimeout(function(){
		P.saveToDb(vod,true,2);
	},10);
	return {
	    list: [vod]
	};
}
function searchContent(key,isquick){
	console.log("====search==8x01==key:"+key+"|isquick:"+isquick); 
	let vods=request(searchApi.replaceAll("{wd}",key));
	if(typeof vods==="string")vods=JSON.parse(vods);
	let VODS= doVods(vods);
	
	return {
	    'page': 1,
	    'pagecount': 999,
	    'limit': 10,
	    'total': 999999,
	    'list': VODS,
	}
 }

export default {init,homeContent,categoryContent,detailContent,searchContent}