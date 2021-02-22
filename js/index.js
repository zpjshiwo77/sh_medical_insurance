$(document).ready(function () {

	//-----------------------------------------定义和初始化变量----------------------------------------
	var loadBox = $('aside.loadBox');
	var articleBox = $('article');
	var windowScale = window.innerWidth / 750;

	//----------------------------------------页面初始化----------------------------------------
	icom.init(init);//初始化
	icom.screenScrollUnable();//如果是一屏高度项目且在ios下，阻止屏幕默认滑动行为

	function init() {
		requestAnimationFrame(function () {
			if (os.screenProp < 0.54) articleBox.addClass("screen189");
			if (os.screenProp <= 0.64 && os.screenProp >= 0.54) articleBox.addClass("screen169");
			if (os.screenProp > 0.64) articleBox.addClass("screen159");
			load_handler();
		});
		wxUser.init();
	}//edn func


	//----------------------------------------加载页面图片----------------------------------------
	function load_handler() {
		var loader = new PxLoader();
		loader.addImage('images/common/turn_phone.png');

		//实际加载进度
		//		loader.addProgressListener(function(e) {
		//			var per=Math.round(e.completedCount/e.totalCount*50);
		//			loadPer.html(per+'%');
		//		});

		loader.addCompletionListener(function () {
			icom.fadeIn(articleBox);
			pageInit();
			//			load_timer(50);//模拟加载进度
			loader = null;
		});
		loader.start();
	}//end func

	//模拟加载进度
	function load_timer(per) {
		per = per || 0;
		per += imath.randomRange(1, 3);
		per = per > 100 ? 100 : per;
		loadPer.html(per + '%');
		if (per == 100) setTimeout(pageInit, 200);
		else setTimeout(load_timer, 33, per);
	}//edn func

	//----------------------------------------页面逻辑代码----------------------------------------
	var choseBox = $('#choseBox');
	var resultBox = $('#resultBox');

	var resultScroll = new IScroll('#resultBox', {
		bounce: false,
		click: true,
	});

	var province = "请选择省份", city = "请选择城市", type = "请选择肿瘤类型", category = "请选择参保类别";
	var provinceData = null, cityData = null;

	/**
	 * 页面初始化
	 */
	function pageInit() {
		eventInit();
		// DevelopTest();
		monitor_handler();
		renderProvince();
	}//end func

	/**
	 * 开发测试使用
	 */
	function DevelopTest() {
		choseBox.hide();
		resultBox.show();

		resultScroll.refresh();
	}

	/**
	 * 事件初始化
	 */
	function eventInit() {
		$(".limitBtn").on("touchend", limitClick);

		$("#resetBtn").on("touchend", resetForm);
		$("#submitBtn").on("touchend", vefForm);
		$("#backBtn").on("click", showIndexBox);

		$("#province").on("change", renderCity);
		$("#city").on("change", changeCity);
		$("#type").on("change", changeType);
		$("#category").on("change", changeCategory);
	}

	/**
	 * 修改参保类别
	 */
	function changeCategory() {
		category = $("#category").val();
		$("#categoryVal").html(category);
	}

	/**
	 * 修改肿瘤类型
	 */
	function changeType() {
		type = $("#type").val();
		$("#typeVal").html(type);

		type == "尿路上皮癌/经典霍奇金淋巴瘤" ? $("#categorySelect").show() : $("#categorySelect").hide();
	}

	/**
	 * 修改城市
	 */
	function changeCity() {
		city = $("#city").val();

		for (let i = 0; i < provinceData.length; i++) {
			if (provinceData[i].label == city) {
				cityData = provinceData[i];
				break;
			}
		}

		$("#cityVal").html(city);
	}

	/**
	 * 渲染省份
	 */
	function renderProvince() {
		var cont = '<option value="x" disabled="disabled" selected>请选择省份</option>';
		for (var i = 0; i < costData.length; i++) {
			cont += '<option value="' + costData[i].label + '">' + costData[i].label + '</option>';
		}
		$("#province").html(cont);
	}

	/**
	 * 渲染城市
	 */
	function renderCity() {
		province = $("#province").val();

		for (let i = 0; i < costData.length; i++) {
			if (costData[i].label == province) {
				provinceData = costData[i].children;
				break;
			}
		}

		$("#provinceVal").html(province);
		city = "请选择城市";
		$("#cityVal").html(city);

		var cont = '<option value="x" disabled="disabled" selected>请选择城市</option>';
		for (var i = 0; i < provinceData.length; i++) {
			cont += '<option value="' + provinceData[i].label + '">' + provinceData[i].label + '</option>';
		}
		$("#city").html(cont);
	}

	/**
	 * 验证表单
	 */
	function vefForm() {
		if(province == "请选择省份"){
			icom.alert("请选择省份");
		}
		else if(city == "请选择城市"){
			icom.alert("请选择城市");
		}
		else if(type == "请选择肿瘤类型"){
			icom.alert("请选择肿瘤类型");
		}
		else if(type == "尿路上皮癌/经典霍奇金淋巴瘤" && category == "请选择参保类别"){
			icom.alert("请选择参保类别");
		}
		else{
			renderResultPage();
			showResultBox();
		}
	}

	/**
	 * 渲染结果页面
	 */
	function renderResultPage(){
		var title = resultBox.find(".title");
		var introBox1 = resultBox.find(".introBox1");
		var introBox2 = resultBox.find(".introBox2");
		var costBox = resultBox.find(".costBox .table");
		var costTtile = resultBox.find(".costBox .title1");
		var costTips = resultBox.find(".costBox .tips");
		var tableTtile = resultBox.find(".tableBox .title1");
		var tableBox = resultBox.find(".tableBox");
		var tableItem = resultBox.find(".row .item");
		
		if(type == "尿路上皮癌/经典霍奇金淋巴瘤"){
			title.show();
			title.find(".t1").text(city+"医保报销一览")
			title.find(".t2").text(city+"医保报销一览")

			introBox1.show();
			introBox2.hide();

			costTtile.html(category+"使用百泽安<sup>&reg;</sup>")
			costTips.show();
			costBox.html(`<div class="row">
							<div class="col">医保报销</div>
							<div class="col">${category=='城镇职工'?cityData.costR1:cityData.costR2}</div>
						</div>
						<div class="row">
							<div class="col">个人自费</div>
							<div class="col">${category=='城镇职工'?cityData.costS1:cityData.costS2}</div>
						</div>`)

			tableBox.show();
			tableTtile.html(city+"报销政策一览")
			tableItem.each(function(index,ele){
				if(index % 4 != 0) $(ele).text(cityData.detail[index - (parseInt(index / 4) + 1)])
			})
		}
		else{
			title.hide();

			introBox1.hide();
			introBox2.show();

			costTtile.html("使用百泽安<sup>&reg;</sup>")
			costTips.hide();
			costBox.html(`<div class="row">
							<div class="col">个人自费</div>
							<div class="col">${cityData.costS3}</div>
						</div>`)

			tableBox.hide();
		}
	}

	/**
	 * 重置表单
	 */
	function resetForm() {
		province = "请选择省份";
		city = "请选择城市";
		type = "请选择肿瘤类型";
		category = "请选择参保类别";
		provinceData = null;
		cityData = null;

		$("#categorySelect").hide();

		$("#provinceVal").html(province);
		$("#cityVal").html(city);
		$("#typeVal").html(type);
		$("#categoryVal").html(category);

		$("#province").val("x");
		$("#city").val("x");
		$("#type").val("x");
		$("#category").val("x");
	}

	/**
	 * 显示结果页面
	 */
	function showResultBox() {
		icom.fadeIn(resultBox)
		icom.fadeOut(choseBox)
		resultScroll.refresh()
		resultScroll.scrollTo(0, 0)
	}

	/**
	 * 显示首页面
	 */
	function showIndexBox() {
		resetForm()
		icom.fadeIn(choseBox)
		icom.fadeOut(resultBox)
	}

	/**
	 * 限制点击
	 */
	function limitClick() {
		$(".limitBtn").addClass('noPointer');
		setTimeout(function () { $(".limitBtn").removeClass('noPointer') }, 500);
	}//end func

	//----------------------------------------页面监测代码----------------------------------------
	function monitor_handler() {
		//		imonitor.add({obj:$('a.btnTest'),action:'touchstart',category:'default',label:'测试按钮'});
	}//end func
});//end ready
