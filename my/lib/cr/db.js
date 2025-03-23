import  P  from"public.js"; 
let favReload=false;
function init (ext){
	console.log("====init==ext222:"+ext);
	
	//J.toast("lll:"+(typeof P.querySql));
}

function homeContent(filter){
 	J.toast("home7");
	let classs=P.querySql("select distinct mcode as type_id,mtype as type_name from my_vods");
	return {
		"class":[{"type_id":"his","type_name":"播放记录"},{"type_id":"fav","type_name":"收藏"},{"type_id":"5gdb","type_name":"5GDB"}].concat(classs)
	};
}
function categoryContent(tid,pg,filter,extend){
	let size=20;
	let vods=[];
	if(tid=="his"){
		vods=P.querySql("select * from my_vods_play  order by id desc  limit ?,? ",[size*(pg-1),size]);
	}else if(tid=="fav"){
		if(!favReload){
			P.initVodCollectToMyDb();
			favReload=true;
		}
		vods=P.querySql("select * from my_vods_play where fav=1 order by id desc  limit ?,? ",[size*(pg-1),size]);
	}else if(tid=="5gdb"){
		vods=Db.queryLocal("select * from `vod_5g` limit ?,? ",[size*(pg-1),size],"/sdcard/TV/my/lib/cr/5g.db");
	}else{
		vods=P.querySql("select * from my_vods where mcode=? limit ?,? ",[tid,size*(pg-1),size]);
	}
	vods.forEach((item,i)=>{
			item.vod_id=item.id+"$$$"+tid;
	});
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
	let vod={};
	if(id.endsWith("his")||id.endsWith("fav")){
		vod=P.queryFirst("select * from my_vods_play where id=? ",[nid]);
	}else if(id.endsWith("5gdb")){
		let vods2=Db.queryLocal("select * from vod_5g where id=? ",[nid],"/sdcard/TV/my/lib/cr/5g.db");
		if(vods2)vod=vods2[0];
		
	}else {
		vod=P.queryFirst("select * from my_vods where id=? ",[nid]);
	}
	return {
	    list: [vod]
	};
}
function searchContent(key,isquick){
	let wd="%"+key+"%";
	let limit = 200;
	let vods=P.querySql("select * from my_vods where vod_name like ? or vod_remarks like ? or vod_content like ?  or vod_class like ? limit ?",[wd,wd,wd,wd,limit]);
	vods.forEach((item,i)=>{
			item.vod_id=item.id+"$$$search";
	});
	return {
		'page': 1,
		'pagecount': 999,
		'limit': limit,
		'total': 999999,
		'list': vods,
	}
 }

export default {init,homeContent,categoryContent,detailContent,searchContent}