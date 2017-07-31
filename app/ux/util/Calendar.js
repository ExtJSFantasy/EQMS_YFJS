//农历工具类
//算出农历, 传入日期, 传回农历日期对象 
//该对象属性有 .year .month .day .isLeap .yearCyl .dayCyl .monCyl 
function Lunar(objDate) {
    var i, leap = 0, temp = 0,
    	baseDate = new Date(1900, 0, 31),
    	offset = (objDate - baseDate) / 864e5;
    this.dayCyl = offset + 40;
    this.monCyl = 14;
    for (i = 1900; i < 2050 && offset > 0; i++) {
        temp = UX.util.Calendar.lYearDays(i);
        offset -= temp;
        this.monCyl += 12;
    }
    if (offset < 0) {
        offset += temp;
        i--;
        this.monCyl -= 12;
    }
    this.year = i;
    this.yearCyl = i - 1864;
    leap = UX.util.Calendar.leapMonth(i);
    //闰哪个月 
    this.isLeap = false;
    for (i = 1; i < 13 && offset > 0; i++) {
        //闰月 
        if (leap > 0 && i == leap + 1 && this.isLeap == false) {
            --i;
            this.isLeap = true;
            temp = UX.util.Calendar.leapDays(this.year);
        } else {
            temp = UX.util.Calendar.monthDays(this.year, i);
        }
        //解除闰月 
        if (this.isLeap == true && i == leap + 1) this.isLeap = false;
        offset -= temp;
        if (this.isLeap == false) this.monCyl++;
    }
    if (offset == 0 && leap > 0 && i == leap + 1) if (this.isLeap) {
        this.isLeap = false;
    } else {
        this.isLeap = true;
        --i;
        --this.monCyl;
    }
    if (offset < 0) {
        offset += temp;
        --i;
        --this.monCyl;
    }
    this.month = i;
    if(i == 12) this.maxDay = temp;
    this.day = offset + 1;
};

Ext.define('UX.util.Calendar', {
	singleton: true,

	lunarInfo: [19416, 19168, 42352, 21717, 53856, 55632, 91476, 22176, 39632, 21970, 19168, 42422, 42192, 53840, 119381, 46400, 54944, 44450, 38320, 84343, 18800, 42160, 46261, 27216, 27968, 109396, 11104, 38256, 21234, 18800, 25958, 54432, 59984, 28309, 23248, 11104, 100067, 37600, 116951, 51536, 54432, 120998, 46416, 22176, 107956, 9680, 37584, 53938, 43344, 46423, 27808, 46416, 86869, 19872, 42448, 83315, 21200, 43432, 59728, 27296, 44710, 43856, 19296, 43748, 42352, 21088, 62051, 55632, 23383, 22176, 38608, 19925, 19152, 42192, 54484, 53840, 54616, 46400, 46496, 103846, 38320, 18864, 43380, 42160, 45690, 27216, 27968, 44870, 43872, 38256, 19189, 18800, 25776, 29859, 59984, 27480, 21952, 43872, 38613, 37600, 51552, 55636, 54432, 55888, 30034, 22176, 43959, 9680, 37584, 51893, 43344, 46240, 47780, 44368, 21977, 19360, 42416, 86390, 21168, 43312, 31060, 27296, 44368, 23378, 19296, 42726, 42208, 53856, 60005, 54576, 23200, 30371, 38608, 19415, 19152, 42192, 118966, 53840, 54560, 56645, 46496, 22224, 21938, 18864, 42359, 42160, 43600, 111189, 27936, 44448],

	sTermInfo: [0, 21208, 42467, 63836, 85337, 107014, 128867, 150921, 173149, 195551, 218072, 240693, 263343, 285989, 308563, 331033, 353350, 375494, 397447, 419210, 440795, 462224, 483532, 504758],

	solarTerm: ["小寒", "大寒", "立春", "雨水", "惊蛰", "春分", "清明", "谷雨", "立夏", "小满", "芒种", "夏至", "小暑", "大暑", "立秋", "处暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"],

	lFtv: {
		1: {
			1: '春节',
			15: '元宵节'
		},
		5: {
			5: '端午节'
		},
		7: {
			7: '情人节',
			15: '中元节'
		},
		8: {
			15: '中秋节'
		},
		9: {
			9: '重阳节'
		},
		12: {
			8: '腊八节',
			24: '小年'
		}
	},

	sFtv: {
		1: {
			1: '元旦'
		},
		2: {
			14: '情人节'
		},
		3: {
			8: '妇女节',
			12: '植树节',
			15: '消权日'
		},
		4: {
			1: '愚人节'
		},
		5: {
			1: '劳动节',
			4: '青年节',
			12: '护士节'
		},
		6: {
			1: '儿童节'
		},
		7: {
			1: '建党节'
		},
		8: {
			1: '建军节'
		},
		9: {
			10: '教师节'
		},
		10: {
			1: '国庆节',
            31: '万圣节'
		},
		12: {
			24: '平安夜',
			25: '圣诞节'
		}
	},

    //传回农历 y年的总天数 
    lYearDays: function (y) {
        var i, sum = 348;
        for (i = 32768; i > 8; i >>= 1) sum += this.lunarInfo[y - 1900] & i ? 1 :0;
        return sum + this.leapDays(y);
    },
    //传回农历 y年闰月的天数
    leapDays: function (y) {
        if (this.leapMonth(y)) return this.lunarInfo[y - 1900] & 65536 ? 30 :29; else return 0;
    },
    //传回农历 y年闰哪个月 1-12 , 没闰传回 0 
    leapMonth: function (y) {
        return this.lunarInfo[y - 1900] & 15;
    },
    //传回农历 y年m月的总天数 
    monthDays: function (y, m) {
        return this.lunarInfo[y - 1900] & 65536 >> m ? 30 :29;
    },

    //中文日期 
    cDay: function (m, d) {
        var nStr1 = ["日", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"],
        	nStr2 = ["初", "十", "廿", "卅", "　"],
        	sm = '', sd = '';
        if (m < 11 && m > 1) {
            sm = nStr1[m];
        } else if (m == 11) {
            sm = "十一";
        } else if (m == 12) {
            sm = "腊";
        } else if (m == 1) {
            sm = "正";
        }
        
        switch (d) {
          case 10:
            sd = "初十";
            break;

          case 20:
            sd = "二十";
            break;

          case 30:
            sd = "三十";
            break;

          default:
            sd = nStr2[Math.floor(d / 10)];
            sd += nStr1[d % 10];
        }
        return [sm, sd];
    },
    isMothersDay: function(newDate){
    	if(!newDate) return false;
        var SM = newDate.getMonth();
	    if(SM != 4) return false;

        var SY = newDate.getFullYear(),
        	SD = newDate.getDate(),
	    	dd = new Date(SY, 4, 1),
	        motherDay = 1 + (7 - dd.getDay()) + 7;
	        
	    return motherDay == SD;
	},
    isFathersDay: function(newDate){
    	if(!newDate) return false;
        var SM = newDate.getMonth();
	    if(SM != 5) return false;

        var SY = newDate.getFullYear(),
        	SD = newDate.getDate(),
	    	dd = new Date(SY, 5, 1),
	        fatherDay = 1 + (7 - dd.getDay()) + 14;
	        
	    return fatherDay == SD;
	},
    getFestival: function (newDate) {
        var SY = newDate.getFullYear(),
	        SM = newDate.getMonth(),
	        SD = newDate.getDate(),
        	sDObj = new Date(SY, SM, SD),
        	lDObj = new Lunar(sDObj),
        	solarTerms = "", 
        	tmp1, tmp2;
        //国历节日
        if(this.sFtv.hasOwnProperty(SM + 1)){
        	var sfs = this.sFtv[SM + 1];
        	if(sfs.hasOwnProperty(SD)){
        		return sfs[SD];
        	}
        }
        if(this.isFathersDay(newDate)) return '父亲节';
        if(this.isMothersDay(newDate)) return '母亲节';
        //农历节日
        if(lDObj.month == 12 && lDObj.day == lDObj.maxDay) 
        	return '除夕';
        if(this.lFtv.hasOwnProperty(lDObj.month)){
        	var lfs = this.lFtv[lDObj.month];
        	if(lfs.hasOwnProperty(lDObj.day)){
        		return lfs[lDObj.day];
        	}
        }
        //节气 
        tmp1 = new Date(31556925974.7 * (SY - 1900) + this.sTermInfo[SM * 2] * 6e4 + Date.UTC(1900, 0, 6, 2, 5));
        tmp2 = tmp1.getUTCDate();
        if (tmp2 == SD) solarTerms = this.solarTerm[SM * 2];

        if(!Ext.isEmpty(solarTerms)) return solarTerms;

        var traCal = this.cDay(lDObj.month, lDObj.day);
        return traCal[1];
    }
});