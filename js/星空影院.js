var rule = {
	title:'星空影院',
	host:'https://tedy.cc',
	url: '/tedy/fyclassfyfilter-fypage',
	filter_url:'{{fl.class}}',
	filter:{
		"dianshiju":[{"key":"class","name":"类型","value":[{"n":"全部","v":""},{"n":"国剧","v":"/guoju"},{"n":"日韩剧","v":"/rihanju"},{"n":"欧美剧","v":"/oumeiju"}]}]
	},
	searchUrl: '/search/?wd=**',
	searchable:2,
	quickSearch:0,
	filterable:1,
	headers:{
		'User-Agent': 'MOBILE_UA'
	},
	timeout:5000,
	play_parse:true,
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