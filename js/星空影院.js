var rule = {
	title:'�ǿ�ӰԺ',
	host:'https://tedy.cc',
	url: '/tedy/fyclassfyfilter-fypage',
	filter_url:'{{fl.class}}',
	filter:{
		"dianshiju":[{"key":"class","name":"����","value":[{"n":"ȫ��","v":""},{"n":"����","v":"/guoju"},{"n":"�պ���","v":"/rihanju"},{"n":"ŷ����","v":"/oumeiju"}]}]
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
	�Ƽ�: '*',
	һ��: '.main&&.tuijian-banner&&li;a&&title;img&&src;.lzbz&&Text;.other&&Text',
	����: {
		"title": ".ct-c&&.name&&Text;",//����  ����
		"img": ".ct-l&&img&&src",
		"desc": ";.ct-c&&dd:eq(2)&&Text;.ct-c&&dd:eq(3)&&Text;.ct-c&&dt:eq(2)&&Text;.ct-c&&dd:eq(1)&&Text",
		"content": ".ct-c&&.desc&&Text",
		"tabs": `js:
			TABS = ["�Ƽ���·"];
		`,
		"lists": `js:
			log(TABS);
			pdfh=jsp.pdfh;pdfa=jsp.pdfa;pd=jsp.pd;
			LISTS = ["AAA$https://hn.bfvvs.com/play/QdJ0YYva/index.m3u8"];`,
	},
	����: '*',
}