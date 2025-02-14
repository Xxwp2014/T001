
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
	class_name:'电视剧&综艺A&电影',
    class_url:'dianshiju&zhongyi&dianying',
	timeout:5000,
	play_parse:true,
	//class_parse:'#menus&&li:gt(1);a&&Text;a&&href;.*/(.*)/',
	lazy:`js:
	
		post("https://z.watano.top/exec/Api01?render=false&test=1&type=lazy&in=",{"body":{"input":input,"data":playObj}});
	
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
			post("https://z.watano.top/exec/Api01?render=false&test=1&type=二级lists&in=",{"body":{"input":input,"html":html}});
			let tabs = pdfa(html, '#stab1&&.playfrom&&li');
			tabs.forEach((it) => {
				let tmp=pdfh(it, "body&&Text")
				request("https://z.watano.top/exec/Api01?render=false&test=1&type=二级lists&tab="+tmp);
				TABS.push(tmp);
			});
		`,
		"lists":`
			post("https://z.watano.top/exec/Api01?render=false&test=1&type=二级lists&in=",{"body":{"input":input,"TABS":TABS}});
		`,
		"list_text":"#vlink_1&&li&&a&&Text",
		"list_url":"#vlink_1&&li&&a&&href",
	},
	搜索: '*',
}
