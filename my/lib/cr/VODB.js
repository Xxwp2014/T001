import  P  from"public.js"; 
let CLASSLIST=[];
let proxyTables=["vod_nowav","www_244444_xyz","fqzy_me","shayuzy1_com","api_998zy_com","bt4_cc","www_36717_info"];

function myQuerySql(sql,params){
	return Db.queryLocal(sql,params,"/sdcard/TV/my/lib/cr/cr.db");
}
function myQueryFirst(sql,params){
	let list= myQuerySql(sql,params);
	if(list && list.length>0)return list[0];
	return null;
}
function getVodsBySql(tablename,sql,params){
	let tmpList=myQuerySql(sql,params);
	try{
		if(tmpList){
			tmpList.forEach((item,j)=>{
				 item.vod_id=item.id+"$$$"+tablename;
				 if(proxyTables.indexOf(tablename)>-1){
					 item.vod_pic="https://api.codetabs.com/v1/proxy/?quest="+item.vod_pic;
				 }
				 // if(tablename=="vod_nowav")item.type_id=1;
				 if(isNaN(item.type_id))item.type_id=1;
			});
		}
	}catch(e){
		J.toast(e.msg||e.message);
	}
	return tmpList;
}
function init (ext){
	console.log("====init==ext222:"+ext);
	//let a = Db.dbfile("/TV/my/lib/cr/cr.db");
	
	//let a = Db.dbfile("/TV/my/mytv.db");
}

function homeContent(filter){
 	J.toast("home7");
	if(CLASSLIST.length<1){
		CLASSLIST=myQuerySql(" SELECT name as type_id ,name as type_name,type FROM sqlite_master where type='table' and name not in('android_metadata','sqlite_sequence','www_moduzy_com') ");
	}
	//if(CLASSLIST&&CLASSLIST.length>2)CLASSLIST.pop();
//	J.toast(JSON.stringify(CLASSLIST));
	return {
		"class":CLASSLIST
	};
}
function categoryContent(tid,pg,filter,extend){
	let size=20;
	let vods= getVodsBySql(tid,"select * from `"+tid+"`  order by id desc  limit ?,? ",[size*(pg-1),size]);
	//J.toast(JSON.stringify(vods));
	return {
		'page': pg,
		'pagecount': 999,
		'limit': size,
		'total': 999999,
		'list': vods,
	}
}
function detailContent(ids){
	console.log("==detail==ids:"+JSON.stringify(ids));
	let id=ids[0];
	let nid=id.split("$$$")[0];
	let table=id.split("$$$")[1];
	let vod=myQueryFirst("select * from `"+table+"` where id=? ",[nid]);
	P.toLive(vod);
	return {
	    list: [vod]
	};
}
function searchContent(key,isquick){
	console.log("==searchContent==key:"+key+",CLASSLIST:"+JSON.stringify(CLASSLIST));
	let wd="%"+key+"%";
	let limit = 200;
	let VODS=[];
	for(let i=0;i<CLASSLIST.length;i++){
		let tablename=CLASSLIST[i].type_id; 
	    let tmpList= getVodsBySql(tablename,"select * from `"+tablename+"` where vod_name like ? or vod_remarks like ? or vod_content like ?  or vod_class like ? limit ?",[wd,wd,wd,wd,limit]);
	    VODS=VODS.concat(tmpList); 
	}
	if(VODS.length<1){
		J.toast("未找到记录");
	}
	return {
		'page': 1,
		'pagecount': 999,
		'limit': VODS.length,
		'total': 999999,
		'list': VODS,
	}
 }

export default {init,homeContent,categoryContent,detailContent,searchContent}