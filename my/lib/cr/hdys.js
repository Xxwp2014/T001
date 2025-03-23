import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const homeApi='https://hd.hdys2.com';
const videoApi='/vodshow/{class}--------{page}---.html';
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
//ascii to str
function a2s(str){
	str = str.replace(/(\\u)(\w{1,4})/gi, function($0) {
		return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{1,4})/g, "$2")), 16)));
	});
	str = str.replace(/(&#x)(\w{1,4});/gi, function($0) {
		return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{1,4})(%3B)/g, "$2"), 16));
	});
	str = str.replace(/(&#)(\d{1,6});/gi, function($0) {
		return String.fromCharCode(parseInt(escape($0).replace(/(%26%23)(\d{1,6})(%3B)/g, "$2")));
	});
	return str;
}
function htmlToVods(html){
	let $=cheerio.load(html);
	let VODS=[];
	let lis=$("ul.stui-vodlist li");
	if(lis.length<1){
		lis=$(".stui-vodlist__box");
	}
	 lis.each((i, l) => {
		 try{
			let a=$($(l).find("a")[0]);
			let img=$($(l).find("img")[0]);
			let pic=img.attr("data-original");
			if(pic.startsWith("&#"))pic=a2s(pic);
			let href=a.attr("href")||"";
			if(href.indexOf("voddetail")<0)return ; 
			let txt=a.attr("title");
			if(txt.startsWith("&#"))txt=a2s(txt);
			let id=href.substring(href.lastIndexOf("/")+1).split(".")[0];
			let tagb=$(l).find("span.pic-tag-b");
			if(tagb && tagb.length>0){
				tagb=$(tagb[0]).text();
				if(tagb.startsWith("&#"))tagb=a2s(tagb);
			}else{
				tagb="";
			}
			let tagt=$(l).find("span.pic-tag-t");
			if(tagt && tagt.length>0){
				tagt=$(tagt[0]).text();
				if(tagt.startsWith("&#"))tagt=a2s(tagt);
			}else{
				tagt="";
			}
			
			let vod={
					vod_name: txt,
					vod_pic: pic||"",
					vod_remarks: tagb+","+tagt,
					vod_content: txt||'',
					vod_id: id,
					mcode:"hdys",
					mtype:'HDYS'
					};
			myCache[""+id]=vod;
			VODS.push(vod);
		}catch(e){J.toast(e.msg||e.message);
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
			{type_id:1,type_name:"有码"},
			{type_id:2,type_name:"无码"},
			{type_id:3,type_name:"国产"},
			{type_id:4,type_name:"欧美"},
			{type_id:5,type_name:"动漫"}
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
 	console.log("====search==hdys==key:"+key+"|isquick:"+isquick);
	let VODS=[];
	try{
		let html = getHtml(searchUrl.replaceAll("{wd}",key));
		VODS=htmlToVods(html);
		VODS.forEach((item,i)=>{
				item.vod_name=item.vod_name+":"+key
		});
	}catch(e){
		console.error(e);
	}
	return {
	    'page': 1,
	    'pagecount': 999,
	    'limit': 10,
	    'total': 999999,
	    'list': VODS
	}
 }
 

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent}