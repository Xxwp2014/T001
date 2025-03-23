//http://www.239999.xyz/vodplay/33730-1-1/
import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const homeApi='https://pigav.com';
const videoApi='/{class}';
const detailUrl='/{id}/{title}.html';
const searchUrl= '/?s={wd}';
const headers={'User-Agent':'MOBILE_UA'};
const DEBUG=true;
const toLive=true;
let myCache={};

function getHtml(url,params){
	if(!url.startsWith("http")){
		return P.proxyReq(homeApi+url,params);
	}else {
		return P.proxyReq(url,params);
	}
	
}

function rand(){
	let html= getHtml("/wp-admin/admin-ajax.php", {
	  "proxyIndex":2,
	  "headers": {
	    "accept": "*/*",
	    "cache-control": "no-cache",
	    "content-type": "application/x-www-form-urlencoded",
	  },
	  "body": "action=bunyad_block&block[id]=grid&block[props][posts]=20&block[props][is_sc_call]=true&paged=2",
	  "method": "POST"
	});
	
	return htmlToVods(html)
}


 
  
 



// https://pigav.com/page/2?s=%E5%A5%B3


// fetch("https://pigav.com/wp-admin/admin-ajax.php", {
//   "headers": {
//     "accept": "*/*",
//     "cache-control": "no-cache",
//     "content-type": "application/x-www-form-urlencoded",
//   },
//   "body": "action=bunyad_block&block[id]=grid&block[props][posts]=20&block[props][is_sc_call]=true&paged=2",
//   "method": "POST"
// })
// .then(res => res.text())
// .then(res => {
// 	console.log(res)
// })
// .catch(err => {console.log(err)})


// <article class="l-post grid-post grid-sm-post">
// <div class=media> 
// <a href=https://pigav.com/530432/siro-5148-%e3%80%90%e6%95%8f%e6%84%9f%e3%81%aa%e3%83%81%e3%82%af%e3%83%93%e3%80%91%e8%88%88%e5%91%b3%e6%9c%ac%e4%bd%8d%e3%81%a7av%e5%87%ba%e6%bc%94%e3%82%92%e6%b1%ba%e3%82%81%e3%81%9f%e3%82%ad.html class="image-link media-ratio ratio-is-custom" title="SIRO-5148 【敏感なチクビ】興味本位でAV出演を決めたキュート系JD。オナーするくらいならセフレ呼ぶ！ベタなセックスが好きだというのでいちゃいちゃセックスしちゃいましょう?【初撮り】ネットでAV応募→AV体験撮影 2045  冨久永にいな">
// <span data-bgsrc=https://img.lllcdn.autos/2024/05/SIRO-5148-450x253.jpg class="img bg-cover wp-post-image attachment-bunyad-medium size-bunyad-medium lazyload" data-bgset="https://img.lllcdn.autos/2024/05/SIRO-5148-300x169.jpg 300w, https://img.lllcdn.autos/2024/05/SIRO-5148-150x84.jpg 150w, https://img.lllcdn.autos/2024/05/SIRO-5148-768x432.jpg 768w, https://img.lllcdn.autos/2024/05/SIRO-5148.jpg 840w" data-sizes="(max-width: 440px) 100vw, 440px"></span>
// </a></div>

// <div class=content><div class="post-meta post-meta-a"><h2 class="is-title post-title limit-lines l-lines-1"><a href=https://pigav.com/530432/siro-5148-%e3%80%90%e6%95%8f%e6%84%9f%e3%81%aa%e3%83%81%e3%82%af%e3%83%93%e3%80%91%e8%88%88%e5%91%b3%e6%9c%ac%e4%bd%8d%e3%81%a7av%e5%87%ba%e6%bc%94%e3%82%92%e6%b1%ba%e3%82%81%e3%81%9f%e3%82%ad.html>SIRO-5148 【敏感なチクビ】興味本位でAV出演を決めたキュート系JD。オナーするくらいならセフレ呼ぶ！ベタなセックスが好きだというのでいちゃいちゃセックスしちゃいましょう?【初撮り】ネットでAV応募→AV体験撮影 2045  冨久永にいな</a></h2></div>
// </div>
// </article>
function getVedioUrlViaImghost(u1){
	let dtItem=getHtml(u1);
	if(typeof dtItem=="string")dtItem=JSON.parse(dtItem);
	if(dtItem.streamingPlaylists &&dtItem.streamingPlaylists.length>0){
		return dtItem.streamingPlaylists[0].playlistUrl;
	}else{
		J.toast("==解析失败==");
		return null;
	}
}
function getVedioUrl(dtUrl)
{
	let html=getHtml(dtUrl);
	let $=cheerio.load(html);
	 let ifs=$("iframe");
	 for(let i=0;i<ifs.length;i++){J.toast("iframe");
	 	let src=$(ifs[i]).attr("src");
	 	if(src.indexOf("imghost.club")>0||src.indexOf("avone.me")>0){
	 		src=src.split("?")[0];
			//https://avone.me/api/v1
			//return getVedioUrlViaImghost("https://avone.me/api/v1/videos"+src.split("videos/embed")[1]);
			return getVedioUrlViaImghost(src.replace("videos/embed","api/v1/videos"));
	 	}
	 }
	 let vdo=$("source");
	 for(let i=0;i<vdo.length;i++){J.toast("source");
	 	try{
	 		let src=$(vdo[i]).attr("src");
	 		if(src.indexOf(".m3u8")>0){
	 			return src;
	 		}
	 	}catch(e){
	 		J.toast(e.msg||e.message);
	 	}
	 }
}
function htmlToVods(html){
	//stui-warp-content
	//stui-warp-content
	let $=cheerio.load(html);
	let VODS=[];
	let lis=$("article .media a");
	if(lis.length<1){
		lis=$("div.media a");
	}
	 lis.each((i, l) => {
		 try{
		let a=$(l);
		let href=a.attr("href")||"";
		if(href.indexOf("pigav")<0)return ;
		let pic=$(a.find("img")[0]).attr("src");
		if(!pic || pic.trim().length<3){
			pic=$(a.find("span")[0]).attr("data-bgsrc");
		}
		//let time=a.text().trim();
		let txt=a.attr("title")||"";
		let id=href.split("://")[1].split("/")[1];
		id=id[id.length-1];
		let vod={
					vod_name: txt,
					vod_pic: pic||"",
					//vod_remarks: time||'',
					vod_content: txt||'',
					vod_id: id,
					mcode:"zgl",
					mtype:'朱古力',
					vod_reurl:href
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
	//console.log("======init==ext222:"+ext);
	//J.toast("init");
}
function homeContent(filter){
	console.log("======homeContent======");
	//J.toast(typeof decodeURIComponent)
	 let classes=[
			{type_id:99,type_name:"最新"},
			{type_id:'a%e7%89%87',type_name:"1"},
			{type_id:'av%e5%bd%b1%e7%89%87',type_name:"2"},
			{type_id:'%e6%9c%80%e6%96%b0av',type_name:"3"},
			{type_id:'%e6%af%8f%e6%97%a5av%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"4"},
			{type_id:'%e7%84%a1%e7%a2%bcav%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"5"},
			{type_id:'%e6%b5%81%e5%87%ba%e7%89%88av%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"6"},
			{type_id:'%e5%9c%8b%e7%94%a2av%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"7"},
			{type_id:'%e5%8f%b0%e7%81%a3av',type_name:"8"},
			{type_id:'%e7%b4%a0%e4%ba%baav%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"9"},
			{type_id:'%e6%a5%b5%e9%80%9fav',type_name:"10"},
			{type_id:'%e7%b2%be%e9%81%b8av%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"11"},
			{type_id:'%e7%86%b1%e9%96%80av%e7%b7%9a%e4%b8%8a%e7%9c%8b',type_name:"12"}
		];
		 classes.forEach((item,i)=>{
			if(item.type_id!=99)
			item.type_name=decodeURIComponent(item.type_id);
		 });
		
	return {"class":classes};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg);
	let html="";
	let VODS=[];
	if(tid==99){
			VODS=rand();
	}else{
		let apiUrl=videoApi.replaceAll("{class}",tid);
		if(pg>1)apiUrl=apiUrl+"/page/"+pg
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
		let vedioUrl=getVedioUrl(VOD.vod_reurl);
		J.toast(vedioUrl);
		VOD.vod_play_url=VOD.vod_name + '$' + vedioUrl;
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