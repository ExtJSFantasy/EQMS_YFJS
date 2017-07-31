Ext.define('EQMS.view.lpa.ItemDetail', {
	extend: 'Ext.form.Panel',
    xtype: 'itemDetail',
    requires: [
        'Ext.TitleBar',
		'UX.plugin.ImageViewer',
		'EQMS.view.Camera',
		'Ext.field.Hidden',
		'Ext.field.TextArea',
		'Ext.field.Number',
		'Ext.tab.Panel',
		'Ext.form.FieldSet',
		'UX.plugin.Select',
		'UX.Img',
		'Ext.field.Search'
    ],
    config: {
		title : '不符合项',
		scrollable: {
            direction: 'vertical',
            directionLock: true
        },
		orient: 'portrait',
		/*navBtns: [
			{
				action: 'save',
				text: '保存',
				itemId: 'save',
				align: 'right'
			}
		],*/
		cls: 'itemDetail',
		lpaListRecord: null,
		itemListRecord: null,
		itemList: null,
		items: [
			{
				xtype : 'fieldset',
				scrollable: null,
				//title:'',
				items : [
					{
						xtype:'fieldset',
						title:'问题描述',
						cls:'sectitle',
						items:[
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'hiddenfield', name: 'isborder', value: '0'},
							{
								xtype: 'textareafield', 
								name: 'describe', 
								label: '', 
								placeHolder: '请输入问题描述', 
								required: true
							}
						]
					},
					{
						xtype:'fieldset',
						layout:'vbox',
						items:[
							{xtype: 'hiddenfield', name: 'isNC', value: '0'},
							{xtype: 'hiddenfield', name: 'solver', value: '0'},
							{xtype: 'hiddenfield', name: 'auditor', value: '0'},
							//auditID: $userName
							{xtype: 'hiddenfield', name: 'isborder', value: '0'},
							/*{
								xtype: 'uxSelectfield', 
								name: 'departmentName',
								label: '责任部门:',
								labelWidth:'40',
								placeHolder: '选择责任部门',
								disabled:true,
								valueField: 'departmentName',
								displayField: 'departmentName',
								autoSelect:false,
								store: {
									type: 'resDepartment', 
									storeId: 'resDepartment',
								},
								listeners : {
									pickerchange: function(me, record){
										console.log("me",me);
										//me.parent.down('[name=partName]').setValue(record.get('partName'));
									}
								}
							},*/
							{
								xtype: 'uxSelectfield', 
								name: 'solverName', 
								label: '责任人:',
								labelWidth:'40',
								placeHolder: '选择责任人',
								valueField: 'solverName',
								displayField: 'solverName',
								autoSelect:false,
								store: {
									type: 'resDepartment', 
									storeId: 'resDepartment'
								},
								listeners : {
									pickerchange: function(me, record){
										me.parent.down('[name=solver]').setValue(record.get('userName'));
										//me.parent.down('[name=auditor]').setValue($userName);
									}
								}
							},
							{
								xtype: 'textfield', 
								name: 'field01', 
								label: '产线:',
								disabled:true,
								id:'lineName', 
								labelWidth:'40',
								placeHolder: '产线'
							},
							{
								xtype: 'textfield', 
								name: 'field02',
								required:true, 
								label: '工位:', 
								labelWidth:'40',
								id:'station',
								disabled:true, 
								placeHolder: '工位',
								listeners:{
									initialize:function(st, eOpts){
										console.log("st",Ext.ComponentQuery.query("textfield[id='lineName']")[0]);
										this.element.on({  
							                tap : function(com, e, eOpts) {
							                  	//动态添加问题类型的数组
												var _items = [],
													//保存选择的值
													_values = '',
													//局部变量的全局变量，用于取消选中的状态
													_cc,
													//局部变量的全局变量,用于循环
													i,
													//产线名
													_field01 = Ext.ComponentQuery.query("textfield[id='lineName']")[0].getValue();
												var _params1 = {
													lineName:_field01
												};
												var url = 'lpa/getStationByLinename';
												util.myAjax(url, _params1, function(response, request) {
													 _data = Ext.decode(response.responseText).data;
													 //console.log("_data",_data);
													 _size = Ext.decode(response.responseText).totalCounts+1;
													if(_size <= 1){
														return;
													}
													//循环添加项
												for( i=0;i<_size;i++){
													if(i == _size-1){
														button = {
														xtype:'button',
														text:'确定',
														margin:'10 0 0 0',
														scopes:this,
														handler:function(at){
															//s=s.Substring(0,s.Length-1)
															console.log("at",at.getParent());
															var _actionId = Ext.ComponentQuery.query("actionsheet[id='actionId']")[0];
															//console.log("_actionId",_actionId);
															//console.log("_actionId",_actionId.items.items[0]);
															//console.log("_actionId.items.items.size",_actionId.items.items.length);
															var _size = _actionId.items.items.length-1;
															for(var k=0;k < _size;k++){
																//console.log("_actionId.items[k].getchecked();",_actionId.items.items[k].getChecked());
																if(_actionId.items.items[k].getChecked()){
																	_values = _values+_actionId.items.items[k].getValue()+',';
																}
															}
															if(_values.length > 0){
																st.setValue(_values.substr(0,_values.length-1));
																actionSheet.destroy();
															}else{
																	Ext.toast('请选择工位！');
																}
															}
														}
													}
													var _arr=[];
												    _arr = Ext.ComponentQuery.query("textfield[id='station']")[0].getValue().split(',');
													if(i < _size-1){
														button = {
											                name : ''+_data[i].station,
												            label: ''+_data[i].station,
												            value: ''+_data[i].station,
											                margin:'10 0 0 0',
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
											            _items.push(button);
													}
								                  	var actionSheet = Ext.create('Ext.ActionSheet', {
														hideOnMaskTap:true,
														scrollable:true,
														style:{
															'font-size': '1.5em'
														},
														defaultType:'checkboxfield',
														id:'actionId',
														items: _items
													});
													Ext.Viewport.add(actionSheet);
													});
												
							                  	console.log(12345678); 
							                  },  
							                  touchstart:function(){  
							                    console.log("touch start......");  
							                  },  
							                  touchend:function(){  
							                    console.log("touch end......");  
							                  }  
		             					})
									}
								}
							},
							{
								xtype: 'textfield', 
								name: 'field03', 
								label: '产品:',
								required:true, 
								labelWidth:'40',
								placeHolder: '产品'
							}
						]
					}
				]
			},
			{
				height: '20%',
				xtype: 'camera',
				margin: '.8em 0em 0 0'
			},
			{
				xtype: 'button',
				ui:'confirm',
				cls:'btn',
				text:'选择问题类型提交',
				docked : 'bottom',
				itemId:'confirm'
			}
		]
    }
});