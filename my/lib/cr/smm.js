//http://www.239999.xyz/vodplay/33730-1-1/
import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const homeApi='https://ssm296r.top/';
const videoApi='/index.php/vod/type/id/{class}/page/{page}.html';
const detailUrl='/index.php/vod/play/id/{id}/sid/1/nid/1.html';
//const searchUrl= '/vodsearch/-------------.html?wd={wd}&submit=';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const toLive=true;
let myCache={};

function getJson(url){
	let txt=getHtml(url);
	try{
		if(typeof txt==="string")txt=JSON.parse(txt);
	}catch(e){
		J.smm={};
		eval("J.smm.tmpTxt="+txt);
		txt=J.smm.tmpTxt;
	}
	return txt;
}
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
	let lis=$("#content li");
	if(lis.length<1){
		lis=$(".appel-main li");
	}
	
	 lis.each((i, l) => {
		 try{
			let a=$($(l).find("a")[0]);
			let href=a.attr("href")||"";
			if(href.indexOf("index.php/vod/play")<0)return;
			let pic=a.attr("style");
			try{pic=pic.split("(")[1].split(")")[0]; }catch(e){}
			let txt=a.attr("title");
			let id=href.split("id/")[1].split("/")[0];
			let rmks = $($(l).find("td div"));
			let vodRmk="";
			if(rmks && rmks.length>0){
				 rmks.each((j, r) => {
				 vodRmk=vodRmk+$(r).text().trim()+",";
				 });
				 if(vodRmk.endsWith(","))vodRmk=vodRmk.substring(0,vodRmk.length-1);
			}
			let vod={
						vod_name: txt,
						vod_pic: pic||"",
						vod_remarks: vodRmk,
						vod_content: txt||'',
						vod_id: id,
						mcode:"smm",
						mtype:'SMM'
					};
			myCache[""+id]=vod;
			VODS.push(vod);
		}catch(e){
			console.error(e);
		}
		
	 });
	return VODS;
}
function initHost(){
	//http://143.92.57.90/semm.php
	let data=getJson("http://143.92.57.90/semm.php");
	if(data && data.url){
		homeApi=data.url;
	}
	J.toast(homeApi)
}
function init(ext){
	console.log("======init==ext222:"+ext);
	initHost();
}
function homeContent(filter){
	console.log("======homeContent======");
	 
	return {
		"class":[
			{type_id:99,type_name:"最新"},
			{type_id:7,type_name:"精品"},
			{type_id:9,type_name:"无码"},
			{type_id:10,type_name:"欧美"},
			{type_id:12,type_name:"日本"},
			{type_id:6,type_name:"中字"},
			{type_id:8,type_name:"自拍"},
			{type_id:11,type_name:"主播"},
			{type_id:20,type_name:"动漫"}
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

export default {DEBUG,init,homeContent,categoryContent,detailContent}