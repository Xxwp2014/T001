const createMyVodsPlaySql=`CREATE TABLE IF NOT EXISTS "my_vods_play" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "fav" integer DEFAULT 0, "mcode" TEXT, "mtype" TEXT, "type_name" TEXT, "type_id_1" TEXT, "type_id" INTEGER, "vod_id" text, "vod_name" TEXT, "vod_pic" TEXT, "vod_remarks" TEXT, "vod_content" TEXT, "vod_play_from" TEXT, "vod_play_url" TEXT, "vod_en" TEXT, "vod_time" TEXT, "vod_year" TEXT, "vod_director" TEXT, "vod_down_url" TEXT, "vod_actor" TEXT, "vod_down_note" TEXT, "vod_class" TEXT, "vod_author" TEXT);CREATE INDEX "index_mcode_copy1"ON "my_vods_play" ( "mcode" ASC);CREATE INDEX "index_vod_id_copy1"ON "my_vods_play" ( "vod_id" ASC);CREATE INDEX "index_vod_play_url_copy1"ON "my_vods_play" ( "vod_play_url" ASC);`
const createMyVodsSql=`CREATE TABLE IF NOT EXISTS "my_vods" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "fav" integer DEFAULT 0, "mcode" TEXT, "mtype" TEXT, "type_name" TEXT, "type_id_1" TEXT, "type_id" INTEGER, "vod_id" text, "vod_name" TEXT, "vod_pic" TEXT, "vod_remarks" TEXT, "vod_content" TEXT, "vod_play_from" TEXT, "vod_play_url" TEXT, "vod_en" TEXT, "vod_time" TEXT, "vod_year" TEXT, "vod_director" TEXT, "vod_down_url" TEXT, "vod_actor" TEXT, "vod_down_note" TEXT, "vod_class" TEXT, "vod_author" TEXT);CREATE INDEX "index_mcode"ON "my_vods" ( "mcode" ASC);CREATE INDEX "index_vod_id"ON "my_vods" ( "vod_id" ASC);CREATE INDEX "index_vod_play_url"ON "my_vods" ( "vod_play_url" ASC);`;

const VODTMP={"mcode":1,"mtype":1,"vod_id":1,"group_id":0,"type_id_1":0,"type_name":1,"type_id":1,"vod_name":"name","vod_sub":0,"vod_en":1,"vod_status":0,"vod_letter":0,"vod_color":0,"vod_tag":0,"vod_class":1,"vod_pic":1,"vod_pic_thumb":0,"vod_pic_slide":0,"vod_pic_screenshot":0,"vod_actor":1,"vod_director":1,"vod_writer":0,"vod_behind":0,"vod_blurb":0,"vod_remarks":1,"vod_pubdate":0,"vod_total":0,"vod_serial":0,"vod_tv":0,"vod_weekday":0,"vod_area":0,"vod_lang":0,"vod_year":1,"vod_version":0,"vod_state":0,"vod_author":1,"vod_jumpurl":0,"vod_tpl":0,"vod_tpl_play":0,"vod_tpl_down":0,"vod_isend":0,"vod_lock":0,"vod_level":0,"vod_copyright":0,"vod_points":0,"vod_points_play":0,"vod_points_down":0,"vod_hits":0,"vod_hits_day":0,"vod_hits_week":0,"vod_hits_month":0,"vod_duration":0,"vod_up":0,"vod_down":0,"vod_score":0,"vod_score_all":0,"vod_score_num":0,"vod_time":1,"vod_time_add":0,"vod_time_hits":0,"vod_time_make":0,"vod_trysee":0,"vod_douban_id":0,"vod_douban_score":0,"vod_reurl":0,"vod_rel_vod":0,"vod_rel_art":0,"vod_pwd":0,"vod_pwd_url":0,"vod_pwd_play":0,"vod_pwd_play_url":0,"vod_pwd_down":0,"vod_pwd_down_url":0,"vod_content":1,"vod_play_from":1,"vod_play_server":0,"vod_play_note":0,"vod_play_url":1,"vod_down_from":0,"vod_down_server":0,"vod_down_note":1,"vod_down_url":1,"vod_plot":0,"vod_plot_name":0,"vod_plot_detail":0}
let lastProxy="";
const proxys=[
"DIRECT",
"https://api.allorigins.win/raw?url=",
"https://corsproxy.bunkum.us/corsproxy/?apiurl=",
"https://api.codetabs.com/v1/proxy/?quest=",
"https://api.cors.lol/?url=",
"https://thingproxy.freeboard.io/fetch/"
];
const imgProxys=[
	"https://api.allorigins.win/raw?url=",
	"https://corsproxy.bunkum.us/corsproxy/?apiurl=",
	"https://api.codetabs.com/v1/proxy/?quest=",
	"https://api.cors.lol/?url="
]

function splitProxy(url){
	
	for(let i=1;i<proxys.length;i++){
		if(url.indexOf(proxys[i])>-1){
			return [url.replaceAll(proxys[i],""),proxys[i],i];
		}
	}
	return [url,"",0];
	
}
function proxyReq(url,params){
	if(!lastProxy || lastProxy.length<3){
		if(typeof params=="boolean" && params===true){
			lastProxy=proxys[1];
		}else if(typeof params=="object" && params["proxy"]==true){
			lastProxy=proxys[1];
		}else if(typeof params==="number" || (typeof params=="object" && typeof params["proxyIndex"]=="number" )){
			if(typeof params==="number")lastProxy=proxys[params];
			else lastProxy=proxys[params["proxyIndex"]];
			
		}else {
			lastProxy=proxys[0];
		}
	}
	let resp=req(getProxyUrl(url,lastProxy),params);
	if(resp.code!=200 || resp.content=="" || resp.content.indexOf("404 Not Found")>-1){
		for(let i=1;i<proxys.length;i++){
			let  tmpProxy=proxys[i];
			resp=req(getProxyUrl(url,tmpProxy),params);
			if(resp.code!=200 || resp.content=="" || resp.content.indexOf("404 Not Found")>-1)continue;
			lastProxy=tmpProxy;
			return resp.content;			
		}
	}
	return resp.content;
}

function getImgProxyUrl(imgUrl){
	let maxNum=imgProxys.length-1;
	let rdm= (Math.random()*maxNum).toFixed(0);
	return imgProxys[rdm] +imgUrl;// getProxyUrl(imgUrl,);

}

function getProxyUrl(url,proxyUrl){
	if(!proxyUrl||proxyUrl.length<3||proxyUrl=="DIRECT")return url;
	else if(proxyUrl.indexOf("?")<0)return proxyUrl+url;
	return proxyUrl+encodeURIComponent(url);
}

function getNewUrl(url){
	//
	try{
		let url2=getProxyUrl(url,"https://corsproxy.bunkum.us/corsproxy/?apiurl=");
		let resp=req(url2);
		if(resp.url && resp.url!=url2){
			return decodeURIComponent(resp.url.split("apiurl=")[1]);
		}
	}catch(e){
		
	}
	return url;
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

function toLive(VOD){
	if(!VOD.vod_play_url) return ;
	let tmparr= VOD.vod_play_url.split("$$$");
	tmparr=tmparr[tmparr.length-1];
	let uarr=tmparr.split("$");
	let title=uarr[0].replaceAll(",","");
	let url=uarr[1].trim().replaceAll("\\","");
	if(url.toLowerCase().startsWith("http")){
		setTimeout(function(){
			try{
				saveToLive(title,url);//java function 
				J.toast("live ok");
			}catch(e){}
			saveToDb(VOD,true,2);//js function 
		},10);
	}
}
function vodExists(url,type){
	try{
		 let sql="select count(1) from "+(type==1?"my_vods":"my_vods_play")+" where vod_play_url like ?";
		 let cnt=queryNum(sql,["%"+url.trim()+"%"]);
		 console.log("vodExists:",cnt,sql);
		 return cnt>=1;
	 }catch(e){
		 return false;
	 }
}
function saveToDb(vod,toast,type){
	if(!toast)toast=false;
	if(!type)type=1;
	if(toast)J.toast("DB start");
	if(!vod.vod_play_url) return ;
	console.log(vod.vod_play_url);
	let tmparr= vod.vod_play_url.split("$$$");
	for(var i=0;i<tmparr.length;i++){
		let uarr=tmparr[i].split("$");
		let title=uarr[0].replaceAll(",","");
		let url=uarr[1].trim().replaceAll("\\","");
		console.log(url,title);
		if(vodExists(url,type)){
			if(toast)J.toast("exists !!!");
			return ;
		}
	}
	saveVod(vod,type);
	if(toast)J.toast("DB ok");
}
function saveVod(vod,type){
	if(!vod.mcode){
		vod.mcode="UNKOWN";
		vod.mtype="其他";
	}
	let insertSql="insert into "+(type==1?"my_vods":"my_vods_play")+"(";
	let params=[];
	let values=")values(";
	for(var k in vod){
		if(VODTMP[k]){
			insertSql=insertSql+'"'+k.trim()+'",';
			values=values+"?,";
			params.push(vod[k]);
		}
	}
	if(vod.vod_name.indexOf("#")>-1)vod.vod_name.replaceAll("#","");
	if(!insertSql.endsWith(",")){
		console.log(insertSql,"IS EMPTY!!");
		return -99;
	}else{
		insertSql=insertSql.substring(0,insertSql.length-1);
		values=values.substring(0,values.length-1)+")";
	}
	//console.log(insertSql+values,params);
	return execSql(insertSql+values,params);
}
function initTables(qz){
	if(localStorage.getItem("inittables")=="1"&&!qz)return ;
	execSql(createMyVodsPlaySql);
	execSql(createMyVodsSql);
	execSql("alert table my_vods add column fav integer;");
	localStorage.setItem("inittables","1")
}

function findVod(mcode,vodid){
	let vod=queryFirst("select * from my_vods where mcode=? and vod_id=?",[mcode,vodid]);
	if(vod==-1)return null;
	return vod;
}

function dbOpen(){
	Db.open();
}

function dbClose(){
	Db.close();
}

function queryNum(sql,param){
	let data=querySql(sql,param);
	if(data && data.length>0){
		data=data[0];
		for(var k in data){
			try{
				return data[k]*1;
			}catch(e){}
		}
	}
	return -1;
}
function queryFirst(sql,param){
	let data=querySql(sql,param);
	if(data && data.length>0){
		return data[0];
	}
	return -1;
}

function querySql(sql,param){
	let data=[];
	try{
		//dbOpen();
		data=Db.query(sql,param);
		console.log(JSON.stringify(data));
		//dbClose();
	}catch(e){
		J.toast(e.msg||e.message);
		//dbClose();
	}
	return data;
}
function execSql(sql,param){
	let result=0;
	try{
		//dbOpen();
		if(param && param.length>0){
			result=Db.execSQL(sql,param);
		}else{
			result=Db.execSQL(sql);
		}
		//dbClose();
	}catch(e){
		J.toast(e.msg||e.message);
		//dbClose();
	}
	return result;
}
function getQueryParams(_url) {
	try{
	  let a= _url.split('?')[1].split('&').reduce((acc, param) => {
		const [key, value] = param.split('=');
		acc[key] = value;
		return acc;
	  }, {});
	  return a;
  }catch(e){
	  J.toast(e.msg||e.message);
  }
  return null;
}

function initVodCollectToMyDb(){
	let vods= Db.queryLocal("select * from vodCollect");
	//J.toast( (typeof vods )+ "|"+ JSON.stringify(vods));
	
	if(vods && vods.length>0){
		for(var i=0;i<vods.length;i++){
			let tmp=vods[i];
			execSql("update my_vods_play set fav=1 where vod_id=? or vod_pic=?",[tmp.vodid,tmp.pic]);
			// if(tmpid.endsWith("_mytag")){
			// 	tmpid=tmpid.substring(0,tmpid.length-6);
			// 	let id=tmpid.substring(0,tmpid.lastIndexOf("_"));
			// 	let mcode=tmpid.substring(tmpid.lastIndexOf("_")+1);
			// 	execSql("update my_vods set fav=1 where mcode=? and vod_id=?",[mcode,id]);
			// }else if(tmp.pic && tmp.pic.length>4){
			// 	execSql("update my_vods set fav=1 where vod_pic=?",[tmp.pic]);
			// }
		}
	}
}

export default { getNewUrl,proxyReq,dealJson,toLive,getProxyUrl,querySql,queryNum,execSql,queryFirst,saveToDb,
getQueryParams,getImgProxyUrl,initVodCollectToMyDb,initTables,findVod,splitProxy}