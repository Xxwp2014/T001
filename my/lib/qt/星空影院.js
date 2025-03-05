
var rule = {
	title:'星空影院',
	host:'https://corsproxy.bunkum.us',
	homeUrl:'/corsproxy/?apiurl=https://tedy.cc',
	url: '/corsproxy/?apiurl=https://tedy.cc/tedy/fyclass-fypage',
    detailUrl:'fyid',
    //searchUrl:'https://api.so.360kan.com/index?force_v=1&kw=**&from=&pageno=fypage&v_ap=1&tab=all',
    //url:'https://api.web.360kan.com/v1/filter/list?catid=fyclass&rank=rankhot&cat=&year=&area=&act=&size=35&pageno=fypage&callback=',
	
	searchUrl: '/corsproxy/?apiurl=https://tedy.cc/tedy/search/?wd=**',
	searchable:2,
	quickSearch:0,
	filterable:1,
	headers:{
		'User-Agent': 'MOBILE_UA Android AppleWebKit Mobile'
	},
	class_name:'电视剧&综艺&电影',
    class_url:'dianshiju&zhongyi&dianying',
	timeout:5000,
	play_parse:true,
	//class_parse:'#menus&&li:gt(1);a&&Text;a&&href;.*/(.*)/',
	lazy:`js:
		if(input.indexOf("/teplay/")>-1){
			var linkIndex=1;
			if(TABS &&  playObj ){
				linkIndex=TABS.indexOf(playObj["flag"])+1;
			}
			if(linkIndex<1)linkIndex=1;
			var vids=input.split("/teplay/")[1].replaceAll("/","").split("-");
			input="https://corsproxy.bunkum.us/corsproxy/?apiurl=https://tedy.cc/teplay/"+vids[0]+"-"+linkIndex;
			if(vids.length>2)input=input+"-"+vids[2];
			var _html=request(input);
			var a=_html.substring(_html.indexOf("player_aaaa"));
			a=a.substring(12,a.indexOf("</script>"));
			a=JSON.parse(a)
			input={
                parse:1,
                jx:0,
                url:a.url
            };
		} 
	`,
	limit:6,
	推荐: '.main&&.tuijian-banner&&li;a&&title;img&&data-original;.lzbz&&Text;.other&&Text',
	一级: '.main&&li&&.p1;a&&title;img&&data-original;.lzbz&&Text;a&&href',
	二级访问前:`js:
		   MY_URL = 'https://corsproxy.bunkum.us/corsproxy/?apiurl=https://tedy.cc'+detailObj.detailUrl;
	`,
	二级: {
		"title": ".ct-c&&.name&&Text;",//名称  类型
		"img": ".ct-l&&img&&data-original",
		"desc": ";.ct-c&&dd:eq(2)&&Text;.ct-c&&dd:eq(3)&&Text;.ct-c&&dt:eq(2)&&Text;.ct-c&&dd:eq(1)&&Text",
		"content": ".ct-c&&.desc&&Text",
		//"tabs": "#stab1&&.playfrom&&li&&Text",
		"tabs": `js:
			TABS = [];
			let tabs = pdfa(html, '#stab1&&.playfrom&&li');
			tabs.forEach((it) => {
				let tmp=pdfh(it, "body&&Text")
				TABS.push(tmp);
			});
		`,
		"lists": `js:
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			LISTS = [];
			let i = 1;
			TABS.forEach(function(tab) {
				var d = pdfa(html, '#vlink_1&&li');
				var tmpArr=[];
				for(var i=0;i<d.length;i++){
				   var it=d[i];
				   var title = pdfh(it, 'a&&Text');
				   var burl = pd(it, 'a&&href');
				   if(burl.indexOf("8888-1")<0){
						tmpArr.push(title + '$' + burl);
				   }
				}
				 LISTS.push(tmpArr)
			});
		`
	},
	搜索: '*',
}
