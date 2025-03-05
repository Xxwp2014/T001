import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
let hosts=[];//'https://2g2wrc.mom/','https://cmaf6d.mom'
const tabsApi='/292.bundle.js';
const homeApi='/home';
const randApi='/rdlist';
const videoApi='/list_h/{class}/{page}';
const audioApi='/api/audiopage?page={page}';
const detailUrl='/detail/{id}';
const detailAudioUrl='/api/audio?id={id}';
const searchUrl= '/api/searchs?key={wd}&page={page}';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const toLive=true;
const proxys=[
"https://api.codetabs.com/v1/proxy/?quest=",
"https://api.allorigins.win/raw?url=",
"https://corsproxy.bunkum.us/corsproxy/?apiurl=",
"https://api.cors.lol/?url=",
"https://thingproxy.freeboard.io/fetch/"
];
let myTabs=[];
let lastHost="";
let lastProxy="";
let myCache={};
request=function(url){
	if(!url.toLowerCase().startsWith("http")){
		let res ="";
		 if(lastHost.length>3) res= P.proxyReq(lastHost+url);
		if(res && res.trim().length>1)return res;
		for(var i=0;i<hosts.length;i++){
			lastHost=hosts[i];
			res= P.proxyReq(hosts[i]+url);
			if(res && res.trim().length>1)return res;
		}
		return "";
	}else{
		return P.proxyReq(url);
	}
}

function initHosts(){
	let a=request("https://8x8x.com/");
	let $=cheerio.load(a);
	 $('a').each((i, l) => {
		const text = $(l).text(); // 获取当前a标签的文本内容
		const href=$(l).attr('href');
		if(text.indexOf("8X8X")>0 && hosts.indexOf(href)<0){
			hosts.push(href);
		}
	  
	});
	J.toast("hosts load success:"+JSON.stringify(hosts));
}

function dataToVods(data){
		let _VODS=[];
		for(var i=0;i<data.length;i++){
			let obj=data[i];
			 let remark=obj.title.split("-");
			 remark=remark[remark.length-1]+"|"+(obj.typename||'');
			 let img=obj.litpic;
			 if(!img.toLowerCase().startsWith("http")){
				 img="https://v1imvvfc356.salantool.com/p2/"+img+".webp"
			 }
			 let id=img.split("/");
			 id=id[id.length-1].split(".")[0];
			let vod={
						vod_name: obj.title,
						vod_pic: img,
						vod_remarks: remark,//标签
						vod_content: obj.title||'',
						vod_id: obj.id,
						md5:id,
						mcode:"8X01",
						mtype:'8X01'
					};
			myCache[obj.id]=vod;
			_VODS.push(vod);
		}
		return _VODS;
}

function getMyTabs(){
	if(!myTabs || myTabs.length<1){
		myTabs.push({text:"线路1",url:"https://fazjxevg.xyz:32768/v/"});
		myTabs.push({text:"线路2",url:"https://vtkknpbd.xyz:32768/v/"});
		myTabs.push({text:"3线路",url:"https://9cb9dr.mom:10443/v/"});
	}
	return myTabs;
}
function getRealUrl(url){
	return url;
	let m3u8Txt=J.get(url);
	let arr=m3u8Txt.split("\n");
	for(var i=arr.length-1;i>=0;i--){
		if(arr[i] && arr[i].endsWith(".m3u8")){
			return url.replaceAll("index.m3u8",arr[i]);
		}
	}
	return url;
}
function init(ext){
	console.log("====init==ext222:"+ext);
	initHosts();
}
function homeContent(filter){
	console.log("========homeContent======");
	return {
		"class":[
			{type_id:7,type_name:"最新"},
			{type_id:6,type_name:"随机"},
			{type_id:"日韩",type_name:"日韩"},
			{type_id:"大陆",type_name:"大陆"},
			{type_id:"欧美",type_name:"欧美"},
			{type_id:"动漫",type_name:"动漫"},
			{type_id:"三级",type_name:"剧情"}
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
				console.log("====",json);
				if(typeof json=="string")json=JSON.parse(json);
				for(var i=0;i< json.data.length;i++){
					let tmpData=json.data[i];
					console.log("=====tmpData",JSON.stringify(tmpData));
					let item = tmpData["result"+(i+1)];
					console.log("=====item",JSON.stringify(item));
					VODS=VODS.concat( dataToVods(item));
				}
			}
	}else{
		let apiUrl=videoApi.replaceAll("{class}",tid).replaceAll("{page}",pg);
		if(tid==5){
			apiUrl=audioApi.replaceAll("{page}",pg);
		}else if(tid==6){
			apiUrl=randApi+"?t="+pg;
		}
		json=request(apiUrl);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data ){
			VODS=dataToVods(json.data);
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
	//https://5xt5q7.lol/detail/106062

	let oid=ids[0]+"";
	// let apiUrl=detailUrl.replaceAll("{id}",oid);
	// if(oid.length<10){
	// 	apiUrl=detailAudioUrl.replaceAll("{id}",oid);
	// }
	// let json=request(apiUrl);
	
	// if(typeof json=="string")json=JSON.parse(json);
	
	let VOD=myCache[oid];
	console.log("====",VOD);
	let tbs=getMyTabs();
			
	console.log("====myTabs===",JSON.stringify(tbs),"===VOD===",JSON.stringify(VOD));
	for(var i=0;i<tbs.length;i++){
		if(i==0)VOD.vod_play_from=tbs[i].text;
		else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
		
		if(VOD.md5 && VOD.md5.length<10){
			if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.md5+".mp3";
			else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.md5+".mp3";
		}else{
			let realUrl=getRealUrl(tbs[i].url+VOD.md5+"/index.m3u8");
			if(i==0)VOD.vod_play_url=VOD.vod_name + '$' +realUrl ;
			else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + realUrl;
		}
		VOD.vod_content= VOD.vod_play_url;
		
	}
	P.toLive(VOD);
	return {
	    list: [VOD]
	};
}
 function searchContent(key,isquick){
 	console.log("====search==8x01==key:"+key+"|isquick:"+isquick);
	let wd=key;
	let VODS=[];
	
	  for(var i=1;i<=5;i++){
	 	let json = request(searchUrl.replaceAll("{wd}",wd).replaceAll("{page}",i));
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data ){
			let arr=dataToVods(json.data);
			if(arr)VODS=VODS.concat(arr);
			if(json.data.length<10)break;
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
 

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent}