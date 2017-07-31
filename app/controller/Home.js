Ext.define('EQMS.controller.Home', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.ActionSheet'
	],
	config: {
		refs: {
			main: 'main',
			home: 'home',
			lpaList: 'lpaList',
			vdaList: 'vdaList',
			xjList: 'xjList',
			lpaListBtn: 'home [action=lpaList]',
			vdaListBtn: 'home [action=vdaList]',
			xjListBtn: 'home [action=xjList]',
			menuBtn: 'main [itemId=menu]'
		},
		control: {
			home:{
				activateview: "onActivateview",
				activeitemchange: "onActiveItemChange"
			},
			lpaListBtn: {
				tap: function(t, value){
					var main = this.getMain();
					// var lpaList = this.getLpaList();
					// if(!lpaList) lpaList = Ext.create('lpa.view.LpaList');
					// main.push(lpaList);
				}
			},
			vdaListBtn:{
				tap: function(t, value){
					var main = this.getMain();
					// var vdaList = this.getVdaList();
					// if(!vdaList) vdaList = Ext.create('lpa.view.vda.List');
					// var _sql = "exec SP_PAD_LPA_getTaskView @auditDate = '2016-07-01',@auditID = '"+$userName+"'";
					// util.storeLoad(vdaList, {sql: _sql});
					// main.push(vdaList);
				}
			},
			xjListBtn:{
				tap: function(t, value){
					var main = this.getMain();
					// var xjList = this.getXjList();
					// if(!xjList) xjList = Ext.create('lpa.view.xj.List');
					// var _sql = " exec SP_PAD_PP_getLists ";
					// util.storeLoad(xjList, {sql: _sql});
					// main.push(xjList);
				}
			}
		}
	},
	onActivateview: function( view, oldView ){
		// var _name = $userDescription.replace(' ', '');
		// _name = _name.length <= 2 ? _name : _name.substring(_name.length - 2, _name.length);
		// var _manuBtn = this.getMenuBtn();
		// if(!Ext.isEmpty(_manuBtn)){
			// var _manuText = _manuBtn.getText();
			// _manuBtn.setText(_name);
		// }
	},
	onChangeTabTitle: function(newTitle, navBar){//改变tabpanel的title

	},
	onActiveItemChange: function( tab, value, oldValue, eOpts){
		var it = this;
		var home = this.getHome();
		var main = this.getMain();
		
		var activeItem = main.getActiveItem(),
            navBar = main.getNavigationBar();
        if(!home || (home && activeItem === home)) {
            if(navBar && main.getInnerItems().length == navBar.backButtonStack.length) {
                var stack = navBar.backButtonStack;
				var title = value.tab.getTitle();
                stack[stack.length - 1] = title;
                navBar.setTitle(title);
				
				if(title == '我的'){
					navBar.setHidden(true);
					it.onUserChange();
				}else{
					navBar.setHidden(false);
				}
            }
        }
	},
	onUserChange: function(){
		var setting = util.readSettings();
		var home = this.getHome();
		home.down('profile').setData(setting);
	}
});