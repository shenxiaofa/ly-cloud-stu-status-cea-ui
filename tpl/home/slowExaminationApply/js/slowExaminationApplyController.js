;(function (window, undefined) {
    'use strict';
    window.stuApplySlow_slowExaminationApplyController = function ($scope, $state, $timeout, $uibModal, $compile, $rootScope, $window, $cookies, stuApplyExam_slowExaminationApplyService, baseinfo_generalService, alertService, app) {

        // 所选课程tab表格的高度
        $scope.shTable_height = $window.innerHeight-250;

        // 缓考申请信息tab表格的高度
        $scope.whTable_height = $window.innerHeight-250;

        $scope.slowCellApply = {};
        
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
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
            var html1 = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester for plateObj in semesterObjs" '
                +  ' ng-model="slowCellApply.semesterId" id="semesterId1" name="semesterId1" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            var html2 = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester for plateObj in semesterObjs" '
                +  ' ng-model="slowCellCheck.semesterId" id="semesterId2" name="semesterId2" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId1").parent().empty().append(html1);
            angular.element("#semesterId2").parent().empty().append(html2);
            $compile(angular.element("#semesterId1").parent().contents())($scope);
            $compile(angular.element("#semesterId2").parent().contents())($scope);
        });
        
        // 查询参数
        $scope.shQueryParams = function queryParams(params) {
            var pageParam = {
            	studentId: cookieasJson.userName,
            	semesterId: $scope.slowCellApply.semesterId,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.slowCellApply);
        };

        // 所选课程 table
        $scope.shSlowExaminationApplyTable = {
			url: app.api.address + "/exam/exemptExam/find",
            method: 'get',
            cache: false,
            height: $scope.shTable_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.shQueryParams,//传递参数（*）
			onLoadSuccess: function() {
				$compile(angular.element('#shSlowExaminationApplyTable').contents())($scope);
			},
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#shSlowExaminationApplyTable').contents())($scope);
            },
            responseHandler:function(response){
            	return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            columns: [
                {field:"semesterId",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseId",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"deptName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHours",title:"学时",align:"center",valign:"middle"},
                {field:"examMethod",title:"考试方式",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "10%",
                    formatter : function (value, row, index) {
                        return "<button id='btn_create' type='button' ng-click='slowCellApply(" + JSON.stringify(row) + ")' class='btn btn-default'>我要办理</button>";
                    }
                }
            ],
        };
        
        // 缓考申请
        $scope.slowCellApply = function(data){
			$uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/slowExaminationApply/slowCellApply.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: slowCellApplyController
            });
        };
		
	    // 我要办理
	    var slowCellApplyController = function ($scope, $uibModalInstance, item, FileUploader, stuApplyExam_slowExaminationApplyService, alertService, formVerifyService) {
	    	$scope.slowCellApply = {};
//	    	$scope.slowCellApply.id = item.id;// 免考id【不需要，有uuid】
	    	$scope.slowCellApply.studentNum = cookieasJson.userName;// 学号
	    	$scope.slowCellApply.studentName = cookieasJson.name;// 姓名+
	    	$scope.slowCellApply.courseNum = item.courseId;// 课程号+
	    	$scope.slowCellApply.semesterId = item.semesterId;// 学期id+
	    	$scope.slowCellApply.collegeId = item.deptId;// 所在单位【这里的接口中没有查出来对应的】
	    	$scope.slowCellApply.classId = item.classId;// 班级id+
	    	$scope.slowCellApply.courseName = item.courseName;// 申请免考课程+
	    	$scope.slowCellApply.deptId = item.deptId;// 开课单位+
	    	$scope.slowCellApply.credit = item.credit;// 学分+
	    	$scope.slowCellApply.coursePropertyCode = item.coursePropertyCode;// 课程属性代码+
	    	$scope.slowCellApply.teacherId = item.teacherId;// 教师id+
//	    	$scope.slowCellApply.reason = item.reason;// 缓考事由____【在前端加进来】
	    	$scope.slowCellApply.registerId = cookieasJson.userName;// 学籍id+
	    	$scope.slowCellApply.examineWayCode = item.examMethodCode;// 考试方式代码+
	    	
	    	$scope.slowCellApply.deptName = item.deptName;// 学生所在院系
	    	$scope.slowCellApply.className = item.className;// 班级
	    	$scope.slowCellApply.deptName = item.deptName;// 开课单位
	    	$scope.slowCellApply.courseProperty = item.courseProperty;// 课程性质
	    	$scope.slowCellApply.classTime = item.classTime;// 上课时间
	    	$scope.slowCellApply.examMethod = item.examMethod;// 考核方式
	    	$scope.slowCellApply.teacherName = "";
	    	for(var i=0; i<item.teacherName.length; i++){
	    		console.log(item.teacherName[i]);
	    		if(item.teacherName[i] != null){
	    			$scope.slowCellApply.teacherName = $scope.slowCellApply.teacherName + item.teacherName[i].name + "，";
	    		}
	    	}
	    	$scope.slowCellApply.teacherName = $scope.slowCellApply.teacherName.substring(0, $scope.slowCellApply.teacherName.length-1);// 任课教师
	    	
//	        $scope.message = "确定要删除吗？";
	        $scope.ok = function (form) {
	            if(form.$invalid) {
	                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
	                formVerifyService(form);
	                return;
	            };
	    		$scope.slowCellApply.file = $scope.fileId;	// 附属文件__【从当前模态框获取，上传后的文件里面获取】
	            stuApplyExam_slowExaminationApplyService.apply($scope.slowCellApply, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                angular.element('#shSlowExaminationApplyTable').bootstrapTable('refresh');
	                alertService('success', '操作成功');
	            });
	            $uibModalInstance.close();
	        };
	        
	        
	        $scope.close = function () {
	            $uibModalInstance.close();
	        };
	        
	        
	        /*************************上传附件开始*******************************/
	        // 上传附件【文件】
	        $scope.uploader = new FileUploader({
	            url: app.api.address + '/system/informNotice/uploadAttachment'
	        });
	        $scope.uploader.onAfterAddingFile = function(fileItem) {
	            fileItem.upload();
	            $scope.showProgress = true;	// 展示进度条
	        };
	        $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
	            alertService(response.meta.message);
	        };
	        $scope.uploader.onCompleteItem = function(fileItem, response, status, headers) {
	            if (response.meta.success) {
	                // 获取 fileId
	                $scope.fileId = response.data;
	                console.log("fileId = " + $scope.fileId);
	            } else {
	                alertService(response.meta.message);
	            }
	        };
	        // 删除上传文件
	        $scope.deleteAttachment = function (fileId) {
	        	console.log($scope.uploader.queue);
	            stuApplyExam_slowExaminationApplyService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                };
	            });
	            $scope.uploader.queue[0].file.name = "";
	            $scope.uploader.queue[0].file.size = "";
	            $scope.showProgress = false;
	        };
	        // 关闭窗口时删除文件
	        $scope.close = function (fileId) {
	        	if(fileId != null){
			        // 删除上传文件
		            stuApplyExam_slowExaminationApplyService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
		                if (error) {
		                    alertService(message);
		                    return;
		                };
		            });
	        	}
            	$uibModalInstance.close();
	        };
	        
	        /*************************上传附件结束*******************************/
		    
	    };
	    slowCellApplyController.$inject = ['$scope', '$uibModalInstance', 'item', 'FileUploader', 'stuApplyExam_slowExaminationApplyService', 'alertService', 'formVerifyService'];

        /**
         * 点击考试方案审核
         */
        $scope.shClickAlready = function() {
			angular.element('#shSlowExaminationApplyTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.shIsHideSearchForm = false; // 默认显示
        $scope.shSearchFormHideToggle = function () {
            $scope.shIsHideSearchForm = !$scope.shIsHideSearchForm
            if ($scope.shIsHideSearchForm) {
                $scope.shTable_height = $scope.shTable_height + 37;
            } else {
                $scope.shTable_height = $scope.shTable_height - 37;
            }
            angular.element('#shSlowExaminationApplyTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#shSlowExaminationApplyTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.slowCellApply = {};
            angular.element('form[name="shIsHideSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#shSlowExaminationApplyTable').bootstrapTable('refresh');
        };

        $scope.slowCellCheck = {};

        // 查询参数
        $scope.whQueryParams = function queryParams(params) {
            var pageParam = {
            	registerId: cookieasJson.userName,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.slowCellCheck);
        };

        // 缓考申请信息 table
        $scope.whSlowExaminationApplyTable =  {
			url: app.api.address + "/exam/examReview/reviewInfo",
            method: 'get',
            cache: false,
            height: $scope.whTable_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.whQueryParams,//传递参数（*）
			onLoadSuccess: function() {
				$compile(angular.element('#whSlowExaminationApplyTable').contents())($scope);
			},
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#whSlowExaminationApplyTable').contents())($scope);
            },
            responseHandler:function(response){
            	return {
                    total: response.data.total,
                    rows: response.data.rows
                };
            },
            columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle"},
                {field:"courseId",title:"课程编号",align:"center",valign:"middle"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle"},
                {field:"dept",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"applyTime",title:"申请时间",align:"center",valign:"middle"},
                {field:"reviewStatus",title:"审核状态",align:"center",valign:"middle",
	                formatter:function(value, row, index)  {
	                    if(value=='0'){
	                        return '通过'
	                    }else if(value=='1'){
	                        return '不通过'
	                    }else if(value=='2'){
	                        return '待审核'
	                    }else{
	                        return value;
	                    }
	                }
                },
                {field:"cz",title:"操作",align:"center",valign:"middle",width: "18%",
                    formatter : function (value, row, index) {
                        var btncreate = "<button id='btn_maintain' type='button' ng-click='slowCellCheck(" + JSON.stringify(row) + ")' class='btn btn-default'>查看</button>";
                        return btncreate;

                    }
                }
            ],
        };
        
        // 查看缓考申请信息
        $scope.slowCellCheck = function(data){
			$uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/slowExaminationApply/slowCellCheck.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: slowCellCheckController
            });
        };
        
	    // 我要办理
	    var slowCellCheckController = function ($scope, $filter, FileUploader, $uibModalInstance, item, stuApplyExam_slowExaminationApplyService, alertService) {
	    	$scope.slowCellCheck = {};
	    	$scope.slowCellCheck.studentId = item.studentId;// 学号
	    	$scope.slowCellCheck.studentName = item.studentName;// 姓名
	    	$scope.slowCellCheck.college = item.college;// 学生所在院系
	    	$scope.slowCellCheck.className = item.className;// 班级
	    	$scope.slowCellCheck.courseName = item.courseName;// 申请免考课程
	    	$scope.slowCellCheck.dept = item.dept;// 开课单位
	    	$scope.slowCellCheck.credit = item.credit;// 学分
	    	$scope.slowCellCheck.courseQuality = item.courseQuality;// 课程性质
	    	$scope.slowCellCheck.teacherName = item.teacherName;// 任课教师
	    	$scope.slowCellCheck.classTime = item.classTime;// 上课时间
	    	$scope.slowCellCheck.examWay = item.examWay;// 考核方式
	    	$scope.slowCellCheck.reason = item.reason;// 申请缓考事由
	    	$scope.slowCellCheck.node = item.node;// 审批意见
	    	$scope.slowCellCheck.fileId = item.fileId;// 附件
	        
	        /*************************下载附件开始*******************************/
	        // 导出模板
	        var fileId = item.fileId;
	        console.log(fileId);
//	        var fileId = "group1/M00/00/08/wKgemFpm2IeALoDBAABmCHZzFwE382.jpg";	// 测试数据
			$scope.checkField = function(){
		        $rootScope.showLoading = true; // 开启加载提示
		        stuApplyExam_slowExaminationApplyService.exportTemplate(fileId, function (data) {
		            var blob = new Blob([data], {
		            	type: "application/octet-stream"
		            });
		            fileId = fileId.substring(fileId.indexOf("."), fileId.length); // 获取到文件的末尾文件类型名
		            var objectUrl = window.URL.createObjectURL(blob);
		            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
		            var aForExcel = angular.element('<a download="缓考文件-' + currentTime + fileId + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
		            angular.element('body').append(aForExcel);
		            angular.element('.forExcel').click();
		            aForExcel.remove();
		            // 允许关闭
		            $rootScope.showLoading = false; // 关闭加载提示
		        });
			};
	        /*************************下载文件结束*******************************/
	        
	        $scope.close = function () {
	            $uibModalInstance.close();
	        };
	    };
	    slowCellCheckController.$inject = ['$scope', '$filter', 'FileUploader', '$uibModalInstance', 'item', 'stuApplyExam_slowExaminationApplyService', 'alertService'];

        $scope.whClickAlready = function() {
			angular.element('#whSlowExaminationApplyTable').bootstrapTable('refresh');
        };
        
        // 查询表单显示和隐藏切换
        $scope.whIsHideSearchForm = false; // 默认显示
        $scope.whSearchFormHideToggle = function () {
            $scope.whIsHideSearchForm = !$scope.whIsHideSearchForm
            if ($scope.whIsHideSearchForm) {
                $scope.whTable_height = $scope.whTable_height + 37;
            } else {
                $scope.whTable_height = $scope.whTable_height - 37;
            }
            angular.element('#whSlowExaminationApplyTable').bootstrapTable('resetView',{ height: $scope.whTable_height } );
        };
        
        // 查询表单提交
        $scope.whSearchSubmit = function () {
            angular.element('#whSlowExaminationApplyTable').bootstrapTable('refresh');
        };
        
        // 查询表单重置
        $scope.whSearchReset = function () {
            $scope.slowCellCheck = {};
            angular.element('form[name="whIsHideSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#whSlowExaminationApplyTable').bootstrapTable('refresh');
        };

        $scope.ok = function () {
            var data = angular.element('#whSlowExaminationApplyTable').bootstrapTable('getData');
            data.forEach (function(obj) {
//              obj.ksfs = angular.element('#ksfs'+obj.id)[0].value;
//              obj.pscjbl = angular.element('#pscjbl'+obj.id)[0].value;
//              obj.qmcjbl = angular.element('#qmcjbl'+obj.id)[0].value;
            });
            stuApplyExam_slowExaminationApplyService.add(data);
        };

    }
    stuApplySlow_slowExaminationApplyController.$inject = ['$scope', '$state', '$timeout', '$uibModal', '$compile', '$rootScope', '$window', '$cookies', 'stuApplyExam_slowExaminationApplyService', 'baseinfo_generalService', 'alertService', 'app'];
})(window);