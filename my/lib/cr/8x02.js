import cheerio from"assets://js/lib/cheerio.min.js";
import  P  from"public.js";
const dataapi='https://mcr69tje.hebeimanlong.com/index.json';
let host="https://vcza.qiaxd3uy.mom";
let proxy="https://corsproxy.bunkum.us/corsproxy/?apiurl="
const DEBUG=true;
const toLive=true;
let VODS=[[],[]];
let cacheVods={};
let data="";
let myTabs=[];
function getHtml(url){
	if(!url.toLowerCase().startsWith("http")){
		 return P.proxyReq(host+url); 
	}else{
		return J.get(url);
	}
}

function initData(){
	let _html=J.get(dataapi).trim();
	let datas=_html.split(";");
	let d1=datas[0];
	d1=d1.substring(d1.indexOf("["));
	d1=d1.substring(0,d1.length-1);
	d1=P.dealJson(d1);
	
	let d2=datas[1];
	
	d2=d2.substring(d2.indexOf("["));
	d2=d2.substring(0,d2.length-1);
	d2=P.dealJson(d2);
	
	for(var i=0;i<d1.length;i++){
		let obj=d1[i];
		let title=obj.t;
		let remark="";
		if(title.indexOf("-")>0){
			remark=title.substring(title.lastIndexOf("-"));
			title=title.substring(0,title.lastIndexOf("-"));
		}
		let id=obj.c;
		if(id&&id.indexOf("/")>0){
			id=id.split("/");
			id=id[id.length-1];
			id=id.substring(0,id.indexOf("."));
		}
		let vod={
					vod_name: title,
					vod_pic: obj.c,
					vod_remarks: remark||'',
					vod_content: title||'',
					vod_id: id,
					mcode:"8X02",
					mtype:'8X02'
				};
		VODS[0].push(vod);
	}
	for(var i=0;i<d2.length;i++){
		let obj=d2[i];
		let title=obj.t;
		let remark="";
		if(title.indexOf("-")>0){
			remark=title.substring(title.lastIndexOf("-"));
			title=title.substring(0,title.lastIndexOf("-"));
		}
		let id=obj.c;
		if(id&&id.indexOf("/")>0){
			id=id.split("/");
			id=id[id.length-1];
			id=id.substring(0,id.indexOf("."));
		}
		let vod={
					vod_name: title,
					vod_pic: obj.c,
					vod_remarks: remark||'',
					vod_content: title||'',
					vod_id: id,
					mcode:"8X02",
					mtype:'8X02'
				};
		VODS[1].push(vod);
	}
	console.log(VODS[0].length+"||"+VODS[1].length);
	 
}
function findVodById(id){
	for(var i=0;i<VODS.length;i++){
		for(var j=0;j<VODS[i].length;j++){
			if(VODS[i][j].vod_id==id)return VODS[i][j];
		}
	}
	
	return cacheVods[id];
}
function getMyTabs(){
	if(!myTabs || myTabs.length<1){
		myTabs.push({text:"线路1",url:"https://fazjxevg.xyz:32768/v/"});
		myTabs.push({text:"线路2",url:"https://vtkknpbd.xyz:32768/v/"});
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
	
		setTimeout(function(){initData();},10);
}
function homeContent(filter){
	return {
		"class":[
			{type_id:1,type_name:"推荐"},
			{type_id:2,type_name:"其他"},
			{type_id:"大陆",type_name:"大陆"},
			{type_id:"日韩",type_name:"日韩"},
			{type_id:"动画",type_name:"动画"},
			{type_id:"欧美",type_name:"欧美"},
			{type_id:"三级",type_name:"剧情"}
			
			///
		]
	};
}
function categoryContent(tid,pg,filter,extend){
	console.log("====category==tid:"+tid+"==pg:"+pg);
	if(tid==1||tid==2){
		return {
			'page': pg,
			'pagecount': VODS[tid-1].length/20,
			'limit': 20,
			'total': VODS[tid-1].length,
			'list': VODS[tid-1].slice(pg*20,(pg+1)*20),
		}
	}else{
		let html= getHtml("/categories/"+tid+(pg>1?("/page/"+pg+"/"):"/"));
		//J.toast("/categories/"+tid+"="+html);
		let nVods=[];
		let $=cheerio.load(html);
		 $('main li').each((i, l) => {
			 let pic=$($(l).find("img")[0]).attr("src");
			 if(pic && pic.length>1){
				 let id=pic.split("/");
				 id=id[id.length-1].split(".")[0];
				const title = $(l).text().trim();
				let rmk=title.split("-");
				if(rmk.length>1)rmk=rmk[rmk.length-1];
				else rmk="";
				let xvod={
						vod_name: title,
						vod_pic: pic,
						vod_remarks: rmk||'',//标签
						vod_content: title,
						vod_id: id,
						type: tid
				};
				nVods.push(xvod);
				cacheVods[id]=xvod;
			}
		  
		});
		return {
			'page': pg,
			'pagecount': 999,
			'limit': 20,
			'total': 9999,
			'list': nVods,
		}
		
		
	}
}
function detailContent(ids){
	console.log("==detail==ids:"+JSON.stringify(ids));
	let VOD=findVodById(ids[0]);
	let tbs=getMyTabs();
	for(var i=0;i<tbs.length;i++){
		if(i==0)VOD.vod_play_from=tbs[i].text;
		else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
		let realUrl=getRealUrl(tbs[i].url+"/"+VOD.vod_id+"/index.m3u8");
		if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + realUrl;
		else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + realUrl;
	}
	P.toLive(VOD);
	return {
	    list: [VOD]
	};
}
 function searchContent(key,isquick){
 	console.log("====search==8x02==key:"+key+"|isquick:"+isquick);
	let wd=key;
	let sVODS=[];
	let VODS2=VODS[0].concat(VODS[1]);
	for(var i=0;i<VODS2.length;i++){
		if(VODS2[i].vod_name.indexOf(wd)>-1||VODS2[i].vod_remarks.indexOf(wd)>-1){
			sVODS.push(VODS2[i]);
		}
	}
	if(wd.length>3){
		let wdt=((wd.length/2)+"").split(".")[0]*1;
		let wd1=wd.substring(0,wdt);
		let wd2=wd.substring(wdt);
		for(var i=0;i<VODS2.length;i++){
			if(VODS2[i].vod_name.indexOf(wd1)>-1 || VODS2[i].vod_name.indexOf(wd2)>-1){
				sVODS.push(VODS2[i]);
			}
		}
	}
	return {
	    'page': 1,
	    'pagecount': 1,
	    'limit': sVODS.length,
	    'total':sVODS.length,
	    'list': sVODS
	}
 }

export default {DEBUG,init,homeContent,categoryContent,detailContent,searchContent}