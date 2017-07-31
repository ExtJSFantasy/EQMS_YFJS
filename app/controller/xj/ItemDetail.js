Ext.define('EQMS.controller.xj.ItemDetail', {
	extend: 'Ext.app.Controller',
	config: {
		refs: {
			main: 'main',
			xjItemDetail: 'xjItemDetail'
		},
		control: {
			xjItemDetail: {
				tapsave: 'saveItemDetail',
				activate: 'onActivate',
				activeitemchange: 'onActiveitemchange'
			}
		}
	},
	onActivate: function(newActiveItem, tab, oldActiveItem, eOpts){
		var xjItemDetail = this.getXjItemDetail();
		var xjItemListRecord = xjItemDetail.getXjItemListRecord();
		if(xjItemListRecord.get('isaIndication') != '是'){
			if(newActiveItem.down('numberfield') != null){
				newActiveItem.down('numberfield').hide();
			}
		}else{
			newActiveItem.down('numberfield').show();
		}
	},
	onActiveitemchange: function(tab, value, oldValue, eOpts){
		var xjItemDetail = this.getXjItemDetail();
		var xjItemListRecord = xjItemDetail.getXjItemListRecord();
		if(value != 0){
			if(xjItemListRecord.get('isaIndication') != '是'){
				if(value.down('numberfield') != null){
					value.down('numberfield').hide();
				}
			}else{
				value.down('numberfield').show();
			}
		}
	},
	saveItemDetail:function(view){
		var it = this;
		var _form = view.getActiveItem();
		var _values = _form.getValues();
	
		//校验
		var _model = Ext.create('EQMS.model.xj.ItemDetail');
		var message = '';
		
		if(util.valid(_model, _form)){
			//保存图片和数据
			this.uploadImg(view);
		}
	},
	saveData: function(view){
		var it = this;
		var _form = view.getActiveItem();
		var _values = _form.getValues();
		view.getXjItemListRecord().set("indication", _values.indication);
		view.getXjItemListRecord().set("auditResult", 'nok');
		view.getXjItemListRecord().set("solveMethod", _values.solveMethod);
		view.getXjItemListRecord().set("description", _values.description);
		view.getXjItemListRecord().set("measure", _values.measure);
		view.getXjItemListRecord().set("partNo", _values.partNo);
		view.getXjItemListRecord().set("partName", _values.partName);
		view.getXjItemListRecord().set("defectType", _values.defectType);
		view.getXjItemListRecord().set("isolation", _values.isolation);
		view.getXjItemListRecord().set("actualDisqualified", _values.actualDisqualified);
		view.getXjItemListRecord().set("station", _values.station);
		view.getXjItemListRecord().set("isNC", _values.isNC == false ? 0 : 1);
		
		it.getMain().pop();
	},
	uploadImg: function(view){
		var it = this;
		var host = util.getHost();
		var imgs = view.query('image');
		var _xjListRecord = view.getXjListRecord();
		var _xjItemListRecord = view.getXjItemListRecord();
		
		var _imgObj = new Array();
		for(var i = 0; i < imgs.length; i++){ //获取所有未上传的图片
			if(imgs[i].getIsUpload() == 0){//未上传 1：已上传
				_imgObj.push(imgs[i])
			}
		}
		if (_imgObj.length == 0) {
			it.saveData(view) ;
			return;
		}
		var img =  _imgObj[0];
		var imageURI = img.getSrc();
		var options = new FileUploadOptions();
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		options.mimeType = "multipart/form-data";
		var params = {};
		params.createUser = $userName;
		params.itemType = 'PP';
		params.fileDir = 'pp';
		params.correspondingNo = (_xjListRecord.get('subId') != '' && _xjListRecord.get('subId')  != null ? _xjListRecord.get('subId')  : 'unSave') +'-'+_xjItemListRecord.get('itemId')
		params.url  = host+'upload/pp/'; //链接地址

		options.params = params;
		
		var ft = new FileTransfer();
		
		ft.onprogress = function(progressEvent) {
			if (progressEvent.lengthComputable) {
				img.setProgress(Math.ceil(progressEvent.loaded / progressEvent.total * 100))
			}
		};
		
		ft.upload(
			imageURI,
			encodeURI(host+'lpa/upload'),  
			function(result){
				var obj = Ext.decode(result.response);
				if (obj.success == 1){
					img.setIsUpload(1);
					it.uploadImg(view);
				}else{
					Ext.toast(obj.message);
				}
			},
			function(error){
				Ext.toast('上传失败!');
				it.uploadImg(view);
			},
			options
		);
	}
});