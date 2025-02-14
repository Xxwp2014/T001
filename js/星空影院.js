var rule = {
	title:'星空影院',
	host:'https://tedy.cc/tedy',
	url: '/tedy/fyclassfyfilter-fypage',
	//homeUrl:'https://api.web.360kan.com/v1/rank?cat=2&size=9',
    //detailUrl:'https://api.web.360kan.com/v1/detail?cat=fyclass&id=fyid',
    //searchUrl:'https://api.so.360kan.com/index?force_v=1&kw=**&from=&pageno=fypage&v_ap=1&tab=all',
    //url:'https://api.web.360kan.com/v1/filter/list?catid=fyclass&rank=rankhot&cat=&year=&area=&act=&size=35&pageno=fypage&callback=',
	
	searchUrl: '/search/?wd=**',
	searchable:2,
	quickSearch:0,
	filterable:1,
	headers:{
		'User-Agent': 'Mozilla/5.0 (Linux; Android 10; VOG-AL00 Build/HUAWEIVOG-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Mobile Chrome/66.0.3359.'
	},
	class_name:'电视剧&综艺&电影',
    class_url:'dianshiju&zhongyi&dianying',
	timeout:5000,
	play_parse:true,	
	//class_parse:'#menus&&li:gt(1);a&&Text;a&&href;.*/(.*)/',
	lazy:'js:input=input.split("?")[0];log(input);',
	limit:6,
	推荐: '*',
	一级: '.main&&.tuijian-banner&&li;a&&title;img&&src;.lzbz&&Text;.other&&Text',
	二级: {
		"title": ".ct-c&&.name&&Text;",//名称  类型
		"img": ".ct-l&&img&&src",
		"desc": ";.ct-c&&dd:eq(2)&&Text;.ct-c&&dd:eq(3)&&Text;.ct-c&&dt:eq(2)&&Text;.ct-c&&dd:eq(1)&&Text",
		"content": ".ct-c&&.desc&&Text",
		"tabs": `js:
			TABS = ["推荐线路"];
		`,
		"lists": `js:
			log(TABS);
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			LISTS = ["AAA$https://hn.bfvvs.com/play/QdJ0YYva/index.m3u8"];`,
	},
	搜索: '*',
}
