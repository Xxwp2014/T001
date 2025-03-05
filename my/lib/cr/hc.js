//http://www.239999.xyz/vodplay/33730-1-1/
import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const homeApi='http://www.239999.xyz';
const videoApi='/vodtype/{class}-{page}.html';
const detailUrl='/vodplay/{id}-1-1.html';
const searchUrl= '/vodsearch/-------------.html?wd={wd}&submit=';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const toLive=true;
let myCache={};

function getHtml(url){
	if(!url.startsWith("http")){
		return P.proxyReq(homeApi+url);
	}else {
		return P.proxyReq(url);
	}
	
}

function htmlToVods(html){
	//stui-warp-content
	//stui-warp-content
	let $=cheerio.load(html);
	let VODS=[];
	let lis=$(".stui-warp-content li");
	if(lis.length<1){
		lis=$(".container li");
	}
	
	 lis.each((i, l) => {
		 try{
		let a=$($(l).find("a")[0]);
		let pic=a.attr("data-original");
		let href=a.attr("href")||"";
		if(href.indexOf("vodplay")<0)return ;
		let time=a.text().trim();
		let txt=$($(l).find("a")[1]).text();
		let id=href.split("-")[0].split("/");
		id=id[id.length-1];
		let vod={
					vod_name: txt,
					vod_pic: pic||"",
					vod_remarks: time||'',
					vod_content: txt||'',
					vod_id: id,
					mcode:"hc",
					mtype:'黄仓'
				};
		myCache[""+id]=vod;
		VODS.push(vod);
		}catch(e){
			console.error(e);
		}
		
	 });
	return VODS;
}
function init(ext){
	console.log("======init==ext222:"+ext);
}
function homeContent(filter){
	console.log("======homeContent======");
	 
	return {
		"class":[
			{type_id:99,type_name:"最新"},
			{type_id:1,type_name:"日韩"},
			{type_id:2,type_name:"大陆"},
			{type_id:3,type_name:"欧美"},
			{type_id:4,type_name:"动漫"},
			{type_id:8,type_name:"无码中字"},
			{type_id:9,type_name:"有码中字"},
			{type_id:10,type_name:"日本无码"},
			{type_id:7,type_name:"日本有码"},
			{type_id:15,type_name:"国产视频"},
			{type_id:21,type_name:"欧美高清"},
			{type_id:22,type_name:"动漫剧场"}
		]
	};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg);
	let html="";
	let VODS=[];
	if(tid==99){
			if(pg==1){
				html=getHtml(homeApi);
				VODS=htmlToVods(html);
			}
	}else{
		let apiUrl=videoApi.replaceAll("{class}",tid).replaceAll("{page}",pg);
		html=getHtml(apiUrl);
		VODS=htmlToVods(html);
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
	let VOD={};
	let oid=ids[0];
	try{
		VOD=myCache[""+oid];
		console.log("====",oid);
		VOD.vod_play_from="线路1";
		let html=getHtml(detailUrl.replaceAll("{id}",oid));
		console.log("====html:",html);
		html=html.split(".m3u8")[0];
		html=html.substring(html.lastIndexOf("http"))+".m3u8";
		
		VOD.vod_play_url=VOD.vod_name + '$' + html;
		P.toLive(VOD);
		console.log("====",JSON.stringify(VOD));
	}catch(e){
		console.error(e);
	}
	return {
	    list: [VOD]
	};
}
 function searchContent(key,isquick){
 	console.log("====search==8x01==key:"+key+"|isquick:"+isquick);
		let VODS=[];
	try{
		let wd=key;
		let html = getHtml(searchUrl.replaceAll("{wd}",wd));
		console.log(html);
		
		VODS=htmlToVods(html);
	}catch(e){
		console.error(e);
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