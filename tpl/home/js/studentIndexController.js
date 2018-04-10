;(function (window, undefined) {
    'use strict';
    window.student_studentIndexController = function ($scope, $http, $timeout, $state, $uibModal, $compile, $rootScope, $localStorage, $cookies, $interval, $window, alertService, app) {
			
		// 获取cookies
		$scope.user = {};
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
			$scope.user.name = cookieasJson.name;
		}
		
		// 跳转到系统外成绩申请
		$scope.jumpToApplyOtherExam = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.applyOtherExam");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到免考申请页面
		$scope.jumpToExemptExaminationApply = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.exemptExaminationApply");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到缓考申请页面
		$scope.jumpToSlowExamination = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.slowExaminationApply");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到成绩查询页面
		$scope.jumpToExamPrinting = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.examResultsQuery");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到系统外成绩绑定
		$scope.jumpToApplyExamBinding = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.applyOtherExamBinding");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到考试安排查询
		$scope.jumpToQueryExamArrange = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.examArrangeQuery");
            },500);
			$("body").fadeIn(800);
		};
		
		// 跳转到课表查询
		$scope.jumpToScheduleQuery = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("home.common.scheduleQuery");
            },500);
			$("body").fadeIn(800);
		};
		
		// 回到首页，如果cookie为空，则直接回到首页
		$scope.switchIndexPage = function(){
			$("body").fadeOut();
			$timeout(function () {
				if($cookies.getObject("user") != null && $cookies.getObject("user") != undefined){
					if($cookies.getObject("user").indexOf("teacher-login") > 0){	// 回到教师端的首页
			            $state.go('teacherIndex');
					}else if($cookies.getObject("user").indexOf("student-login") > 0){	// 回到学生端的首页
			            $state.go('studentIndex');
					}else if($cookies.getObject("user").indexOf("manager-login") > 0){	// 回到管理端的首页
			            $state.go('home.index');
					}
				}else{	// 登出
	            	$rootScope.showLoading = false; // 关闭加载提示
	            	$localStorage.$reset();
	            	$interval.cancel($rootScope.stopSessionCheck);
		            $state.go('login');
				}
            }, 500);
			$("body").fadeIn(800);
		};
		
//		获取权限
//		$http({
//			method: "get",
//			url: "/api/privilege",
//			params: {
//				type: 'menu',
//				code: 'jwjsd'
//			}
//		}).then(function(response) {
//			var arr = response.data.data;
//			for(var i = 0; i < arr.length; i++) {
//				for(var j in $scope.privileges) {
//					if(arr[i].code == j && arr[i].enable) {
//						$scope.privileges[j] = true;
//					}
//				}
//			}
//		}, function(response) {
//			
//		});

		$scope.privileges = {
			jwjsd_jxjdzd: false,
			jwjsd_kccjlr: false,
			jwjsd_tykcjlr: false,
			jwjsd_cjjfc: false,
			jwjsd_cjfchf: false,
			jwjsd_ggxxkkksq: false,
			jwjsd_ttksq: false,
			jwjsd_jsjysq: false,
			jwjsd_sykpjjgcx: false,
			jwjsd_llkpjjgcx: false,
			jwjsd_yxkcxxcx: false,
			jwjsd_jsskqkjkxjscx: false,
			jwjsd_jxjhcx: false,
			jwjsd_kkjhcx: false,
			jwjsd_rkxxcx: false,
			jwjsd_xkrzcx: false,
			jwjsd_xscx: false
		};

		// 获取公告信息
		$scope.eduForList = [];
		$scope.collegeForList = [];
		var EduForListCount = 0;
		var CollegeForListCount = 0;
		$http({
			method: "get",
			url: app.api.address + "/system/informNotice",
			params: {
				pageSize: 10,
				pageNum: 1
			}
		}).then(function(response) {
			angular.forEach(response.data.data.list, function(eduArr) {
				if(eduArr.noticeTypeName == "院系公告" && EduForListCount < 3){
					var cellEduForList = {
						content : eduArr.content,
						title : eduArr.noticeName,
						id : eduArr.noticeId
					};
					$scope.eduForList.push(cellEduForList);
					EduForListCount++;
				}else if(eduArr.noticeTypeName == "教务处公告"){
					var cellCollegeForList = {
						content : eduArr.content,
						title : eduArr.noticeName,
						id : eduArr.noticeId
					};
					$scope.collegeForList.push(cellCollegeForList);
					CollegeForListCount++;
				}
			});
		}, function(response) {
			
		});

		// 获取公告详情
		$scope.getNoticeDetial = function(row) {
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/home/js/notice/see.html',
				size: 'lg',
				resolve: {
					item: function() {
						return row;
					}
				},
				controller: noticeDetialController
			});
		};
		
		// 查看公告详情控制器
		var noticeDetialController = function($compile, $scope, $uibModalInstance, $http, item, $sce) {
			$scope.noticeHtml = $sce.trustAsHtml(item.content);
			$scope.title = item.title;
			$scope.close = function() {
				$uibModalInstance.close();
			}
		}
		noticeDetialController.$inject = ['$compile', '$scope', '$uibModalInstance', '$http', 'item', '$sce'];				// 获取左侧学生基本信息
		
		// 获取左侧学生基本信息
		$http({
			method: "get",
			url: app.api.address + "/student/studentBaseInfo/" + cookieasJson.userName
		}).then(function(response) {
			$scope.student = response.data.data;
			if($scope.student.studentStateName == '1') {
				$scope.student.studentStateNameDetail = "在校";
			} else if($scope.student.studentStateName == '2'){
				$scope.student.studentStateNameDetail = "不在校";
			}
		}, function(response) {
//			console.log(response);
		});

		// 左侧动画效果
		$scope.studentLeft = function() {
			if($('.all-left').find($('.fa-outdent')).length > 0) {
				$(".all-left .fa-outdent").removeClass('fa-outdent').addClass('fa-indent')
				$('.all-left').css('width', "50px");
				$('.all-left_wrap').css('display', "none");
				$('.all-right').css('width', "calc(100% - 60px)");
				$('.footer').css({
					'width': "calc(100% - 60px)",
					'margin-left': "50px"
				});
			} else {
				$(".all-left .fa-indent").removeClass('fa-indent').addClass('fa-outdent')
				$('.all-left').css('width', "230px");
				$('.all-right').css('width', "calc(100% - 240px)");
				$('.footer').css({
					'width': "calc(100% - 230px)",
					'margin-left': "230px"
				});
				clearTimeout(rur);
				var rur = setTimeout(function() {
					$('.all-left_wrap').fadeIn();
				}, 500)
			}
		};

		//教务处公告收缩
		$scope.showHideEduList = function() {
			$scope.hideEduList = !$scope.hideEduList;
		};

		//院系公告收缩
		$scope.showHideCollegeList = function() {
			$scope.hideCollegeList = !$scope.hideCollegeList;
		};

		//我的服务收缩
		$scope.showHideIcon = function() {
			$scope.teachIcon = !$scope.teachIcon;
		};

		//学分情况收缩
		$scope.showHideDetails = function() {
			$scope.details = !$scope.details;
		};
		
		//我的课表收缩
		$scope.showHideSchedule = function() {
			$scope.scheduleText = !$scope.scheduleText;
		};
		
		// 我的服务下的卡片切换
		$('.showHideIcon').click(function() {
			if($('.teachIcon').css('display') == 'none') {
				$('.teachIcon').show();
			} else {
				$('.teachIcon').hide();
			}
		})

		// 提示语
		var ttmier;
		$('.tips,.tips_ct').hover(function() {
			clearTimeout(ttmier);
			$('.tips_ct').stop(true).show()
		}, function() {
			ttmier = setTimeout(function() {
				$('.tips_ct').stop(true).hide()
			}, 1000)
		})
		var navWidth = $(".tabs-all").width();
		$scope.liWidth = navWidth / 10;

		// 获取学分情况
		$http({
			method: "get",
			url: app.api.address + "/scheme/studentQuery/creditCount",
			params: {
				studentId: cookieasJson.userName
			}
		}).then(function(response) {
			var creditResults = response.data.data;	// 获取到请求结果
			$scope.showProgressCount = false;
			$scope.creditSituation = response.data.data;
			var count1 = 0;	// 累计总学分获取情况	
			var count2 = 0;	// 累计总学分
			angular.forEach(creditResults, function(creditResult) {
				if(creditResult.credit != null){
					$scope.showProgressCount = true;	// 只要有一个当前除数成绩为空，则展示真实数据
					count1 += parseInt(creditResult.credit);	// 累计所有的已获得学分
				}
				if(creditResult.modularCredit != null){
					count2 += parseInt(creditResult.modularCredit);	// 累计所有的毕业总学分
				}
			});
			// 毕业总学分
			$scope.student.totalNum = 0;
			$scope.student.totalNum = count2;
			// 总学分已完成度
			$scope.student.alreadyFinish = 0;
			$scope.student.alreadyFinish = (count1/count2)*100;
//			if($scope.student.required==100){	// 进度条变为绿色
//				$('#creditId'+$scope.creditSituation.coursePropertyId).removeClass('progress-bar-warning').addClass('progress-bar-success');
//			}
		}, function(response) {
			console.log(response);
		});

		// 我的课表的周次滑动效果
		$scope.weeklyShow = function() {
			//周次切换
			var i = 10; //定义每个面板显示8个菜单
			var len = $scope.weeklyList.length; //获得LI元素的个数
			var page = 1;
			var maxpage = Math.ceil(len / i);
			$scope.next = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == maxpage) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "-=" + navWidth + "px"
						}, 2000);
						page++;;
					}
				}
			};
			$scope.pre = function() {
				if(!$(".tabs-all .nav").is(":animated")) {
					if(page == 1) {
						$(".tabs-all .nav").stop();
					} else {
						$(".tabs-all .nav").animate({
							left: "+=" + navWidth + "px"
						}, 2000);
						page--;;
					}
				}
			};
		};

		// 获取当前学年学期
		var academicYear = "";
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule/selectCurrentSemester"
		}).then(function(response) {
			academicYear = response.data.data;
			$scope.academicYear = academicYear;
		}, function(response) {
			console.log(response);
		});
		
		// 显示节次信息
		$scope.sectionList = {};
		$http({
			method: "get",
			url: app.api.address + '/arrange/teacherTimeDemand',
			params: {
				type : 'selectSection',
				semesterId : '2017-2018-1'
			}
		}).then(function(response) {
			$scope.sectionList = response.data.data.rows;
		}, function(response) {
			console.log(response);
		});

		// 获取当前周次和周次名称
		$scope.weekly = "";
		$scope.weeklyList = {};
		$http({
			method: "get",
			url: app.api.address + "/arrange/teacherSchedule",
			params: {
				type : 'selectSectionList',
				pageSize : '50'
			}
		}).then(function(response) {
			$scope.weeklyList = response.data.data.rows;
			$scope.currentWeekly = response.data.data.rows[0].currentWeekly; // 当前周次
			
			if($scope.currentWeekly == undefined || $scope.currentWeekly == 'undefined') {
				$scope.currentWeekly = "1";	// 默认初始化为1
			}
			
			$scope.weeklyShow();
			$scope.getCourse($scope.currentWeekly);
		}, function(response) {
			console.log(response);
		});

		$scope.weekTimeMap = {};
		// 获取课程的信息并刷新数据，每次点击重新请求数据
		$scope.getCourse = function(weekly) {
			$scope.weekly = weekly;
			var academicYear = $scope.academicYear;
			//课程信息
			//加载动画
			 $scope.showLoading = true ; 
			$http({
				method: "get",
				url: app.api.address + "/arrange/studentSchedule",
				params: {
					type: 'selectStudentStateSchedule',
					studentNum: cookieasJson.userName,
					weekly: weekly
				}
			})
			.then(function(response) {
				var data = response.data.data.rows;
				var j = 0;
				$scope.courseList = [];
				for(var i = 0; i < $scope.sectionList.length; i++) {
					if(data[j] != undefined && "" + (i + 1) == data[j].section) {
						$scope.courseList[i] = data[j];
						j++;
					} else {
						$scope.courseList[i] = {};
					}
				}
				 $scope.showLoading = false ;
			}, function(response) {
				console.log(response);
			});
			//获取周的开始时间和结束时间【（2017-12-03至2017-12-09）】 不需要学年学期Id，只需要周次
			$http({
				method: "get",
				url: app.api.address + "/arrange/teacherSchedule",
				params: {
					type: 'selectMaxMinTime',
					weekly: $scope.weekly
				}
			})
			.then(function(response) {
				$scope.weekTimeMap = response.data.data.rows[0];
			}, function(response) {
				console.log(response);
			});
		};
		
	};
	student_studentIndexController.$inject = ['$scope', '$http', '$timeout', '$state', '$uibModal', '$compile', '$rootScope', '$localStorage', '$cookies', '$interval', '$window', 'alertService', 'app'];
})(window);


