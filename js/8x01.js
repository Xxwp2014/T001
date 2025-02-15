
var rule = {
    title:'8X影视',
    host:'https://mcr69tje.hebeimanlong.com/index.json',
    homeUrl:'https://mcr69tje.hebeimanlong.com/index.json',
    detailUrl:'fyid',
    searchUrl:'|**|fypage',
    url:'|fyclass|fypage',
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    timeout:5000,
    class_name:'第一&第二', 
    class_url:'0&1',
    limit:10,
    multi:1,
    searchable:2,
    play_parse:true,
	allVODS:[],
	allVODS2:[],
	genVods:function(cc){
		if(!rule.allVODS || rule.allVODS.length<1){
			let _html=request(rule.homeUrl).trim();
			let datas=_html.split(";\n");
			let d1=datas[0];
			d1=d1.substring(d1.indexOf("["));
			d1=d1.substring(0,d1.length-1);
			d1=dealJson(d1);
			
			//post("http://z.watano.top/exec/Api01?render=1&log=3",{"body":{"d1":typeof d1}});
			 let d2=datas[1];
			 d2=d2.substring(d2.indexOf("["));
			 d2=d2.substring(0,d2.length-2);
		     d2=dealJson(d2);
			rule.allVODS=[];
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
							vod_pic: "",//obj.c,
							vod_remarks: remark||'',//标签
							vod_content: title||'',
							vod_id: id
						};
				rule.allVODS.push(vod);
			}
			rule.allVODS2=[];
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
							vod_remarks: remark||'',//标签
							vod_content: title||'',
							vod_id: id
						};
				rule.allVODS2.push(vod);
			}
		}
		if(cc==0) return rule.allVODS;
		return rule.allVODS2;
	},
	推荐:`js:
		request("http://z.watano.top/exec/Api01?render=1&log=2");
		let VODS1=rule.genVods(0);
		VODS=VODS1.slice(0,10);
	`,
    一级:`js:
		let pg=input.split("|");
		pg=pg[pg.length-1]*1;
		let cc=pg[pg.length-2]*1;
		let VODS1=rule.genVods(cc);
		VODS=VODS1.slice(pg*10,(pg+1)*10);
	`,
    myTabs:[],
	getMyTabs:function(){
		if(!rule.myTabs || rule.myTabs.length<1){
			rule.myTabs.push({text:"线路1",url:"https://fazjxevg.xyz:32768/v/"});
			rule.myTabs.push({text:"线路2",url:"https://vtkknpbd.xyz:32768/v/"});
		}
		return rule.myTabs;
	},
	findVodById:function(id){
		let VODS1=rule.genVods(0);
		for(var i=0;i<VODS1.length;i++){
			if(VODS1[i].vod_id==id)return VODS1[i];
		}
		VODS1=rule.genVods(1);
		for(var i=0;i<VODS1.length;i++){
			if(VODS1[i].vod_id==id)return VODS1[i];
		}
		return {};
	},
	 二级:`js:
		VOD=rule.findVodById(detailObj.orId); 
		let tbs=rule.getMyTabs();
		for(var i=0;i<tbs.length;i++){
			if(i==0)VOD.vod_play_from=tbs[i].text;
			else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
			if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
			else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
		}
	`,
	搜索:`js:
		let pms =input.split("|");
		let pg=pms[pms.length-1]*1;
		let wd=pms[pms.length-2].trim();
		let VODS=[];
		let VODS0=rule.genVods(0);
		let VODS1=rule.genVods(1);
		let VODS2=VODS0.concat(VODS1);
		for(var i=0;i<VODS2.length;i++){
			if(VODS2[i].vod_name.indexOf(wd)>-1){
				VODS.push(VODS2[i]);
			}
		}
		if(VODS.length<10 && wd.length>1){
			let wdt=((wd.length/2)+"").split(".")[0]*1;
			let wd1=wd.substring(0,wdt);
			let wd2=wd.substring(wdt);
			for(var i=0;i<VODS2.length;i++){
				if(VODS2[i].vod_name.indexOf(wd1)>-1 || VODS2[i].vod_name.indexOf(wd2)>-1){
					VODS.push(VODS2[i]);
				}
			}
		}
	`
}