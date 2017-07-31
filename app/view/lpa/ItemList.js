Ext.define('EQMS.view.lpa.ItemList', {
	extend: 'Ext.List',
    xtype: 'itemList',
    requires: [
        'Ext.TitleBar',
		'UX.plugin.ListOptions',
		'EQMS.view.lpa.ItemDetail',
		'Ext.form.FieldSet',
		'Ext.form.Select'
    ],
    config: {
		title : '审核清单',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		cls: 'itemList-view',
		navBtns: [
			{
				action: 'commit',
				text: '提交',
				itemId: 'commit',
				align: 'right',
				style:{
				    'background': 'rgb(193, 196, 218)',
					'border-radius': '.7em',
				    'width': '4em',
					'height': '2.3em',
					'padding': '.2em'
				},
				listeners:{
					/*tap:function(btn){
						btn.setText('提交中...');
						btn.setDisabled(true);
						var st = setTimeout(function() {
							btn.setText('提交');
							btn.setDisabled(false);
						}, 5000);
						clearTimeout(st);
					}*/
				}
			}
		],
		lpaListRecord: null,
		isSave: 0,
        items: [
			{
				xtype : 'fieldset',
				id:'fd',
				docked : 'top',
				items:[
					{
						xtype: 'textfield',
						name: 'machine',
						label: '',
						hidden:true,
						id: 'molding',
						placeHolder: '选择机器',
						disabled:true, 
						listeners:{
						    initialize:function(tf, eOpts){
						    	//假数据,此处请求数据
						    	/*var  jsonData = [
								    {text1: 'First Option',  molding: 'iso236',  sex: 'm'},
								    {text1: 'Second Option', molding: 'iso789', sex: 'm'},
								    {text1: 'Third Option',  molding: 'iso946',  sex: 'm'}
							   ];*/
							   /*var _params1 = {
									lineName:"注塑"
								};
								var url = 'lpa/getStationByLinename';
								util.myAjax(url, _params1, function(response, request) {
									 _data = Ext.decode(response.responseText).data;
									 _size = Ext.decode(response.responseText).totalCounts+1;
									 console.log(54353545);
									 //赋值
						    		sf.setOptions(_data);
								});*/

								this.element.on({  
					                tap : function(com, e, eOpts) {
					                	console.log(809768676876);
					                	var _item = [];
					                	var _values = '';
					                	var _params1 = {
											lineName:"注塑"
										};
										var url = 'lpa/getStationByLinename';
										util.myAjax(url, _params1, function(response, request) {
											 _data = Ext.decode(response.responseText).data;
											 console.log("_data",_data);
											 _size = Ext.decode(response.responseText).totalCounts+1;
											 console.log(54353545);
											for(var i = 0;i < _size;i++){
												if(i==_size-1){
													button={
														xtype:'button',
														text:'确定',
														handler:function(at){
															//s=s.Substring(0,s.Length-1)
															console.log("at",at.getParent());
															var _machinepanel = Ext.ComponentQuery.query("formpanel[id='machinepanel']")[0];
															var _size = _machinepanel.items.items.length-1;
															for(var k=0;k < _size;k++){
																if(_machinepanel.items.items[k].getChecked()){
																	_values = _values+_machinepanel.items.items[k].getValue()+',';
																}
															}
															if(_values.length > 0){
																tf.setValue(_values.substr(0,_values.length-1));
																_login.destroy();
															}
															if(_values.length == 0){
																tf.setValue('');
																_login.destroy();
															}
															// else{
															// 		Ext.toast('请选择工位！');
															// 	}
															}
														}
												}
												var _arr=[];
												    _arr = Ext.ComponentQuery.query("textfield[id='molding']")[0].getValue().split(',');
												if(i< _size - 1){
													button={
														xtype:'checkboxfield',
														name : ''+_data[i].machine,
											            label: ''+_data[i].machine,
											            value: ''+_data[i].machine,
											            listeners:{
											            		initialize:function( ck, eOpts ){
											            			for(var n=0;n < _arr.length;n++){
											            				if(ck.getValue() == _arr[n]){
											            					console.log("_zarr",_arr[n]);
											            					ck.check()
											            			}
																}
												            }
											            }
													}
												}
												_item.push(button);
											}
										
					                	var _login = Ext.create('Ext.form.Panel', {
					                			cls:'itemListPanel',
					                			id:'machinepanel',
												modal: true,
												layout: {
													type: 'vbox',
													align: 'center',
													pack: 'center'
												},
												hideOnMaskTap: true,
												showAnimation: {
													type: 'popIn',
													duration: 250,
													easing: 'ease-out'
												},
												hideAnimation: {
													type: 'popOut',
													duration: 250,
													easing: 'ease-out'
												},
												centered: true,
												width: Ext.filterPlatform('ie10') ? '100%' : (Ext.os.deviceType == 'Phone') ? screen.availWidth : 400,
												height: Ext.filterPlatform('ie10') ? '30%' : Ext.os.deviceType == 'Phone' ? screen.availHeight : 400,
										        style:'background: transparent',
										        items:_item,
												scrollable: true
											});
											Ext.Viewport.add(_login);
										});
									}
							    });
						    }
						}
					}
				]
			}
		],
		variableHeights: true,
		// emptyText : '没有数据',
		scrollToTopOnRefresh: false,
		store: {
			type: 'itemList',
			storeId: 'itemList'
		},
		itemTpl: [
			'<div class="flexbox box-align-center"> ',
				'<div class="flex10">',
					'<h3 class="item">{itemName}</h3>',
				'</div>',
				'<div class="op">',
					'<tpl if="auditResult == \'符合\'">',
						'<div class="btn list-icon green active ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'不符合\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red active nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == \'不适用\'">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray active other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
					'<tpl if="auditResult == null">',
						'<div class="btn list-icon green ok" action="ok"></div>',
						'<div class="btn list-icon gray other" action="other"></div>',
						'<div class="btn list-icon red nok" action="nok"></div>',
					'</tpl>',
				'</div>',
			'</div>'
		].join(''),
		// plugins:[ {
			// type:"listopt",
			// items:[ {
				// action:"ok",
				// cls:"write",
				// color:"blue",
				// text:"符合"
			// }, {
				// action:"other",
				// cls:"trash",
				// color:"gray",
				// text:"不适用"
			// }, {
				// action:"nok",
				// cls:"trash",
				// color:"red",
				// text:"不符合"
			// } ]
		// } ],
		fullscreen: true,
		grouped: true
    }
});