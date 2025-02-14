
var rule = {
	title:'星空影院',
	host:'https://corsproxy.bunkum.us',
	homeUrl:'/corsproxy/?apiurl=https://tedy.cc',
	url: '/corsproxy/?apiurl=https://tedy.cc/tedy/fyclass-fypage',
	//homeUrl:'https://api.web.360kan.com/v1/rank?cat=2&size=9',
    //detailUrl:'https://api.web.360kan.com/v1/detail?cat=fyclass&id=fyid',
    //searchUrl:'https://api.so.360kan.com/index?force_v=1&kw=**&from=&pageno=fypage&v_ap=1&tab=all',
    //url:'https://api.web.360kan.com/v1/filter/list?catid=fyclass&rank=rankhot&cat=&year=&area=&act=&size=35&pageno=fypage&callback=',
	
	searchUrl: '/corsproxy/?apiurl=https://tedy.cc/tedy/search/?wd=**',
	searchable:2,
	quickSearch:0,
	filterable:1,
	headers:{
		'User-Agent': 'MOBILE_UA Android AppleWebKit Mobile'
	},
	class_name:'电视剧&综艺C&电影',
    class_url:'dianshiju&zhongyi&dianying',
	timeout:5000,
	play_parse:true,
	//class_parse:'#menus&&li:gt(1);a&&Text;a&&href;.*/(.*)/',
	lazy:`js:
	
		post("https://z.watano.top/exec/Api01?render=false&test=1&type=lazy&in=",{"body":{"input":input}});
	
	`,
	limit:6,
	推荐: '.main&&.tuijian-banner&&li;a&&title;img&&data-original;.lzbz&&Text;.other&&Text',
	一级: '.main&&li&&.p1;a&&title;img&&data-original;.lzbz&&Text;a&&href',
	二级: {
		"title": ".ct-c&&.name&&Text;",//名称  类型
		"img": ".ct-l&&img&&src",
		"desc": ";.ct-c&&dd:eq(2)&&Text;.ct-c&&dd:eq(3)&&Text;.ct-c&&dt:eq(2)&&Text;.ct-c&&dd:eq(1)&&Text",
		"content": ".ct-c&&.desc&&Text",
		"tabs": `js:
			post("https://z.watano.top/exec/Api01?render=false&test=1&type=二级tabs&in=",{"body":{"input":input,"html":html,"data":detailObj}});
			TABS = ["推荐线路"];
		`,
		"lists": `js:
			log(TABS);
			post("https://z.watano.top/exec/Api01?render=false&test=1&type=二级lists&in=",{"body":{"input":input,"html":html}});
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			LISTS = ["AAA$https://hn.bfvvs.com/play/QdJ0YYva/index.m3u8"];`,
	},
	搜索: '*',
}
