import  P  from"public.js";
let host='https://ncpjnjzd.xyz';
const bakhost='https://n9sd04mx.xyz'
//https://hc6ermpm.xyz/
const tabsApi='/292.bundle.js';
const homeApi='/api/home';
const videoApi='/api/videolist?ctg={class}&page={page}';
const audioApi='/api/audiopage?page={page}';
const detailUrl='/api/video?id={id}';
const detailAudioUrl='/api/audio?id={id}';
const searchUrl= '/api/search?v={wd}&page={page}&n=2';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const TOLIVE=true;
let myTabs=[];
request=function(url){
	if(!url.startsWith("http")){
		let a=req(host+url);
		if(!a.content ){
			a=req(bakhost+url);
		}
		return a.content
	}else{
		let a=req(url);
		return a.content
	}
	return "";
};
function initHost(){
	try{
	// let cacheHost=local.getItem("ttyy","last_host");
	// if(cacheHost && cacheHost.startsWith("http")){
	// 	host=cacheHost;
	// }
	let nUrl=P.getNewUrl(host+"?key=ok");
	if(nUrl==host){
		nUrl=P.getNewUrl(bakhost+"?key=ok");
	}
	host=nUrl;
	J.toast("host11:"+host);
	//local.setItem("ttyy","last_host",nUrl);
	}catch(e){
		J.toast("err:"+e.msg);
	}
}
function dataToVods(data){
		let _VODS=[];
		for(var i=0;i<data.length;i++){
			let obj=data[i];
			let title=obj.title;
			let rmk=obj.tags||obj.genres||"";
			if(title.indexOf("#")>0){
				if(!rmk)rmk=title.split("#")[1];
				title=title.split("#")[0];
			}
			let vod={   vod_name: title,
						vod_pic: "https://jt9ath.xyz:8443/"+(obj.md5||obj.overview)+".webp",
						vod_remarks:rmk||'',//标签
						vod_content: obj.tags||obj.genres||'',
						vod_id: obj.md5||obj.overview||obj.id,
						type: obj.typeId||'',
						mcode:"TTYY",
						mtype:'天天影院'
					};
			_VODS.push(vod);
		}
		return _VODS;
}
function getMyTabs(){
		if(!myTabs || myTabs.length<1){
			myTabs=[];
			let a=request(tabsApi);
			a=a.substring(0,a.indexOf("index.m3u8"))
			a=a.substring(a.length-200,a.length-1)
			a=a.substring(a.indexOf("["),a.indexOf("]")+1);
			let tbs= JSON.parse(a);
			let tbs2=[];
			for(var i=0;i<tbs.length;i++){
				if(tbs2.indexOf((tbs[i]))<0)tbs2.push(tbs[i]);
			}
			for(var i=0;i<tbs2.length;i++){
				myTabs.push({text:"线路"+(i+1),url:tbs2[i]});
			}
		}
		if(!myTabs || myTabs.length<1){
			myTabs.push({text:"线路1",url:"https://pr9ttkf2.xyz/"});
		}
		return myTabs;
		 
	};
function init(ext){
	console.log("====init==ext:"+ext);
	initHost();
}
function homeContent(filter){
	console.log("========homeContent======");
	return {
		"class":[
			{type_id:7,type_name:"最新"},
			{type_id:6,type_name:"随机"},
			{type_id:2,type_name:"日韩"},
			{type_id:1,type_name:"国产"},
			{type_id:3,type_name:"欧美"},
			{type_id:4,type_name:"动漫"},
			{type_id:5,type_name:"剧情"},
			{type_id:11,type_name:"音频"}
		]
	};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg);
	let json="";
	let VODS=[];
	if(tid==7){
			if(pg==1){
				json=request(homeApi);
				if(typeof json=="string")json=JSON.parse(json);
				for(let key in json.data){
					//J.toast("=====key"+key);
					let item = json.data[key];
					 VODS=VODS.concat( dataToVods(item));
				}
			}
	}else{
		let apiUrl=videoApi.replaceAll("{class}",tid).replaceAll("{page}",pg);
		if(tid==11){
			apiUrl=audioApi.replaceAll("{page}",pg);
		}else if(tid==6){
			apiUrl="/api/rdlist";
		}
		json=request(apiUrl);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.data){
			VODS=dataToVods(json.data.data);
		}
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
	let oid=ids[0]+"";
	
	let apiUrl=detailUrl.replaceAll("{id}",oid);
	if(oid.length<10){
		apiUrl=detailAudioUrl.replaceAll("{id}",oid);
	}
	let json=request(apiUrl);
	
	if(typeof json=="string")json=JSON.parse(json);
	let VOD={};
	if(json && json.data && json.data.data){
		VOD=dataToVods([json.data.data]); 
		if(VOD.length<1){
			VOD={};
		}else{
			VOD=VOD[0];
			let tbs=getMyTabs();
			console.log("====myTabs===",JSON.stringify(tbs),"===VOD===",JSON.stringify(VOD));
			for(var i=0;i<tbs.length;i++){
				if(i==0)VOD.vod_play_from=tbs[i].text;
				else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
				
				if(oid.length<10){
					if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.vod_id+".mp3";
					else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.vod_id+".mp3";
				}else{
					if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
					else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
				}
				
			}
		}
	}
	P.toLive(VOD);
	return {
	    list: [VOD]
	};
}
 function searchContent(key,isquick){
 	console.log("====search==TTYY==key:"+key+"|isquick:"+isquick);
	let wd=key;
	let VODS=[];
	
	for(var i=1;i<=5;i++){
		let json = request(searchUrl.replaceAll("{wd}",wd).replaceAll("{page}",i));
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.data){
			let arr=dataToVods(json.data.data);
			if(arr)VODS=VODS.concat(arr);
		}
	}
	return {
	    'page': 1,
	    'pagecount': 1,
	    'limit': VODS.length,
	    'total':VODS.length,
	    'list': VODS
	}
 }
 function playerContent(a,b,c){
	 console.log("====play==TTYY=",a,b,c);
	 return null;
 }

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent,playerContent}