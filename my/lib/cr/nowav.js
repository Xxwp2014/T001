import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const dataapi='https://video03.imghost.club/api/v1/videos/{uuid}';
let host="https://nowav.tv";
const DEBUG=true;
const toLive=true;
let cacheVods={};
let data="";
function getHtml(url){
	if(!url.toLowerCase().startsWith("http")){//
	 return P.proxyReq(host+url,true);
	}else{
		return P.proxyReq(url);
	}
}

function htmlToVods(html){
	let nVods=[];
	let $=cheerio.load(html);
	 $('a.td-image-wrap').each((i, l) => {
		 try{
			 let title=$(l).attr("title");
			 let href=$(l).attr("href");
			 if(href.endsWith("/"))href=href.substring(0,href.length-1);
			 href=href.split('/');
			 let id=href[href.length-1];
			 
			 let pic=$($(l).find("span")[0]).attr("data-bg");
			 
			 if(pic.indexOf("'")>0)pic=pic.split("'");
			 else if(pic.indexOf('"')>0)pic=pic.split('"');
			 else if(pic.indexOf("("))pic=pic.replace(")","").split('(');
			 
			 if(pic.length==3)pic=pic[1];
			 if(pic.indexOf("imghost.club")>0){
				 pic="https://avone.me"+(pic.split("imghost.club")[1]);
				 J.toast(pic)
			 }
			 
			 let xvod={
					vod_name: title,
					vod_pic: "https://api.codetabs.com/v1/proxy/?quest="+pic,
					vod_remarks: '',
					vod_content: title,
					vod_id: id,
					mcode:"nowav",
					mtype:'NOWAV',
					load:false
			 };
			 if(!cacheVods[id]){
				 nVods.push(xvod);
				 cacheVods[id]=xvod;
			 }
		 }catch(e){
			 J.toast(e.msg||e.message);
		 }
	});
	// setTimeout(function(){
	// 	nVods.forEach((v,i)=>{
	// 		v=getVodDetail(v);
	// 		J.toast(v.vod_play_url)
	// 		P.saveToDb(v);
	// 	});
		
	// },100);
	return nVods;
}

function getVodDetail(VOD){
	if(VOD.vod_play_url && VOD.vod_play_url.length>4)return VOD;
	 let tmpvod=P.findVod("nowav",VOD.vod_id);
	 if(tmpvod && tmpvod.vod_play_url){
		 VOD=tmpvod;
		 return VOD;
	 }
	if(VOD.load)return VOD;
	let detailUrl="";
	 try{
			let html= getHtml("/"+VOD.vod_id+'/'); 
			let $=cheerio.load(html);
			let ifs=$("iframe");
			for(let i=0;i<ifs.length;i++){
				let src=$(ifs[i]).attr("src");
				if(src.indexOf("imghost.club")>0){
					//https://video02.imghost.club/videos/embed/5c99b940-03ae-4108-b8ee-512fbb659e90?title=0&am
					src=src.split("?")[0];
					detailUrl=src.replace("videos/embed","api/v1/videos");
					break;
				}
			}
			if(!detailUrl || detailUrl.length<3){
				let vdo=$("source");
				for(let i=0;i<vdo.length;i++){
					try{
						let src=$(vdo[i]).attr("src");
						if(src.indexOf(".m3u8")>0){
							VOD.vod_play_url=VOD.vod_name + '$' + src;
							break;
						}
					}catch(e){
						J.toast(e.msg||e.message);
					}
				}
			}
		
		if((!VOD.vod_play_url || VOD.vod_play_url.length<4) && detailUrl.length>5){
			let dtItem=getHtml(detailUrl);
			if(typeof dtItem=="string")dtItem=JSON.parse(dtItem);
			if(dtItem.streamingPlaylists &&dtItem.streamingPlaylists.length>0){
				VOD.vod_play_url=VOD.vod_name + '$' + dtItem.streamingPlaylists[0].playlistUrl;
				VOD.vod_content=dtItem.truncatedDescription||dtItem.description||VOD.vod_content;
			}else{
				J.toast("==解析失败==");
			}
		}
	}catch(ex){
		J.toast(ex.msg||ex.message);
	}
	//VOD.load=true;
	if(VOD.vod_play_url && VOD.vod_play_url.length>2)VOD.vod_play_from="线路1";
	return VOD;
}
function findVodById(id){
	
	return cacheVods[id];
}
function init(ext){
	
}
function homeContent(filter){
	return {
		"class":[
			{type_id:"/category/va1-媒體庫編號",type_name:"HD"},
			{type_id:"/category/vl2-玩法",type_name:"玩法"},
			{type_id:"/category/vl6-女優屬性",type_name:"屬性"},
			{type_id:"/category/vb0-影片地區",type_name:"地區"},
			{type_id:"/category/vb2-影片類型",type_name:"類型"},
			{type_id:"/category/vb3-影片年份",type_name:"年份"},
			{type_id:"/category/vb0-影片地區/vb0a0-日本av",type_name:"日本"},
			{type_id:"category/vb0-影片地區/vb0a1-韓國av",type_name:"韓國"},
			{type_id:"/category/vb0-影片地區/vb0a2-台灣av",type_name:"台灣"},
			{type_id:"/category/vb0-影片地區/vb0a3-亞洲av",type_name:"亞洲"},
			{type_id:"/category/vb0-影片地區/vb0a4-國產av",type_name:"國產"},
			{type_id:"/category/vb0-影片地區/vb0a6-東南亞av",type_name:"東南亞"},
			{type_id:"/category/vb0-影片地區/vb0a5-歐美av",type_name:"歐美"},
			{type_id:"/category/vl2-玩法/vl2a1-調教",type_name:"調教"},
			{type_id:"/category/vl2-玩法/vl2a2-sm手銬-鞭子-熱蠟",type_name:"SM"},
			{type_id:"/category/vl2-玩法/vl2a3-繩縛-束縛",type_name:"束縛"},
			{type_id:"/category/vl2-玩法/vl2a0-角色扮演",type_name:"角色扮演"},
			{type_id:"/category/vb2-影片類型/vb2a1-無碼av",type_name:"無碼"}
			
			
			///category/vl2-玩法/page/3/
			///category/vb0-影片地區/vb0a0-日本av/page/3/
			///
		]
	};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg+":filter:"+filter+"extend:"+JSON.stringify(extend));
	let html= getHtml(tid+(pg>1?("/page/"+pg+"/"):"/"));
	let nVods=htmlToVods(html);
	return {
		'page': pg,
		'pagecount': 999,
		'limit': 20,
		'total': 9999,
		'list': nVods,
	}
}
function detailContent(ids){
	console.log("==detail==ids:"+JSON.stringify(ids));
	let VOD=findVodById(ids[0]);
	// let detailUrl="";
	//  try{
	// 	 if(!VOD.vod_play_url || VOD.vod_play_url.length<4){
	// 		let html= getHtml("/"+ids[0]+'/'); 
	// 		let $=cheerio.load(html);
	// 		let ifs=$("iframe");
	// 		for(let i=0;i<ifs.length;i++){
	// 			let src=$(ifs[i]).attr("src");
	// 			if(src.indexOf("imghost.club")>0){
	// 				//https://video02.imghost.club/videos/embed/5c99b940-03ae-4108-b8ee-512fbb659e90?title=0&am
	// 				src=src.split("?")[0];
	// 				detailUrl=src.replace("videos/embed","api/v1/videos");
	// 				break;
	// 			}
	// 		}
			
	// 		if(!detailUrl || detailUrl.length<3){
	// 			let vdo=$("source");
	// 			for(let i=0;i<vdo.length;i++){
	// 				try{
	// 					let src=$(vdo[i]).attr("src");
	// 					if(src.indexOf(".m3u8")>0){
	// 						VOD.vod_play_url=VOD.vod_name + '$' + src;
							
	// 						J.toast("source mode");
	// 						break;
	// 					}
	// 				}catch(e){
	// 					J.toast(e.msg||e.message);
	// 				}
	// 			}
	// 		}
			
	// 	}
		
	// 	if((!VOD.vod_play_url || VOD.vod_play_url.length<4) && detailUrl.length>5){
	// 		J.toast("detail mode");
	// 		let dtItem=getHtml(detailUrl);
	// 		if(typeof dtItem=="string")dtItem=JSON.parse(dtItem);
	// 		if(dtItem.streamingPlaylists &&dtItem.streamingPlaylists.length>0){
	// 			VOD.vod_play_url=VOD.vod_name + '$' + dtItem.streamingPlaylists[0].playlistUrl;
	// 			VOD.vod_content=dtItem.truncatedDescription||dtItem.description||VOD.vod_content;
	// 		}else{
	// 			J.toast("==解析失败==");
	// 			return {
	// 				list: [VOD]
	// 			};
	// 		}
	// 	}
	// }catch(ex){
	// 	J.toast(ex.msg||ex.message);
	// }

	//  VOD.vod_play_from="线路1";
	//P.toLive(VOD);
	VOD=getVodDetail(VOD);
	//J.toast(VOD.vod_play_url);
	P.saveToDb(VOD,true,2);
	return {
	    list: [VOD]
	};
}
 function searchContent(key,isquick){ 
 	console.log("====search==nowav==key:"+key+"|isquick:"+isquick);
	let url="/?s="+key;
	let html= getHtml(url);
	let nVods=htmlToVods(html);
	// url="/page/2/?s="+key;
	// html= getHtml(url);
	// nVods = nVods.concat(htmlToVods(html));
	return {
	    'page': 1,
	    'pagecount': 1,
	    'limit': nVods.length,
	    'total':nVods.length,
	    'list': nVods
	}
 }

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent}