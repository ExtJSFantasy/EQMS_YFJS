//个人资料
Ext.define('EQMS.view.Profile', {
    extend: 'Ext.Component',
    xtype: 'profile',
    config: {
        cls: 'profile',
		tpl: [
			'<img src="resources/images/cmp.png" class="blur-bg" />',
			'<div class="avatar-wrapper flexbox box-orient-v box-align-center box-pack-center">',
				'<div class="avatar big empty">',
					// '<tpl if="!Ext.isEmpty(values.AvatarHash)">',
						'<img src="resources/images/cmp.png" />',
					// '</tpl>',
				'</div>',
				'<div class="name">{userDescription}</div>',
			'</div>'
		].join('')
    }
});