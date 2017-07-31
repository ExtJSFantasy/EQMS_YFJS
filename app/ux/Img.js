Ext.define('UX.Img', {
	extend: 'Ext.Img',
	xtype: 'ux_img',
	alternateClassName: 'ux.Img',
	getTemplate: function(){//��дImg dom��Ա����
		return [
			{
				tag: 'div',
				cls: 'progress-wrapper',
				children: [
					{
						reference: 'progress', //div ����
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
		isUpload: 0 //�ж��Ƿ��ϴ� 0: δ�ϴ���1�����ϴ�
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