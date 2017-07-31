Ext.define('UX.Img', {
	extend: 'Ext.Img',
	xtype: 'ux_img',
	alternateClassName: 'ux.Img',
	getTemplate: function(){//重写Img dom成员函数
		return [
			{
				tag: 'div',
				cls: 'progress-wrapper',
				children: [
					{
						reference: 'progress', //div 名字
						tap: 'div',
						cls: 'progress'
					},
					{
						reference: 'text',
						tap: 'div',
						cls: 'progress-text'
					}
				]
			}
		]
	},
	config: {
		progress: -1,
		isUpload: 0 //判断是否上传 0: 未上传，1：已上传
	},
	updateProgress: function(v){
		if( v > 0 && v <= 100){
			this.progress.setStyle ({
				width: v + '%'
			})
			
			this.text.setHtml(v+'%')
		}else{
			this.progress.setStyle ({
				width: 0
			})
			
			this.text.setHtml('')
		}
	}
});