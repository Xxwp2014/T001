import cheerio from"assets://js/lib/cheerio.min.js";
let hosts=['https://5xt5q7.lol','https://csmxsy.mom'];
const tabsApi='/292.bundle.js';
const home2Api='/api/audiopage?page={page}';
const detailUrl='/api/audio?id={id}';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const proxys=[
//"https://api.codetabs.com/v1/proxy/?quest=",
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
		 if(lastHost.length>3) res= proxyReq(lastHost+url);
		if(res && res.trim().length>1)return res;
		for(var i=0;i<hosts.length;i++){
			lastHost=hosts[i];
			res= proxyReq(hosts[i]+url);
			if(res && res.trim().length>1)return res;
		}
		return "";
	}else{
		return proxyReq(url);
	}
}
function proxyReq(url){
	let res= J.get(proxys[0]+url);
	if(!res || res.length<3 || res.indexOf("404 Not Found")>0)return "";
	return res;
	// let resObj=req(lastProxy+url);
	// let res=resObj.content;
	// J.toast("=====url:"+lastProxy+url+",res:"+res)
	// if(res && res.trim().length>1)return res;
	// for(var i=0;i<proxys.length;i++){
	// 	let proxy=proxys[i];
	// 	resObj=req(lastProxy+url);
	// 	res=resObj.content;
	// 	J.toast("=====url:"+proxy+url+",res:"+res)
	// 	if(res && res.trim().length>1){
	// 		lastProxy=proxy;
	// 		return res;
	// 	}
	// }
	//return "";
}

function initHosts(){
	let a=request("https://8x8x.com/");
	console.log("====initHosts:1111",a);
	let $=cheerio.load(a);
	console.log("====initHosts:22222");
	 $('a').each((i, l) => {
		const text = $(l).text(); // 获取当前a标签的文本内容
		const href=$(l).attr('href');
		
		console.log("====",i,text,href);
		console.log("====",href,hosts);
		if(text.indexOf("8X8X")>0 && hosts.indexOf(href)<0){
			hosts.push(href);
		}
	  
	});
	
	console.log("====",hosts)
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
						md5:id
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
	}
	return myTabs;
}
function init(ext){
	console.log("====init==ext222:"+ext);
	initHosts();
}
function homeContent(filter){
	console.log("========homeContent======");
	return {
		"class":[
			{type_id:1,type_name:"TT"},
			{type_id:2,type_name:"8X1"},
			{type_id:3,type_name:"8X2"}
		]
	};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg);
	let json="";
	let VODS=[];
	if(tid==1){
			 
	}else if(tid==2){
		apiUrl=home2Api.replaceAll("{page}",pg);
	}else if(tid==3){
		//apiUrl=randApi+"?t="+pg;
	}
	json=request(apiUrl);
	if(typeof json=="string")json=JSON.parse(json);
	if(json && json.data ){
		VODS=dataToVods(json.data);
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
			if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+VOD.md5+"/index.m3u8";
			else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+VOD.md5+"/index.m3u8";
		}
		
	}
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
 function playerContent(flag,id,vipFlags){
 	console.log("====player==flag:"+flag+"|id:"+id+"|vipFlags:"+JSON.stringify(vipFlags));
	return {
                parse:1,
                jx:0,
                url:id
            }
 }
 function isVideoFormat(url){
 	console.log("=====isVideoFormat==url:"+url);
	return true;
 }
 
 function manualVideoCheck(){
 	console.log("====manualVideoCheck==");
	return true;
 }
function dealJson(html) {
    try {
        html = html.trim();
        if(!((html.startsWith('{') && html.endsWith('}'))
		||(html.startsWith('[') && html.endsWith(']')))){
            html = '{'+html.match(/.*?\{(.*)\}/m)[1]+'}';
        }
    } catch (e) {
    }
    try {
        html = JSON.parse(html);
    }catch (e) {}
    return html;
} 

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent,playerContent,isVideoFormat,manualVideoCheck}