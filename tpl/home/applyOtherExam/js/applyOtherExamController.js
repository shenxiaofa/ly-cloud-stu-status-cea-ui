;(function (window, undefined) {
    'use strict';
    window.stuApplyExam_applyOtherExamController = function ($scope, $state, $timeout, $uibModal, $compile, $rootScope, $window, $cookies, alertService, applyOtherExam_applyOtherExamService, baseinfo_generalService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight-130;

        // 审核tab表格的高度
        $scope.shTable_height = $window.innerHeight-225;

        $scope.applyOtherExam = {};
        
		// 获取学生号	cookieasJson.userName
		var cookieasJson = {};
		if($cookies.getObject("user") != null) {
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
		// 跳转到首页面
		$scope.jumpToIndexPage = function () {
			$("body").fadeOut();
			$timeout(function(){
				$state.go("studentIndex");
            },500);
			$("body").fadeIn(800);
		};
		
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester for plateObj in semesterObjs" '
                +  ' ng-model="applyOtherExam.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
        // 查询参数
        $scope.shQueryParams = function queryParams(params) {
            var pageParam = {
            	type: 'maintain',
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.applyOtherExam);
        }

        // 考试方式审批 table
        $scope.examMethodExamineTable = {
            url:app.api.address + '/score/outSysScoreApply',
            method: 'get',
            cache: false,
            height: $scope.shTable_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "semesterId", // 指定主键列
            uniqueId: "semesterId", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.shQueryParams,//传递参数（*）
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
//          showColumns: true,
//          showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examMethodExamineTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            columns: [
                {field:"semesterId", title:"学年学期",align:"center",valign:"middle"},
                {field:"cnCourseName",title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName",title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModule",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
//              {field:"courseProperty",title:"课程性质",align:"center",valign:"middle"},
                {field:"scoreType",title:"成绩类别",align:"center",valign:"middle"},
                {field:"score",title:"成绩",align:"center",valign:"middle"},
                {field:"decideCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"id",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                    	var delBtn = "";
                    	var finishBtn = "";
                    	if(row.auditStatus == "草稿"){
                        	delBtn = "<button id='btn_fzrsz' type='button' ng-click='del(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>删除</button>";
                        	finishBtn = "<button id='btn_fzrsz' type='button' ng-click='finish(" + JSON.stringify(row) + ")' class='btn btn-default btn-sm'>办理完成</button>";
                    	}else{// 不可点
                        	delBtn = "<button id='btn_fzrsz' style='margin-right: 4px' type='button' ng-click='del(" + JSON.stringify(row) + ")' disabled='disabled' class='btn disabled btn-sm'>删除</button>";
                        	finishBtn = "<button id='btn_fzrsz' style='margin-right: 4px' type='button' ng-click='finish(" + JSON.stringify(row) + ")' disabled='disabled' class='btn disabled btn-sm'>办理完成</button>";
                    	}
                        return delBtn+finishBtn;
                    }
                }
            ],
        };
        
        // 申请外校成绩
        $scope.applyOtherExamButton = function(){
			$uibModal.open({
				backdrop: 'static',
				animation: true,
				templateUrl: 'tpl/home/applyOtherExam/applyOtherExamDetail.html',
				size: 'lg',
				resolve: {
					item: function() {
					}
				},
				controller: applyOtherExamController
			});
        };
		
		// 申请外校成绩控制器
		var applyOtherExamController = function($scope, $http, $state, $timeout, $uibModalInstance, $cookies, $uibModal, $compile, $rootScope, $window, applyOtherExam_applyOtherExamService, baseinfo_generalService, alertService, app, formVerifyService) {
			
	        // 表格的高度
	        $scope.table_height = $window.innerHeight-130;
	
			// 获取学生号	cookieasJson.userName
			var cookieasJson = {};
			if($cookies.getObject("user") != null) {
				cookieasJson = JSON.parse($cookies.getObject("user"));
			}
	
			// 获取课程属性下拉
	        baseinfo_generalService.findcodedataNames({datableNumber: "KCSXDM"}, function (error, message, data) {
	            if (error) {
	                alertService(message);
	                return;
	            }
	            $scope.coursePropertyObjs = data.data;
	            var html = '' +
	                '<select ui-select2 ng-options="plateObj.dataNumber as plateObj.dataName  for plateObj in coursePropertyObjs" '
	                +  ' ng-model="applyOtherExam.courseProperty" id="courseProperty" name="courseProperty" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
	                +  '<option value="">==请选择==</option> '
	                +  '</select>';
	            angular.element("#courseProperty").parent().empty().append(html);
	            $compile(angular.element("#courseProperty").parent().contents())($scope);
	        });
	        
	        // 获取学年学期下拉
	        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
	            if (error) {
	                alertService(message);
	                return;
	            }
	            $scope.semesterObjs = data.data;
	            var html = '' +
	                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
	                +  ' ng-model="applyOtherExam.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
	                +  '<option value="">==请选择==</option> '
	                +  '</select>';
	            angular.element("#semesterId").parent().empty().append(html);
	            $compile(angular.element("#semesterId").parent().contents())($scope);
	        });
	        
	        // 获取课程模块下拉
	        baseinfo_generalService.findCourseModel(function (error, message, data) {
	            if (error) {
	                alertService(message);
	                return;
	            }
	            $scope.courseModularObjs = data.data;
	            var html = '' +
	                '<select ui-select2 ng-options="plateObj.id as plateObj.name  for plateObj in courseModularObjs" '
	                +  ' ng-model="applyOtherExam.courseModular" id="courseModular" name="courseModular" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
	                +  '<option value="">==请选择==</option> '
	                +  '</select>';
	            angular.element("#courseModular").parent().empty().append(html);
	            $compile(angular.element("#courseModular").parent().contents())($scope);
	        });
			
			// 点击关闭
	        $scope.close = function () {
	            $uibModalInstance.close();
            	angular.element('#examMethodExamineTable').bootstrapTable('refresh');
	        };
	        
			// 点击确定按钮
	        $scope.ok = function (form, states) {
	            if(form.$invalid) {
	                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
	                formVerifyService(form);
	                return;
	            };
                $scope.applyOtherExam.studentNum = cookieasJson.userName;
                $scope.applyOtherExam.studentName = cookieasJson.name;
	            if(states == 1){	// 办理完成【需要申请】
		            applyOtherExam_applyOtherExamService.add($scope.applyOtherExam, function (error1, message1, data) {
		                if (error1) {
		                    alertService(message1);
		                    return;
		                }
		                $scope.applyOtherExam.applyType = '1';
		                $scope.applyOtherExam.type = '1';
		                $scope.applyOtherExam.outSysId = data.data;
		            	applyOtherExam_applyOtherExamService.apply($scope.applyOtherExam, function (error2, message2) {
			                if (error2) {
			                    alertService(message2);
			                    return;
			                }
			                // 成功则弹框
				            $uibModal.open({
				                animation: true,
				                backdrop: 'static',
				                templateUrl: 'tpl/home/applyOtherExam/alert.html',
				                size: '',
				                resolve: {
				                    alert: function () {
				                        return {
//				                            message: status	
				                        }
				                    }
				                },
				                controller: alertController
				            });
		            	});
	           			angular.element('#examMethodExamineTable').bootstrapTable('refresh');
		            });
	            }else if(states == 2){	// 保存草稿【不走申请】
		            applyOtherExam_applyOtherExamService.add($scope.applyOtherExam, function (error, message) {
		                if (error) {
		                    alertService(message);
		                    return;
		                }
		                // 成功则弹框
			            $uibModal.open({
			                animation: true,
			                backdrop: 'static',
			                templateUrl: 'tpl/home/applyOtherExam/alert.html',
			                size: '',
			                resolve: {
			                    alert: function () {
			                        return {
//			                            message: status	
			                        }
			                    }
			                },
			                controller: alertController
			            });
	            		angular.element('#examMethodExamineTable').bootstrapTable('refresh');
		            });
	            }
	        };
	        
	        // 弹出框后操作
		    var alertController = function ($scope, $uibModalInstance, alert) {
		        $scope.close = function () {
//		        	if(alert.message == 1){	// 缓存后点击关闭窗口，简单粗暴重新加载页面
//						location.reload();
//		        	}else if(alert.message == 2){	// 提交后点击关闭窗口
						// 返回上一层
						$("body").fadeOut();
						$timeout(function(){
							$state.go("home.common.applyOtherExam");// 返回上一页
			            },500);  
						$("body").fadeIn(800);
//		        	}
		            $uibModalInstance.close();
	            	angular.element('#examMethodExamineTable').bootstrapTable('refresh');
		        };
		    };
		    alertController.$inject = ['$scope', '$uibModalInstance', 'alert'];

		}
		applyOtherExamController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModalInstance', '$cookies', '$uibModal', '$compile', '$rootScope', '$window', 'applyOtherExam_applyOtherExamService', 'baseinfo_generalService', 'alertService', 'app', 'formVerifyService'];
		
        // 删除
        $scope.del = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/applyOtherExam/delete.html',
                size: '',
                resolve: {
                    item: function () {
                        return row;
                    }
                },
                controller: delController
            });
        };
        
	    // 删除控制器
	    var delController = function ($scope, $uibModalInstance, item, applyOtherExam_applyOtherExamService, alertService) {
	        $scope.message = "确定要删除吗？";
	        $scope.ok = function () {
	            applyOtherExam_applyOtherExamService.delete(item.id, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                angular.element('#examMethodExamineTable').bootstrapTable('refresh');
	                alertService('success', '删除成功');
	            });
	            $uibModalInstance.close();
	        };
	        $scope.close = function () {
	            $uibModalInstance.close();
	        };
	    };
	    delController.$inject = ['$scope', '$uibModalInstance', 'item', 'applyOtherExam_applyOtherExamService', 'alertService'];

        // 办理完成
        $scope.finish = function(row){
        	$scope.applyOtherExam = {};
            $scope.applyOtherExam.applyType = '1';
            $scope.applyOtherExam.type = '1';
            $scope.applyOtherExam.outSysId = row.id;
        	applyOtherExam_applyOtherExamService.apply($scope.applyOtherExam, function (error2, message2) {
                if (error2) {
                    alertService(message2);
                    return;
                }
           		angular.element('#examMethodExamineTable').bootstrapTable('refresh');
        	});
        };
        
        /**
         * 点击考试方案审核
         */
        $scope.shClickAlready = function() {
			angular.element('#examMethodExamineTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.shIsHideSearchForm = false; // 默认显示
        $scope.shSearchFormHideToggle = function () {
            $scope.shIsHideSearchForm = !$scope.shIsHideSearchForm
            if ($scope.shIsHideSearchForm) {
                $scope.shTable_height = $scope.shTable_height + 45;
            } else {
                $scope.shTable_height = $scope.shTable_height - 45;
            }
            angular.element('#examMethodExamineTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#examMethodExamineTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.makeupExaminationList = {};
            angular.element('form[name="applyOtherExamForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examMethodExamineTable').bootstrapTable('refresh');
        };

    }
    stuApplyExam_applyOtherExamController.$inject = ['$scope', '$state', '$timeout', '$uibModal', '$compile', '$rootScope', '$window', '$cookies', 'alertService', 'applyOtherExam_applyOtherExamService', 'baseinfo_generalService', 'app'];
})(window);
