
var rule = {
    title:'TT影视',
    host:'https://www.360kan.com',
    homeUrl:'https://7m8akfa7.xyz/api/home',
    detailUrl:'https://7m8akfa7.xyz/api/video?id=fyid',
    searchUrl:'https://7m8akfa7.xyz/api/search?v=**&page=fypage&n=2',
    url:'https://7m8akfa7.xyz/api/videolist?ctg=fyclass&page=fypage',
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    timeout:5000,
    class_name:'日韩&国产&欧美&动漫&音频0',
    class_url:'2&1&3&4&audio',
    limit:5,
    multi:1,
    searchable:2,
    play_parse:true,
	genVods:function(data){
		let _VODS=[];
		for(var i=0;i<data.length;i++){
			let obj=data[i];
			let vod={   vod_name: obj.title,
						vod_pic: "https://jt9ath.xyz:8443/"+obj.md5+".webp1",
						vod_remarks: obj.tags||obj.genres||'',//标签
						vod_content: obj.tags||obj.genres||'',
						vod_id: obj.md5||obj.overview||obj.id,
						type: obj.typeId||''
					};
			_VODS.push(vod);
		}
		return _VODS;
	},
	推荐:`js:
		let json=request(input);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.column1){
			VODS=rule.genVods(json.data.column1);
		}
	`,
    一级:`js:
		
		if(input.indexOf("audio")>0){
			input=input.replace("videolist?ctg=audio&","audiopage?");
		}
		let json=request(input);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.data){
			VODS=rule.genVods(json.data.data);
		}
	`,
    myTabs:[],
	getMyTabs:function(){
		if(!rule.myTabs || rule.myTabs.length<1){
			rule.myTabs=[];
			let a=request("https://7m8akfa7.xyz/292.bundle.js");
			a=a.substring(0,a.indexOf("index.m3u8"))
			a=a.substring(a.length-200,a.length-1)
			a=a.substring(a.indexOf("["),a.indexOf("]")+1);
			let tbs= JSON.parse(a);
			let tbs2=[];
			for(var i=0;i<tbs.length;i++){
				if(tbs2.indexOf((tbs[i]))<0)tbs2.push(tbs[i]);
			}
			for(var i=0;i<tbs2.length;i++){
				rule.myTabs.push({text:"线路"+(i+1),url:tbs2[i]});
			}
		}
		if(!rule.myTabs || rule.myTabs.length<1){
			rule.myTabs.push({text:"线路1",url:"https://pr9ttkf2.xyz/"});
		}
		return rule.myTabs;
		 
	},
	 二级:`js:
	 
		if(detailObj.fyclass=="audio"||(detailObj.orId+"").length<10){
			input=input.replace("/video?","/audio?")
		}
		let json=request(input);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.data){
			VOD=rule.genVods([json.data.data]); 
			if(VOD.length<1){
				VOD={};
			}else{
				VOD=VOD[0];
				let tbs=rule.getMyTabs();
				for(var i=0;i<tbs.length;i++){
					if(i==0)VOD.vod_play_from=tbs[i].text;
					else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
					if(detailObj.fyclass=="audio" ||(detailObj.orId+"").length<10){
						if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.vod_id+".mp3";
						else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/m/"+VOD.vod_id+".mp3";
					}else{
						if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
						else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+"/"+VOD.vod_id+"/index.m3u8";
					}
				}
			}
		}
	`,
	搜索:`js:
		let json=request(input);
		if(typeof json=="string")json=JSON.parse(json);
		if(json && json.data && json.data.data){
			VODS=rule.genVods(json.data.data); 
		}
	`
}