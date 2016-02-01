//获取元素
function id(obj) {
	return document.getElementById(obj);
}

//绑定事件
function bind(obj, ev, fn) {
	if (obj.addEventListener) {
		obj.addEventListener(ev, fn, false);
	} else {
		obj.attachEvent('on' + ev, function() {
			fn.call(obj);
		});
	}
}

//获取可视区的宽高
function view() {
	return {
		w: document.documentElement.clientWidth,
		h: document.documentElement.clientHeight
	};
}

//添加class
function addClass(obj, sClass) {
	var aClass = obj.className.split(' ');
	if (!obj.className) {
		obj.className = sClass;
		return;
	}
	for (var i = 0; i < aClass.length; i++) {
		if (aClass[i] === sClass) return;
	}
	obj.className += ' ' + sClass;
}

//删除class
function removeClass(obj, sClass) {
	var aClass = obj.className.split(' ');
	if (!obj.className) return;
	for (var i = 0; i < aClass.length; i++) {
		if (aClass[i] === sClass) {
			aClass.splice(i, 1);
			obj.className = aClass.join(' ');
			break;
		}
	}
}

//设置css3前缀
function setStyle(obj, attr, value) {
	obj.style[attr] = value;
	obj.style['webkit' + attr.substring(0, 1).toUpperCase() + attr.substring(1)] = value;
	obj.style['moz' + attr.substring(0, 1).toUpperCase() + attr.substring(1)] = value;
	obj.style['ms' + attr.substring(0, 1).toUpperCase() + attr.substring(1)] = value;
	obj.style['o' + attr.substring(0, 1).toUpperCase() + attr.substring(1)] = value;
}


//加载函数
function fnLoad() {
	var iTime = new Date().getTime();
	var oW = id('welcome');
	var arr = [""];
	var bImageLoad = true;
	var bTime = false;
	var oTimer = null;
	bind(oW, "webkitTransitionEnd", end);
	bind(oW, "transitionend", end);
	oTimer = setInterval(function() {
		if (new Date().getTime() - iTime >= 5000) {
			bTime = true;
		}
		if (bImageLoad && bTime) {
			clearInterval(oTimer);
			oW.style.opacity = 0;
		}
	}, 1000);

	function end() {
		removeClass(oW, "pageShow");
		fnTab();
	}
	/*	for (var i=0; i<arr.length;i++) {
			var oImg = new Image();
			oImg.src = arr[i];
		}*/
}

//切换
function fnTab() {
	var oTab = id("tabPic");
	var oList = id("picList");
	var aNav = oTab.getElementsByTagName("nav")[0].children;
	var iNow = 0;
	var iX = 0;
	var iW = view().w;
	var oTimer = null;
	var iStartTouchX = 0;
	var iStartX = 0;
	bind(oTab, "touchstart", fnStart);
	bind(oTab, "touchmove", fnMove);
	bind(oTab, "touchend", fnEnd);
	auto();
	if(!window.BfnScore) {
		fnScore();
		window.BfnScore = true;
	}

	function auto() {
		oTimer = setInterval(function() {
			iNow++;
			iNow = iNow % aNav.length;
			tab();
		}, 3000);
	}

	function fnStart(ev) {
		setStyle(oList, 'transition', 'none');
		ev = ev.changedTouches[0];
		iStartTouchX = ev.pageX; //手指的位置
		iStartX = iX; //元素的位置
		clearInterval(oTimer);
	}

	function fnMove(ev) {
		ev = ev.changedTouches[0];
		var iDis = ev.pageX - iStartTouchX; //手指在屏幕上移动的距离
		iX = iStartX + iDis;
		setStyle(oList, 'transform', 'translateX(' + iX + 'px)');
	}

	function fnEnd() {
		iNow = iX / iW;
		iNow = -Math.round(iNow);
		if (iNow < 0) {
			iNow = 0;
		}
		if (iNow > aNav.length - 1) {
			iNow = aNav.length - 1;
		}
		tab();
		auto();
	}

	function tab() {
		iX = -iNow * iW;
		setStyle(oList, 'transition', '0.5s');
		setStyle(oList, 'transform', 'translateX(' + iX + 'px)');
		for (var i = 0; i < aNav.length; i++) {
			removeClass(aNav[i], 'active');
		}
		addClass(aNav[iNow], 'active');
	}
}

//评分
function fnScore() {
	var oScore = id("score");
	var aLi = oScore.getElementsByTagName("li");
	var arr = ["好失望", "没有想象的那么差", "很一般", "良好", "棒极了"];
	for (var i = 0; i < aLi.length; i++) {
		fn(aLi[i]);
	}

	function fn(oLi) {
		var aNav = oLi.getElementsByTagName("a");
		var oInput = oLi.getElementsByTagName("input")[0];
		for (var i = 0; i < aNav.length; i++) {
			aNav[i].index = i;
			bind(aNav[i], "touchstart", function() {
				for (var i = 0; i < aNav.length; i++) {
					if (i <= this.index) {
						addClass(aNav[i], "active");
					} else {
						removeClass(aNav[i], "active");
					}
				}
				oInput.value = arr[this.index];
			});
		}
	}
	fnIndex();
}

//提示信息
function fnInfo(oInfo,sInfo) {
	oInfo.innerHTML = sInfo;
	setStyle(oInfo,'transform','scale(1)');
	setStyle(oInfo,'opacity','1');
	setTimeout(function() {
		setStyle(oInfo,'transform','scale(0)');
		setStyle(oInfo,'opacity','0');
	},1000);
}

//验证
function fnIndex() {
	var oIndex = id("index");
	var oBtn = oIndex.getElementsByClassName("btn")[0];
	var oInfo = oIndex.getElementsByClassName("info")[0];
	var bScore = false;
	bind(oBtn,"touchend",fnEnd);
	function fnEnd() {
		bScore = fnScoreChecked();
		if (bScore) {
			if(bTag()){
				fnIndexOut();
			} else {
				fnInfo(oInfo,"给景区添加标签");
			}
		} else {
			fnInfo(oInfo,"给景区评分");
		}
	}
	function fnScoreChecked() {
		oScore = id("score");
		var aInput = oScore.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++) {
			if (aInput[i].value == 0) {
				return false;
			}
		}
		return true;
	}
	function bTag() {
		var oTag = id("indexTag");
		var aInput = oTag.getElementsByTagName("input");
		for(var i=0;i<aInput.length;i++) {
			if(aInput[i].checked) {
				return true;
			}
		}
		return false;
	}
}

function fnIndexOut() {
	var oMask =  id("mask");
	var oIndex = id("index");
	var oNews = id("news");
	addClass(oMask,"pageShow");
	addClass(oNews,"pageShow");
	fnNews();
	setTimeout(function() {
		oMask.style.opacity = 1;
		setStyle(oIndex,'filter','blur(5px)');
	},20);
	setTimeout(function() {
		setStyle(oNews,'transition','0.5s');
		oMask.style.opacity = 0;
		setStyle(oIndex,'filter','blur(0)');
		setStyle(oNews,'opacity','1');
		removeClass(oMask,"pageShow");
	},3000);
}

function fnNews() {
	var oNews = id("news");
	var oInfo = oNews.getElementsByClassName("info")[0];
	var aInput = oNews.getElementsByTagName("input");
	aInput[0].onchange = function() {
		if (this.files[0].type.split("/")[0] == "video") {
			fnNewsOut();
			this.value="";
		} else {
			fnInfo(oInfo,"请上传视频");
		}
	}
	aInput[1].onchange = function() {
		if (this.files[0].type.split("/")[0]== "image") {
			fnNewsOut();
			this.value="";
		} else {
			fnInfo(oInfo,"请上传图片");
		}
	}
}

function fnNewsOut() {
	var oNews = id("news");
	var oForm = id("form");
	addClass( oForm,"pageShow");
	oNews.style.cssText = "";
	removeClass(oNews,"pageShow");
	formIn();
}

function formIn() {
	var oForm = id("form");
	var oOver = id("over");
	var aFormTag = id("formTag").getElementsByTagName("label");
	var oBtn = oForm.getElementsByClassName("btn")[0];
	var bOff = false;
	for(var i=0;i<aFormTag.length;i++) {
		bind(aFormTag[i], "touchend", function() {
			bOff = true;
			addClass(oBtn,"submit");
		});
	}
	bind(oBtn, "touchend", function() {
		if (bOff) {
			for (var i=0;i<aFormTag.length;i++) {
				aFormTag[i].getElementsByTagName("input")[0].checked = false;
			}
			bOff = false;
			addClass(oOver,"pageShow");
			removeClass(oForm,"pageShow");
			removeClass(oBtn,"submit");
			over();
		}
	});
}

function over()
{
	var oOver=id("over");
	var oBtn=oOver.getElementsByClassName("btn")[0];
	bind(oBtn,"touchend",function()
	{
		removeClass(oOver,"pageShow");
	});
}