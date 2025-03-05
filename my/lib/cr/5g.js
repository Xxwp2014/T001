import  P  from"public.js";
import  "assets://js/lib/crypto-js.js";
//import cheerio from"assets://js/lib/cheerio.min.js"; 
const DEBUG=true;
const toLive=true;

// 	let tmp={"data":{"k1":"7oTTJtZELu7UKGP22BAETth4eoFfZ1GBmtu3CHDLav3EMcvBKsclGDACPqKILv45Thf1M6ybQjEXtefs8xNDlr+077c17koDQK3caspuhEN0GZURGjxMqvSC+JY57QgA/nFc7TGmEeftrAahR07QFFlyUjXXzysYlCzaPSnvfPZuUZh0ZBrrlWd0ljCfa1HaIH0iWuf+LLQzIO428WfkPaTDFHs3RJoZ76EOlrRcVy26fVGnsMi5CLrhI6JUNCBB1l/gcKDksOLTE2zzX+HgWaPbU76sN4CELqqbEbGEx4eWjZgMXT4zZKyuLZvRV1ZNZGnFdJrwqY6NwaEYgKEINQaQWQxVaN+JFVjbBgf9OYCvfggdoUWs9M9AvBWP3z8RuZ9Ojuowu05Zdbd2OgRWNkottoajV5nqf3yvrpu+UcM=","v2":"iERPllRYXIQTO/ULJ3Qtmg=="},"status":200}

	let hosts=['https://15g.app','https://gd7j4a.mom'];
	const tabsApi='/c.json';
	const homeApi='/home';
	const randApi='/rdlist';
	const videoApi='/list_h/{class}/{page}';
	const audioApi='/api/audiopage?page={page}';
	const detailUrl='/detail/{id}';
	const detailAudioUrl='/api/audio?id={id}';
	const searchUrl= '/api/searchs?key={wd}&p={page}';
	const headers={'User-Agent':'MOBILE_UA'};
	let myTabs=[];
	let lastHost="";
	let myCache={};
	request=function(url){
		if(!url.toLowerCase().startsWith("http")){
			let res ="";
			 if(lastHost.length>3) res= P.proxyReq(lastHost+url);
			if(res && res.trim().length>1)return res;
			for(var i=0;i<hosts.length;i++){
				lastHost=hosts[i];
				res= P.proxyReq(hosts[i]+url);
				if(res && res.trim().length>1)return res;
			}
			return "";
		}else{
			return P.proxyReq(url);
		}
	}

	function initHosts(){
		try{
			 let nUrl=P.getNewUrl(hosts[0]+"?key=ok");
			if(nUrl==hosts[0]){
				nUrl=P.getNewUrl(hosts[1]+"?key=ok");
			}
			if(nUrl!=hosts[1]){
				hosts=[nUrl].concat(hosts)
			}
			J.toast("hosts load success:"+JSON.stringify(hosts));
		}catch(ee){
			J.toast(ee.message);
		}
	}

	  // 公共解密函数
	 function decodeTxt(obj)   {
		try {
		  const cipherText = CryptoJS.enc.Base64.parse(obj.k1||obj.t1);
		  const iv = CryptoJS.enc.Base64.parse(obj.v2||obj.t2);
		  const key = CryptoJS.enc.Utf8.parse("aafb2b88c91ac2b0"); // 固定的16字节密钥
		  const decrypted = CryptoJS.AES.decrypt({ ciphertext: cipherText }, key, { iv });
		  return decrypted.toString(CryptoJS.enc.Utf8).replace(/[\x00-\x1F\x7F-\x9F\x10]+/g, '').trim();
		} catch (e) {
			
		  console.error("解密失败", e);
		  return "";
		}
	  }
	function dataToVods(data){
			let _VODS=[];
			for(var i=0;i<data.length;i++){
				try{
				let obj=data[i];
				if( (obj["k1"] && obj["v2"]) || (obj["t1"] && obj["t2"])){
					obj=decodeTxt(obj);
					if(typeof obj==="string")obj=JSON.parse(obj);
				}
				
				if(obj.title && typeof obj.title ==="object"){
					obj.title=decodeTxt(obj.title);
				}
				let title=obj.title;
				 let remark=obj.typename||obj.series||(obj.tag&&obj.tag[0])||"";
				 
				 let fi=title.indexOf("：");
				 if(fi>0){
					 remark=remark+" "+title.substring(0,fi);
					 title=title.substring(fi+1);
				 }
				 remark=remark.replaceAll("-"," ");
				 let img=obj.litpic||"";
				 if(!img.toLowerCase().startsWith("http")){
					 img="https://5gixb.xyz:1443/pic/"+img+".webp"
				 }
				 let md5=img.split("/");
				 md5=md5[md5.length-1].split(".")[0];
				let vod={
							vod_name: title,
							vod_pic: img,
							vod_remarks: remark,//标签
							vod_content: obj.body||title||'',
							vod_id: obj.id,
							md5:md5,
							mcode:"5g",
							mtype:'5G'
						};
				myCache[obj.id]=vod;
				_VODS.push(vod);
				}catch(e){
					J.toast(e.message||e.msg);
				}
			}
			return _VODS;
	}
	function getMyTabs(){
		if(!myTabs || myTabs.length<1){
			myTabs.push({text:"线路1",url:"https://tpp1ay3r2k.com:1443/hls/"});
			myTabs.push({text:"线路2",url:"https://7upl0y3r2s.com:1443/hls/"});
			myTabs.push({text:"线路3",url:"https://ayp10yer2t.com:1443/hls/"});
			myTabs.push({text:"线路4",url:"https://erhp1a7er2a.com:1443/hls/"});
			myTabs.push({text:"线路5",url:"https://vkpdfskh.xyz:32786/hls/"});
		}
		return myTabs;
	}
	function init (ext){
		console.log("====init==ext222:"+ext);
		initHosts();
	}
	function homeContent (filter){
		console.log("========homeContent======");
		return {
			"class":[
				{type_id:7,type_name:"最新"},
				{type_id:6,type_name:"随机"},
				{type_id:"日韩",type_name:"日韩"},
				{type_id:"大陆",type_name:"大陆"},
				{type_id:"欧美",type_name:"欧美"},
				{type_id:"动漫",type_name:"动漫"},
				{type_id:"三级",type_name:"剧情"}
			]
		};
	}
	function categoryContent(tid,pg,filter,extend){
		console.log("====category==tid:"+tid+"==pg:"+pg);
		let json="";
		let VODS=[];
		if(tid==6){
				let apiUrl=randApi+"?t="+pg;
				json=request(apiUrl);
				if(typeof json=="string")json=JSON.parse(json);
				if(json && json.data ){
					VODS=dataToVods(json.data);
				}
		}else {
			let apiUrl=videoApi.replaceAll("{class}",tid).replaceAll("{page}",pg);
			if(tid==7){
				if(pg*1>1)return {};
				apiUrl=homeApi;
			}
			json=request(apiUrl);
			if(typeof json=="string")json=JSON.parse(json);
			if(json && json.data ){
				VODS=dataToVods(json.data);
			}
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
		//https://5xt5q7.lol/detail/106062

		let oid=ids[0]+"";
		let VOD=myCache[oid];
		console.log("====",VOD);
		let tbs=getMyTabs();
				
		console.log("====myTabs===",JSON.stringify(tbs),"===VOD===",JSON.stringify(VOD));
		for(var i=0;i<tbs.length;i++){
			if(i==0)VOD.vod_play_from=tbs[i].text;
			else VOD.vod_play_from=VOD.vod_play_from+"$$$"+tbs[i].text;
			if(i==0)VOD.vod_play_url=VOD.vod_name + '$' + tbs[i].url+VOD.md5+"/index.m3u8";
			else VOD.vod_play_url=VOD.vod_play_url+"$$$"+VOD.vod_name + '$' + tbs[i].url+VOD.md5+"/index.m3u8";			
		}
		P.toLive(VOD);
		return {
			list: [VOD]
		};
	}
	function searchContent(key,isquick){
		console.log("====search==8x01==key:"+key+"|isquick:"+isquick);
		let wd=key;
		let VODS=[];
		
		  for(var i=1;i<=4;i++){
			let json = request(searchUrl.replaceAll("{wd}",wd).replaceAll("{page}",i));
			if(typeof json=="string")json=JSON.parse(json);
			if(json && json.data ){
				let arr=dataToVods(json.data);
				if(arr)VODS=VODS.concat(arr);
				if(json.data.length<15)break;
			}
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