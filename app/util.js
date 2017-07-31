//公用类
Ext.define('EQMS.util', {
    alternateClassName: 'util',   
	singleton: true,
	//以下每个config会自动有apply和update方法
    config: {
        // unReadNum: null,

        host: null //帐套
        // animation: null, //切换动画
        // openlink: null, //打开超链接方式 
        // receivepush: null, //是否接收推送通知
        // exitreceive: null, //退出后是否接受推送通知
        // imgupdpi: null, //上传图片质量,
        // loadimg: null, //图片加载模式
        // debug: null //调试开关
    },
	constructor: function(config) {
        this.callParent(arguments);
	},
	readSettings: function() {//读取设置
		// console.log("readSettings");
        var def = {
            host: (this.isWeb ? '../' : '') //帐套
            // animation: Ext.os.is.iOS ? 1 : 0, //动画
            // receivepush: 1, //接收消息通知
            // exitreceive: 1, //退出后仍接收消息通知
            // rempsw: 1, //记住密码
            // openlink: '_blank', //'_blank'为内置浏览器, '_system'为外置浏览器
            // imgupdpi: 'hdpi', //上传图片质量
            // loadimg: 2 //加载图片 智能模式
        };
        var settings = this.getLsItem('settings'),
        	setting = {};
        if (!Ext.isEmpty(settings)) {
            setting = Ext.decode(settings);
        }
        // setting.debug = this.getLsItem('debug') || 0; //调试开关
        setting = Ext.applyIf(setting, def);
        this.writeSettings(setting);
        return setting;
    },
    writeSettings: function(settings) { //保存设置
        var st = Ext.clone(settings);
        // this.setLsItem('debug', st.debug || 0);
        // delete st.debug;
        this.setLsItem('settings', Ext.encode(st));
    },
    changeSetting: function(key, value) { //更改某些设置并保存
        var prop = key;
        if (typeof key == 'string') {
            prop = {};
            prop[key] = value;
        }
        var settings = this.readSettings();
        for (var i in prop) {
            settings[i] = prop[i];
        }
        this.writeSettings(settings);

        this.applySettings(prop);
    },
    applySettings: function(settings) {
        for (var i in settings) {
            var name = 'set' + Ext.String.capitalize(i);
            if (this[name]) this[name](settings[i]);
        }
    },
	isWeb: location.href.indexOf('http') == 0 && location.href.indexOf('localhost') < 0,
	updateHost: function(host, oldHost) {
        if (Ext.isEmpty(host)) return;

        var me = this,
            host = me.getHost();

        //me.clearCookie();
        //me.setCookie(me.getClientInfo());
        //改变每个store.proxy.url
        Ext.StoreManager.each(function(store) {
			// console.log(store.getMethod());
			//console.log("store",store.getStoreId());
			if(store.getStoreId() == 'calendar' ){
				return;
			}
            if (store.getMethod()) {
                var invokeTarget = store.getMethod(),
                    invokeUrl = host + invokeTarget,
                    proxy;
					// console.log(invokeUrl);
                if(store.getServerProxy) proxy = store.getServerProxy();
                else if(store.getProxy) proxy = store.getProxy();
				//console.log(invokeUrl);
                proxy.setUrl(invokeUrl);
            }
        });
    },
	formatHost: function(value){
        if (value.length > 0 && value.substr(value.length - 1, 1) != '/')
            value += '/';
        if (value.length > 0 && !/^(http|https):\/\//i.test(value))
            value = 'http://' + value;
        return value;
    },
	
	getApplication: function(){
        return EQMS.app;
    },
    getAppName: function(){
        return this.getApplication().getName();
    },
	/****************************LocalStorage操作********************************/
	/**
     * 获取localStorage存储的key，前面加上MES-
     * @param  {String} key 原始key
     * @return {String}     前面加了MES-的key
     */
    getLsKey: function(key){
        if(Ext.isEmpty(key)) return '';
        return this.getAppName() + '-' + key;
    },
	/**
     * 根据key获取localStorage的值
     * @param  {String} key 键
     * @return {String}     值
     */
    getLsItem: function(key){
        return localStorage.getItem(this.getLsKey(key));
    },
    /**
     * 根据key获取localStorage的值
     * @param  {String} key 键
     * @param  {String} value 值
     */
    setLsItem: function(key, value){
        localStorage.setItem(this.getLsKey(key), value);
    },
    /**
     * 根据key移除localStorage的值
     * @param  {String} key 键
     */
    removeLsItem: function(key){
        localStorage.removeItem(this.getLsKey(key));
    },
	
	//加载stroe
	storeLoad: function (list, params, callback) {
		var store = list.getStore();
		if (params) {
			var oldParams = store.getProxy().getExtraParams();
			if (!this.equals(oldParams, params)) {
				store.setProxy({
					extraParams: params
				});
				// store.load();
			} else {
				return;
			}
		} else if (store.getCount() > 0) {
			return
		}
		store.loadPage(1, {
			callback: function (records, operation, success) {
				if (records.length == 0) {
					list.setEmptyText('没有获取到内容');
				}
				if(callback){
					callback(records, operation, success)
				}
			},
			scope: this
		});
	},
	//list->info公用加载方法
	recordLoad: function (record, view, url, params, ckName) {
		if (record.get(ckName)) {
			view.setRecord(record);
			return;
		}
		Ext.Ajax.request({
			url: url,
			params: params,
			success: function (result, request) {
				result = Ext.decode(result.responseText);
				record.set(result);
				view.setRecord(record);
			}
		});
	},
	//保存单个数据
	saveRecord: function (from, store, model, id, me) {
		if (this.valid(model, from)) {
			model.save({
				success: function (a, b) {
					if (b.getAction() == 'create') {
						model.set(id, b.getResultSet().getMessage());
						store.add(model);
						// util.showMessage('添加成功', true);
						Ext.toast('添加成功!');
					} else {
						//防止新增后再修改list不能及时更新
						var values = from.getValues();
						for (var item in values) {
							model.set(item, values[item]);
						}
						// util.showMessage('修改成功', true);
						Ext.toast('修改成功!');
					}
					me.redirectTo('redirect');
				},
				failure: function (a, b) {
					// util.showMessage('操作失败', true);
					Ext.toast('操作失败!');
				}
			},
		this);
		}
	},
	//删除列表
	deleteRecord: function (list, items, params) {
		var store = list.getStore();
		Ext.Ajax.request({
			url: store.getDestroyUrl(),
			params: params,
			success: function (result, request) {
				result = Ext.decode(result.responseText);
				if (result.success) {
					for (var i = 0,
				ln = items.length; i < ln; i++) {
						store.remove(items[i]);
					}
					// util.showMessage('删除成功', true);
					Ext.toast('删除成功!');
				} else {
					// util.showMessage(result.message, true);
					Ext.toast(result.message);
				}
			}
		});
	},
	//验证模型
	valid: function (model, from) {
		from.updateRecord(model);
		var me = this,
		errors = model.validate(),
		valid = errors.isValid();
		if (!valid) {
			errors.each(function (err) {
				// me.showMessage(err.getMessage(), true);
				Ext.toast(err.getMessage());
				return false;
			});
		}
		return valid;
	},
	//Viewport添加新项,Viewport之中始终只有一项
	ePush: function (xtype) {
		var me = Ext.Viewport,
		view = me.getActiveItem();
		if (view && view.getItemId() == xtype) {
			return;
		}
		view = Ext.create(xtype, {
			itemId: xtype
		});
		//切换
		me.animateActiveItem(view, {
			type: 'slide',
			direction: 'left'
		});
	},
	//监控Viewport界面切换,切换时销毁旧项(需要初始化)
	eActiveitemchange: function () {
		var me = Ext.Viewport;
		me.onAfter('activeitemchange',
		function (t, value, oldValue, eOpts) {
			if (oldValue) {
				//强制销毁，防止销毁不完全引发错误
				me.remove(oldValue, true);
			}
		});
	},
	/*为Ext.Viewport添加一个消息提示组件(需要初始化)*/
	addMessage: function () {
		Ext.Viewport.setMasked({
			xtype: 'loadmask',
			cls: 'message',
			transparent: false,
			indicator: true
		});
		this.hideMessage();
	},
	/*显示一个消息提示*/
	showMessage: function (mes, autoHide) {
		var me = this,
		message = me.getMessage();
		message.setMessage(mes);
		message.show();
		//是否自动关闭提示
		if (autoHide) {
			setTimeout(function () {
				message.hide();
			},
			1000);
		}
	},
	/*隐藏消息提示*/
	hideMessage: function () {
		this.getMessage().hide();
	},
	//消息组件
	getMessage: function () {
		return Ext.Viewport.getMasked();
	},
	//比较两个对象是否相等
	equals: function (x, y) {
		if (x === y) {
			return true;
		}
		if (!(x instanceof Object) || !(y instanceof Object)) {
			return false;
		}
		if (x.constructor !== y.constructor) {
			return false;
		}
		for (var p in x) {
			if (x.hasOwnProperty(p)) {
				if (!y.hasOwnProperty(p)) {
					return false;
				}
				if (x[p] === y[p]) {
					continue;
				}
				if (typeof (x[p]) !== "object") {
					return false;
				}
				if (!Object.equals(x[p], y[p])) {
					return false;
				}
			}
		}
		for (p in y) {
			if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
				return false;
			}
		}
		return true;
	},
	//json数据转换成xml数据
	iterateJson: function (json) {
		var value = '',
		arr = [];
		for (var tag in json) {
			value = json[tag];
			if (Ext.isObject(value) || Ext.isArray(value)) {
				value = this.iterateJson(value);
			}
			if (tag > -1) {
				arr.push(value);
			} else if (value != null && value != '') {
				arr.push(this.format('<{0}>{1}</{0}>', tag, value));
			}
		}
		return arr.join('');
	},
	//格式化字符串
	format: function () {
		return Ext.util.Format.format.apply(this, arguments);
	},
	//选择文件
	openFileSelector: function (url, source, destinationType, mediaType) {
		util.tmpUrl = url;
		/*
		*文件选择方式
		*navigator.camera.PictureSourceType.PHOTOLIBRARY：从文件夹中选取 0
		*navigator.camera.PictureSourceType.CAMERA:调用摄像头          1
		*navigator.camera.PictureSourceType.SAVEDPHOTOALBUM ：不明     2
		*/
		source = source || 0; // navigator.camera.PictureSourceType.CAMERA;
		/*
		*文件返回格式
		*navigator.camera.DestinationType.DATA_URL：64位字符串      0
		*navigator.camera.DestinationType.FILE_URI:返回文件路径     1
		*navigator.camera.DestinationType.NATIVE_URI：返回系统路径  2 iOS：eg. assets-library://  Android： content://
		*/
		destinationType = destinationType || 0;
		/*
		*媒体类型
		*navigator.camera.MediaType.PICTURE：图片                    0
		*navigator.camera.MediaType.VIDEO:视频 始终返回FILE_URI格式  1 
		*navigator.camera.MediaType.ALLMEDIA：支持任意文件选择       2
		*/
		mediaType = mediaType || 0;
		var options = {
			//图像质量[0-100]
			quality: 50,
			destinationType: destinationType,
			sourceType: source,
			mediaType: mediaType
		};
		var uploadFile = destinationType == 0 ? this.uploadData : this.uploadFile;
		navigator.camera.getPicture(uploadFile, this.uploadBroken, options);
	},
	//文件选择失败 
	uploadBroken: function (message) {
		// util.showMessage(message, true);
		Ext.toast(message);
	},
	//以文件流模式上传
	uploadData: function (data) {
		util.showMessage('正在上传中,请等待...');
		// Ext.toast('正在上传中,请等待...');
		Ext.Ajax.request({
			url: util.tmpUrl,
			hidMessage: true,
			params: {
				img: data
			},
			success: util.uploadSuccess,
			failure: util.uploadFailed
		});
	},
	//以文件模式上传
	uploadFile: function (data) {
		var options = new FileUploadOptions();
		options.fileKey = "img";
		options.fileName = data.substr(data.lastIndexOf('/') + 1);
		options.mimeType = "multipart/form-data";
		options.chunkedMode = false;

		var ft = new FileTransfer();
		var uploadUrl = encodeURI(util.tmpUrl);
		ft.upload(data, uploadUrl, util.uploadSuccess, util.uploadFailed, options);
	},
	//文件上传成功
	uploadSuccess: function (r) {
		// util.showMessage('上传成功！', true);
		Ext.toast('上传成功！');
		//文件模式返回字段是r.response，文件流返回字段是r.responseText
	},
	//文件上传失败
	uploadFailed: function (error) {
		// util.showMessage('上传失败！', true);
		Ext.toast('上传失败！');
	},
	//显示pick
	showPick: function (xtype, params) {
		var pick = Ext.create(xtype);
		Ext.Viewport.add(pick);
		pick.show(params);
	},
	//结束pick
	endPick: function (xtype) {
		var pick = Ext.Viewport.down(xtype);
		if (pick) {
			pick.endPick();
		}
	},
	//重写ajax(需要初始化)
	overrideAjax: function () {
		var me = this;
		//开始加载
		Ext.Ajax.on('beforerequest',
		function (connection, options) {
			if (!options.hidMessage) {
				me.showMessage('正在努力加载中...');
				// Ext.toast('正在努力加载中...');
			}
		});
		//加载成功
		Ext.Ajax.on('requestcomplete',
		function (connection, options) {
			me.hideMessage();
		});
		//加载失败
		Ext.Ajax.on('requestexception',
		function (connection, options) {
			if (!options.hidMessage) {
				me.hideMessage();
				// me.showMessage('加载失败，请检查网络是否正常...', true);
				Ext.toast('加载失败，请检查网络是否正常...');
			}
		});
	},
	//重写list(需要初始化)
	overrideList: function () {
		//重写分页插件
		Ext.define("Ext.zh.plugin.ListPaging", {
			override: "Ext.plugin.ListPaging",
			config: {
				//自动加载
				autoPaging: true,
				//滚动到最底部时是否自动加载下一页数据
				noMoreRecordsText: '没有更多内容了',
				loadMoreText: '加载更多...' //加载更多按钮显示内容
			}
		});
		//重写下拉刷新
		Ext.define("Ext.zh.plugin.PullRefresh", {
			override: "Ext.plugin.PullRefresh",
			config: {
				lastUpdatedText: '上次刷新时间：',
				loadedText: '等一会再刷新吧...',
				loadingText: '加载中...',
				pullText: '下拉可以手动刷新',
				releaseText: '松开可以刷新',
				lastUpdatedDateFormat: 'Y-m-d H:i'
			}
		});
		//重写List
		Ext.define("Ext.zh.List", {
			override: "Ext.List",
			config: {
				//取消选择效果
				// selectedCls: '',
				//禁用加载遮罩，防止跳转时页面卡顿，使用统一的遮罩效果
				loadingText: false,
				cls: 'list',
				deferEmptyText: false,
				emptyText: '没有更多内容了'
			}
		});
	},
	createImg: function(imgUrl, isUpload){
		var it = this;
		var _img = Ext.create('UX.Img',{
			width: 100,
			height: 115,
			margin: '0 0 0 .9em',
			itemId: 'imageValue',
			src: imgUrl,
			listeners : {
				 tap: function() {
				 	//点击之后放大到全屏
					Ext.Viewport.add({
						xtype: "imgviewer",
						src: this.getSrc()
					});
				 }
			}
		});
		_img.setIsUpload(isUpload);
		var _delBtn = Ext.create('Ext.Button',{
			text : '',
			ui : 'plain',
			cls: 'delBtn',
			iconCls: 'cancel-circle',
			handler: function() {
				Ext.Msg.confirm( '提示', '是否确认删除？', function(buttonId, value ,opt){
					if(buttonId == 'yes'){
						if(_img.getIsUpload() == 1){
							var _imgUrl = _img.getSrc();
							// console.log(_sql1);
							var _params1 = {
								imgUrl : _imgUrl
							};
							var url = 'lpa/execute';
							util.myAjax(url, _params1, function(response, request){
								var _data = Ext.decode(response.responseText);
								if(_data.success == 1){
									// util.showMessage('图片已删除', true);
									Ext.toast('图片已删除!');
									_imgPanel.destroy();
								}else{
									// util.showMessage('图片删除异常', true);
									Ext.toast('图片删除异常!');
								}
							});
						}else{
							_imgPanel.destroy();
						}
					}
				});
			}
		});
		
		var _imgPanel = Ext.create('Ext.Container',{
			items:[_delBtn, _img]
		});
		
		return _imgPanel
	},
	/*
	ajax连接 grails
	参数: 	
		url:grails返回数据的路径
		params:url所要的参数
		success:成功后的回调函数
	*/
	myAjax:function (url,params,success){
		console.log("**************test******************");
		Ext.Ajax.request({
			disableCaching: false,
			useDefaultXhrHeader: false,
			url: this.getHost() + url,
			params:params,
			callback: function(options, success, response) {
				
			},
			success: function(response, request) {
				var _data = Ext.decode(response.responseText);
				if(_data.success == '0'){
					// util.showMessage('服务器异常', true);
					Ext.toast('后台异常，请联系管理员!');
				}else{
					success(response, request);
				}
			},
			failure: function(response, opts) {
				// if(response.status == '500'){
					// util.showMessage('网络异常，服务器连接失败，请联系管理员！', true);
					Ext.toast('加载失败，请检查网络是否正常...');
				// }else{
					// util.showMessage('网络异常，服务器连接失败', true);
				// }
			}
		});
	},
	dateToString:function (date){
		var year = date.getFullYear();
		var month = (date.getMonth()+1)<10 ? '0'+(date.getMonth()+1) : (date.getMonth()+1);
		var day = (date.getDate())<10 ? '0'+date.getDate() : date.getDate();
		
		var dateString = year  + "-" + month  + "-" + day ;
		return dateString;
	},
	mergeObject:function(des, src, override){//两个对象拼接成一个对象
	   // if(src instanceof Array){
		   // for(var i = 0, len = src.length; i < len; i++){
			   // this.mergeObject(des, src[i], override);
		   // }
	   // }
	   // for( var i in src){
		   // if(override || !(i in des)){
			   // des[i] = src[i];
		   // }
	   // } 
	   if(src instanceof Array){
			for(var i = 0, len = src.length; i < len; i++){
				for(var tem in src[i]){
					des[tem] = src[i][tem];
				}
			}
	   }
	   return des;
	},
	makeSaveXml:function (string, amp, lt, gt, quot, apos, cr) {
		if (string == null) return "";
		string =  new String(string);
		var a = {
			_$amp : "&amp;",
			_$lt : "&lt;",
			_$gt : "&gt;",
			_$quot : "&quot;",
			_$apos : "&apos;",
			_$39 : "&#39;",
			_$escapedCR : "&#x000D;",
			_RE_amp : /&/g,
			_RE_lt : /</g,
			_RE_gt : />/g,
			_RE_cr : /\r/g
		};
		// alert(string);
		String._singleQuoteRegex = new RegExp("'", "g");
		String._doubleQuoteRegex = new RegExp("\"", "g");
		if (amp != false) string = string.replace(a._RE_amp, a._$amp);
		if (lt != false) string = string.replace(a._RE_lt, a._$lt);
		if (gt != false) string = string.replace(a._RE_gt, a._$gt);
		if (quot != false) string = string.replace(String._doubleQuoteRegex, a._$quot);
		if (apos != false) string = string.replace(String._singleQuoteRegex, a._$apos);
		if (cr != false) string = string.replace(a._RE_cr, a._$escapedCR);
		return string;
	},
	toXmlForDataFilters:function (data) {//.fields
		var it = this;
		var arr = [], str = "";
		// for (var i = 0; i < fields.length; i++) {
			// str = str + fields[i];
		// }
		var xml = "'<items>";
		for (var i = 0; i < data.length; i++) {
			var obj = data[i];
			var s = "<item>";
			for (var name in obj) {
				// if (str.match(name)) {
					var text = obj[name];
					//console.log(isc.isAn.Date(text))
					// if (isc.isAn.Date(text)) {
						// s = s + "<" + name + ">" + text.toSerializeableDate() + "</" + name + ">";
					// } else {
					if(text instanceof Date){
						s = s + "<" + name + ">" + it.makeSaveXml(Ext.Date.format(text, "Y-m-d H:i:s")) + "</" + name + ">";
					}else{
						s = s + "<" + name + ">" + it.makeSaveXml(text) + "</" + name + ">";
					}
					// }
				// }
			}
			xml = xml + s + "</item>";
		}
		;
		xml = xml + "</items>'";
		return (xml);
	},
	overrideChinese:function(){
		if ((navigator.language || navigator.systemLanguage || navigator.userLanguage).split('-')[0] === 'zh') {
			Ext.Date.dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
			Ext.Date.monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
			Ext.Date.monthNumbers = {
				'Jan': 0,
				'Feb': 1,
				'Mar': 2,
				'Apr': 3,
				'May': 4,
				'Jun': 5,
				'Jul': 6,
				'Aug': 7,
				'Sep': 8,
				'Oct': 9,
				'Nov': 10,
				'Dec': 11
			};
			Ext.Date.getShortMonthName = function(month) {
				var n = Ext.Date.monthNames[month];
				return n.substr(0, n.length - 1);
			};
			Ext.Date.getShortDayName = function(day) {
				return Ext.Date.dayNames[day].substr(1, 1);
			};
			Ext.Date.getMonthNumber = function(name) {
				return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
			};
			Ext.Date.parseCodes.S.s = '(?:st|nd|rd|th)';
			if (Ext.picker) {
				if (Ext.picker.Picker) {
					var config = Ext.picker.Picker.prototype.config;
					config.doneButton = '完成';
					config.cancelButton = '取消';
				}
				if (Ext.picker.Date) {
					var config = Ext.picker.Date.prototype.config;
					config.doneButton = '完成';
					config.cancelButton = '取消';
					config.dayText = '日';
					config.monthText = '月';
					config.yearText = '年';
					config.slotOrder = ['year', 'month', 'day'];
				}
			}
			if (Ext.NestedList) {
				var config = Ext.NestedList.prototype.config;
				config.backText = '返回';
				config.loadingText = '加载中...';
				config.emptyText = '没有数据';
			}
			if (Ext.util.Format) {
				Ext.util.Format.defaultDateFormat = 'Y-m-d';
			}
			if (Ext.MessageBox) {
				var msg = Ext.MessageBox;
				msg.OK.text = '确定';
				msg.CANCEL.text = '取消';
				msg.YES.text = '是';
				msg.NO.text = '否';
				msg.OKCANCEL[0].text = '取消';
				msg.OKCANCEL[1].text = '确定';
				msg.YESNOCANCEL[0].text = '取消';
				msg.YESNOCANCEL[1].text = '否';
				msg.YESNOCANCEL[2].text = '是';
				msg.YESNO[0].text = '否';
				msg.YESNO[1].text = '是';
			}
			// if (Ext.dataview.DataView) {
				// var config = Ext.dataview.DataView.prototype.config;
				// config.loadingText = '加载中...';
				// config.emptyText = '没有数据';
			// }
			if (Ext.ProgressIndicator) {
				var config = Ext.ProgressIndicator.prototype.config;
				config.loadingText = {
					any: '加载: {percent}%',
					upload: '上传: {percent}%',
					download: '下载: {percent}%'
				};
				config.fallbackText = {
					any: '加载中',
					upload: '上传中',
					download: '下载中'
				};
			}
		}
	},
	overrideBack:function(){
		document.addEventListener("deviceready", onDeviceReady, false);

		function onDeviceReady() {
			document.addEventListener("backbutton", onBackKeyDown, false);
		}

		function onBackKeyDown() {
			var canPop = false;
			var id = Ext.Viewport.getActiveItem().id;
			console.log("id",id);
			if (id.indexOf("login") != -1) {
			} else if (id.indexOf("main") != -1) {
				var mainview = Ext.Viewport.getActiveItem();
				var length = mainview.getItems().length;
				if (length > 2) {
					canPop = true;
				}
			}
			if (canPop) {
				// Ext.app.Application.getController("Home").pop(1);
				//返回上一级
					//var itemListView = Ext.Viewport.getActiveItem();
					//if(Ext.Viewport.getActiveItem().getItems().length >3){
						/*if(Ext.Viewport.getActiveItem().getItems().length == 4){
							var _itemId2 = Ext.Viewport.getActiveItem().getItems().items[4].getItemId();
							if(_itemId2.indexOf("itemDetail") != -1){
								console.log(79876543);
								console.log("xian",Ext.ComponentQuery.query('#actionsheet')[0]);
								if(!Ext.ComponentQuery.query('#actionsheet')[0].getHidden()){
									console.log('79876543',Ext.ComponentQuery.query('#actionsheet')[0].getHidden());
									Ext.ComponentQuery.query('#actionsheet')[0].destroy();
								}
							}
						}*/
						//控制清单界面
						/*var itemListView = Ext.Viewport.getActiveItem().getItems().items[3];
						var _itemId = Ext.Viewport.getActiveItem().getItems().items[3].getItemId();
						if(_itemId.indexOf("itemList") != -1){
							var _createDate = itemListView.getLpaListRecord().get('createDate');
							if(!_createDate){
								Ext.Msg.confirm( '提示', '数据没有提交，是否确认返回？', function(buttonId, value ,opt){
								if(buttonId == 'yes'){
									Ext.Viewport.getActiveItem().pop();
								}
								});
							}else{
								Ext.Viewport.getActiveItem().pop();
							}
						}

					}else{
						Ext.Viewport.getActiveItem().pop();
					}*/
				
			} else {
				Ext.Msg.confirm("提示", "您确定要退出应用吗?", function(e) {
				if (e == "yes") {
					navigator.app.exitApp();
				}
				}, this);
			}
		}
	},
	//读取内置帐套列表
    readInitialServers: function(){
        if (!util.isWeb && Ext.isArray(Config.initialServers)){
            var store = Ext.create("EQMS.store.Hosts", {
                storeId: "Hosts"
            });
            Ext.each(Config.initialServers, function(obj) {
                //debugger
                if (obj.isdemo) {
                    util._demo = obj;
                }
                else if (!Ext.isEmpty(obj.host)) {
                    store.addHost(obj.host);
                }
            });

            //应用demo账套默认的地址、用户名和密码
            if (Ext.isEmpty(util.getLsItem('usersign'))) {
                var _demo = util._demo;
                if (_demo) {
                    if (Ext.isEmpty(util.getHost()) && _demo.host) {
                        util.changeSetting('host', _demo.host); //默认host
                    }
                    if (_demo.usersign) {
                        util.setLsItem('usersign', _demo.usersign);
                    }
                    if (_demo.password) {
                        util.setLsItem('password', _demo.password);
                    }
                }
            }
        }
    },
	/****************************消息提示********************************/
    JsErrMsg: function(msg) {
        var m = (msg || '').replace(/(?:<style.*?>)((\n|\r|.)*?)(?:<\/style>)/ig, "");
        if (!Ext.isEmpty(m)) Ext.Msg.alert('系统提示', m);
    },
    JsConfirm: function(msg, handle) {
        Ext.Msg.confirm('系统提示', msg, function(btn) { if (btn == 'yes' && handle != null) { handle(); }; });
    },
    ToastShort: function(msg) {
        if(!Ext.isEmpty(msg)) MX.device.Toast.shortshow(msg);
    },
    ToastLong: function(msg) {
        if(!Ext.isEmpty(msg)) MX.device.Toast.longshow(msg);
    },
	/**
     * 动态添加插件
     * @param {Ext.Component} cmp 要添加plugins的控件
     * @param {Array} plugins 插件数组，或者单个插件
     */
    addPlugins: function(cmp, plugins){
        var ps = cmp.getPlugins(),
            toAdds = Ext.isArray(plugins) ? plugins : [plugins];
        if (!ps)
            cmp.setPlugins(toAdds);
        else {
            Ext.each(toAdds, function(p){
                if(!(p instanceof Ext.Base)) {
                    p = Ext.factory(p, 'Ext.plugin.Plugin', null, 'plugin');
                }
                ps.push(p);
                p.init(cmp);
            });
        }
    },
	otherTricks: function(){
		var VEl = Ext.Viewport.element,
            size = VEl.getSize();
        this.viewWidth = Math.min(size.width, size.height);
        this.viewHeight = Math.max(size.width, size.height);
	},
	//扫码
	qrcodeScan: function(callback){
		cordova.plugins.barcodeScanner.scan(
			function (result) {
				if (result.cancelled) return;
				callback(result.text);
			},
			function (error) {
				Ext.toast("扫码失败: " + error);
			},
			{
				"preferFrontCamera" : false, // iOS and Android
				"showFlipCameraButton" : true, // iOS and Android
				"prompt" : "请将二维码/条码放入框内，即可自动扫描", // supported on Android only
				"formats" : "QR_CODE,PDF_417,CODE_39,CODE_128", // default: all but PDF_417 and RSS_EXPANDED
				"orientation" : "" // Android only (portrait|landscape), default unset so it rotates with the device
			}
		);
	},
	//生产二维码
	qrcodeEncode: function(code){
		cordova.plugins.barcodeScanner.encode(
			cordova.plugins.barcodeScanner.Encode.TEXT_TYPE,
			code,
			function(success) {
				//console.log('test');
			}, function(fail) {
				Ext.toast(fail);
			}
		);
	},
	/**
	 * [updateAndroid android更新]
	 * @param  {[type]} slient  [是否自动更新]
	 * @param  {[type]} success [description]
	 * @param  {[type]} failure [description]
	 * @return {[type]}         [description]
	 */
	updateAndroid:function(slient){
        	plugins.update.updateApp(Config.upgradeUrl, function(r){
            //if(success)success.call(null, r);
            //手动更新才走这里
            if (r == 0 && !slient) {
                Ext.toast('已经是最新版本.',5000);
            }
    	}, function(r){
    		//console.log('r',r);
    	} || Ext.emptyFn);
    },
	//app初始化执行
	inIt: function () {
		this.overrideList();
		this.overrideAjax();
		this.addMessage();
		// this.overridePick();
		this.overrideChinese();
		this.overrideBack();
		this.otherTricks(); //一些其他设置
		this.applySettings(this.readSettings()); //读取并应用设置
		this.readInitialServers();
	}
});