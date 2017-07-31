Ext.define('EQMS.view.Camera', {
    extend: 'Ext.Container',
    xtype: 'camera',
    config: {
		cls: 'camera-view',
		layout: 'hbox',
		defaults:{
			align: 'center'
		}
    },
	initialize:function(){
		var that = this;
		var camera = Ext.create('Ext.Button', {
			// xtype: 'button',
			ui: 'plain',
			iconCls: 'newcamera',
			//cls:'',
			width: '100px',
			height: '150px',
			text: '',
			scope: this,
			handler : function() {
				var actionSheet = Ext.create('Ext.ActionSheet',{
					hideOnMaskTap:true,
					id:'actionsheet',
					defaultType: 'button',
					style:{
						'font-size': '1.5em'
					},
				items: [
					{
						xtype:'button',
						text:'拍照',
						handler:function(){
							if(that.getItems().length >3){
								// Ext.Msg.alert('警告', '最多只能上传三张照片!', Ext.emptyFn);
								util.showMessage('最多只能上传三张照片', true);
								actionSheet.destroy();
							}else{
								navigator.camera.getPicture(
									function(url) {
										var _imgPanel = util.createImg(url, 0);
										that.add(_imgPanel);
									}, function(){
										
									}, 
									{
										quality: 50,
										destinationType: navigator.camera.DestinationType.FILE_URI
									}
								);
							}
						}
					},
					{
						xtype:'button',
						text:'上传',
						handler:function(){
							if(that.getItems().length >3){
								// Ext.Msg.alert('警告', '最多只能上传三张照片!', Ext.emptyFn);
								util.showMessage('最多只能上传三张照片', true);
								actionSheet.destroy();
							}else{
								window.imagePicker.getPictures(
									function(results) {
										for (var i = 0; i < results.length; i++) {
											//console.log('Image URI: ' + results[i]);
											var _imgPanel = util.createImg(results[i], 0);
												that.add(_imgPanel);
											}
									},
									function(error) {
										console.log('Error: ' + error);
									}, {
										maximumImagesCount: 3,
										width: 800
									}
								);
							}
						}
					},
					{
						xtype:'button',
						text:'返回',
						handler:function(){
							actionSheet.destroy();
						}
					}
				]
				});
				Ext.Viewport.add(actionSheet);
			}
		});
		
		that.add(camera);
	}
});
