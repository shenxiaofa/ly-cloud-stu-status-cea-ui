;(function (window, undefined) {
    'use strict';
    window.stuApplyExamBinding_applyOtherExamController = function ($scope, $http, $state, $timeout, $cookies, $stateParams, $uibModal, $compile, $rootScope, $window, applyOtherExamBinding_applyOtherExamService, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight-270;
        
		$scope.outSideMaintain = {};
		
		// 获取学生号	cookieasJson.userName
		var cookieasJson = {};
		if($cookies.getObject("user") != null) {
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
		// 将传过来的json字符串转换为json格式数据
		var stateParams = JSON.parse($stateParams.params);
		
		$scope.outSideMaintain.studentNum = cookieasJson.userName;
		
		// 对传过来的值进行判断并区分是一对多还是多对一
        var radio = true;
        var checkbox = false;
        if(stateParams.state == 2){
            radio = false;
            checkbox = true;
        }

        $scope.updateParams = function versionModelQueryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
            };
            //$rootScope.$log.debug(angular.extend(pageParam, $scope.param));
            return angular.extend(pageParam,$scope.outSideMaintain);
        }
        
		// 系统外课程列表
        $scope.outsideCourseTable =  {
            url: app.api.address + '/score/outSysScoreApply/queryOutSysCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#outsideCourseTable').contents())($scope);
            },
            columns: [
                {radio: checkbox, checkbox:radio, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xtwcj_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                // {field:"deparementName",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
		
		// 计划课程列表
        $scope.courseCurriculaTable =  {
            url: app.api.address + '/score/outSysScoreApply/queryCourseInfoByBindId',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.updateParams,//传递参数（*）
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function(data) {
                $compile(angular.element('#courseCurriculaTable').contents())($scope);
                var courseIndex = 0;
            },
            columns: [
                {radio: radio,checkbox:checkbox, width: "5%"},
                {field:"bdcjd_ID",visible:false},
                {field:"xscjd_ID",visible:false},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentName",title:"开课单位",align:"center",valign:"middle",width:"35%"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        
        $scope.ok = function (states) {
            var outRows = angular.element('#outsideCourseTable').bootstrapTable('getSelections');
            var studentRows = angular.element('#courseCurriculaTable').bootstrapTable('getSelections');
            var outSysScoreIds = [];
            var studentScoreIds = [];
            outRows.forEach(function(outsideCourse, index) {
                outSysScoreIds.push(outsideCourse.xtwcj_ID);
            });
            studentRows.forEach(function(course, index) {
                studentScoreIds.push(course.xscjd_ID);
            });
            if(states == 1){	// 办理完成【需要申请】
	            applyOtherExamBinding_applyOtherExamService.courseBinding(outSysScoreIds, studentScoreIds, function (error1, message1, data) {
	                if (error1) {
	                    alertService(message1);
	                    return;
	                }
        			$scope.outSideMaintain = {};
	                $scope.outSideMaintain.applyType = '2';
	                $scope.outSideMaintain.type = '1';
	                $scope.outSideMaintain.outSysBindingId = data.data;
	            	applyOtherExamBinding_applyOtherExamService.apply($scope.outSideMaintain, function (error2, message2) {
		                if (error2) {
		                    alertService(message2);
		                    return;
		                }
		                // 成功则弹框
			            $uibModal.open({
			                animation: true,
			                backdrop: 'static',
			                templateUrl: 'tpl/home/applyOtherExamBinding/alert.html',
			                size: '',
			                resolve: {
			                    alert: function () {
			                        return {
			                        }
			                    }
			                },
			                controller: alertController
			            });
	            	});
           			angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
	            });
            }else if(states == 2){	// 保存草稿【不走申请】
	            applyOtherExamBinding_applyOtherExamService.courseBinding(outSysScoreIds, studentScoreIds, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                // 成功则弹框
		            $uibModal.open({
		                animation: true,
		                backdrop: 'static',
		                templateUrl: 'tpl/home/applyOtherExamBinding/alert.html',
		                size: '',
		                resolve: {
		                    alert: function () {
		                        return {
		                        }
		                    }
		                },
		                controller: alertController
		            });
            		angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
	            });
            }
        };
        
        // 弹出框后操作
	    var alertController = function ($scope, $uibModalInstance, alert) {
	        $scope.close = function () {
				// 返回上一层
				$("body").fadeOut();
				$timeout(function(){
					$state.go("home.common.applyOtherExamBinding");// 返回上一页
	            },500);  
				$("body").fadeIn(800);
	            $uibModalInstance.close();
            	angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
	        };
	    };
	    alertController.$inject = ['$scope', '$uibModalInstance', 'alert'];

    }
	stuApplyExamBinding_applyOtherExamController.$inject = ['$scope', '$http', '$state', '$timeout', '$cookies', '$stateParams', '$uibModal', '$compile', '$rootScope', '$window', 'applyOtherExamBinding_applyOtherExamService', 'alertService', 'app'];
})(window);
