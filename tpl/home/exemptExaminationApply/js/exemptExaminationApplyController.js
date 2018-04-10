;(function (window, undefined) {
    'use strict';
    window.stuApplyExempt_exemptExaminationApplyController = function ($scope, $state, $timeout, $uibModal, $compile, $cookies, $rootScope, $window, stuApplyExam_exemptExaminationApplyService, baseinfo_generalService, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight-130;

        // 所选课程tab表格的高度
        $scope.shTable_height = $window.innerHeight-245;

        // 免考申请信息tab表格的高度
        $scope.whTable_height = $window.innerHeight-245;

        $scope.exemptCellApply = {};
        $scope.showProgress = false;	// 隐藏进度条
        
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
                +  ' ng-model="exemptCellApply.semesterId" id="semesterId1" name="semesterId1" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            var html2 = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester for plateObj in semesterObjs" '
                +  ' ng-model="exemptCellCheck.semesterId" id="semesterId2" name="semesterId2" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
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
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.exemptCellApply);
        };

        // 所选课程 table
        $scope.shExemptExaminationApplyTable = {
			url: app.api.address + "/exam/exemptExam/find",
            method: 'get',
            cache: false,
            height: $scope.shTable_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）			
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            sortable: false, // 禁用排序
            idField: "jsbh", // 指定主键列
            uniqueId: "jsbh", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.shQueryParams,//传递参数（*）    
            search: false,
			onLoadSuccess: function() {
				$compile(angular.element('#shExemptExaminationApplyTable').contents())($scope);
			},
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#shExemptExaminationApplyTable').contents())($scope);
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
                        return "<button id='btn_create' type='button' ng-click='exemptCellApplyFun(" + JSON.stringify(row) + ")' class='btn btn-default'>我要办理</button>";
                    }
                }
            ],
        };
        
        // 免考申请
        $scope.exemptCellApplyFun = function(data){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/exemptExaminationApply/exemptCellApply.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: exemptCellApplyController
            });
        };
		
	    // 我要办理
	    var exemptCellApplyController = function ($scope, $uibModalInstance, $timeout, item, stuApplyExam_exemptExaminationApplyService, alertService, FileUploader, formVerifyService) {
	    	$scope.exemptCellApply = {};
//	    	$scope.exemptCellApply.id = item.id;// 免考id【不需要，有uuid】
	    	$scope.exemptCellApply.studentNum = cookieasJson.userName;// 学号
	    	$scope.exemptCellApply.studentName = cookieasJson.name;// 姓名+
	    	$scope.exemptCellApply.courseNum = item.courseId;// 课程号+
	    	$scope.exemptCellApply.semesterId = item.semesterId;// 学期id+
	    	$scope.exemptCellApply.collegeId = item.deptId;// 所在单位【这里的接口中没有查出来对应的】
	    	$scope.exemptCellApply.classId = item.classId;// 班级id+
	    	$scope.exemptCellApply.courseName = item.courseName;// 申请免考课程+
	    	$scope.exemptCellApply.deptId = item.deptId;// 开课单位+
	    	$scope.exemptCellApply.credit = item.credit;// 学分+
	    	$scope.exemptCellApply.coursePropertyCode = item.coursePropertyCode;// 课程属性代码+
	    	$scope.exemptCellApply.teacherId = item.teacherId;// 教师id+
//	    	$scope.exemptCellApply.reason = $scope.exemptCellApply.reason;	// 缓考事由__【从当前模态框获取，点击确定获取到tectarea】
	    	$scope.exemptCellApply.registerId = cookieasJson.userName;// 学籍id+
	    	$scope.exemptCellApply.examineWayCode = item.examMethodCode;// 考试方式代码+
	    	
	    	$scope.exemptCellApply.deptName = item.deptName;// 学生所在院系
	    	$scope.exemptCellApply.className = item.className;// 班级
	    	$scope.exemptCellApply.deptName = item.deptName;// 开课单位
	    	$scope.exemptCellApply.courseProperty = item.courseProperty;// 课程性质
	    	$scope.exemptCellApply.classTime = item.classTime;// 上课时间
	    	$scope.exemptCellApply.examMethod = item.examMethod;// 考核方式
	    	$scope.exemptCellApply.teacherName = "";
	    	for(var i=0; i<item.teacherName.length; i++){
	    		if(item.teacherName[i] != null){
	    			$scope.exemptCellApply.teacherName = $scope.exemptCellApply.teacherName + item.teacherName[i].name + "，";
	    		}
	    	}
	    	$scope.exemptCellApply.teacherName = $scope.exemptCellApply.teacherName.substring(0, $scope.exemptCellApply.teacherName.length-1);// 任课教师
	        $scope.ok = function (form) {
	            if(form.$invalid) {
	                // 调用共用服务验证（效果：验证不通过的输入框会变红色）
	                formVerifyService(form);
	                return;
	            };
	    		$scope.exemptCellApply.file = $scope.fileId;	// 附属文件__【从当前模态框获取，上传后的文件里面获取】
	            stuApplyExam_exemptExaminationApplyService.apply($scope.exemptCellApply, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                angular.element('#shExemptExaminationApplyTable').bootstrapTable('refresh');
	                alertService('success', '操作成功');
	            });
	            $uibModalInstance.close();
	        };
	        /*************************上传附件开始*******************************/
	        // 上传附件【文件】
	        $scope.uploader = new FileUploader({
	            url: app.api.address + '/system/informNotice/uploadAttachment'
	        });
	        $scope.uploader.onAfterAddingFile = function(fileItem) {
	            fileItem.upload();
	            $scope.showProgress = true;
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
	            stuApplyExam_exemptExaminationApplyService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                };
	            });
	            $scope.uploader.queue[0].file.name = "";
	            $scope.uploader.queue[0].file.size = "";
	            $scope.showProgress = false;
	        };
	        $scope.close = function (fileId) {
	        	if(fileId != null){
			        // 删除上传文件
		            stuApplyExam_exemptExaminationApplyService.deleteAttachment(fileId, 'informNoticeManage:delete', function (error, message) {
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
	    exemptCellApplyController.$inject = ['$scope', '$uibModalInstance', '$timeout', 'item', 'stuApplyExam_exemptExaminationApplyService', 'alertService', 'FileUploader', 'formVerifyService'];

        /**
         * 点击考试方案审核
         */
        $scope.shClickAlready = function() {
			angular.element('#shExemptExaminationApplyTable').bootstrapTable('refresh');
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
            angular.element('#shExemptExaminationApplyTable').bootstrapTable('resetView',{ height: $scope.shTable_height } );
        };
        
        // 查询表单提交
        $scope.shSearchSubmit = function () {
            angular.element('#shExemptExaminationApplyTable').bootstrapTable('selectPage', 1);
        };
        
        // 查询表单重置
        $scope.shSearchReset = function () {
            $scope.exemptCellApply = {};
            angular.element('form[name="shIsHideSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#shExemptExaminationApplyTable').bootstrapTable('refresh');
        };

        $scope.exemptCellCheck = {};

        // 查询参数
        $scope.whQueryParams = function queryParams(params) {
            var pageParam = {
            	registerId: cookieasJson.userName,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.exemptCellCheck);
        };

        // 免考申请信息 table
        $scope.whExemptExaminationApplyTable =  {
			url: app.api.address + "/exam/examReview/exemptExamInfo",
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
            sortOrder: false, // 默认排序方式
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.whQueryParams,//传递参数（*）
			onLoadSuccess: function() {
				$compile(angular.element('#whExemptExaminationApplyTable').contents())($scope);
			},
            onColumnSwitch: function (field, checked) {
                $compile(angular.element('#whExemptExaminationApplyTable').contents())($scope);
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
                        var btncreate = "<button id='btn_maintain' type='button' ng-click='exemptCellCheck(" + JSON.stringify(row) + ")' class='btn btn-default'>查看</button>";
                        return btncreate;

                    }
                }
            ],
        };
        
        // 查看免考申请信息
        $scope.exemptCellCheck = function(data){
			$uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/exemptExaminationApply/exemptCellCheck.html',
                size: 'lg',
                resolve: {
                    item: function () {
                        return data;
                    },
                },
                controller: exemptCellCheckController
            });
        };
        
	    // 查看
	    var exemptCellCheckController = function ($scope, $filter, $uibModalInstance, item, stuApplyExam_exemptExaminationApplyService, alertService, FileUploader) {
	    	$scope.exemptCellCheck = {};
	    	$scope.exemptCellCheck.studentNum = cookieasJson.userName;// 学号
	    	$scope.exemptCellCheck.studentName = cookieasJson.name;// 姓名
	    	$scope.exemptCellCheck.college = item.college;// 学生所在院系
	    	$scope.exemptCellCheck.className = item.className;// 班级
	    	$scope.exemptCellCheck.courseName = item.courseName;// 申请免考课程
	    	$scope.exemptCellCheck.dept = item.dept;// 开课单位
	    	$scope.exemptCellCheck.credit = item.credit;// 学分
	    	$scope.exemptCellCheck.courseQuality = item.courseQuality;// 课程性质
	    	$scope.exemptCellCheck.classTime = item.classTime;// 上课时间
	    	$scope.exemptCellCheck.examWay = item.examWay;// 考核方式
	    	$scope.exemptCellCheck.reason = item.reason;// 申请缓考事由
	    	$scope.exemptCellCheck.node = item.node;// 申请理由
	    	$scope.exemptCellCheck.fileId = item.fileId;// 附件
	    	$scope.exemptCellCheck.examWay = item.examWay;// 考核方式
	    	$scope.exemptCellCheck.teacherName = item.teacherName;// 任课教师
	        
	        /*************************下载附件开始*******************************/
	        // 导出模板
	        var fileId = item.fileId;
//	        var fileId = "group1/M00/00/08/wKgemFpm2IeALoDBAABmCHZzFwE382.jpg";	// 测试数据
			$scope.checkField = function(){
		        $rootScope.showLoading = true; // 开启加载提示
		        stuApplyExam_exemptExaminationApplyService.exportTemplate(fileId, function (data) {
		            var blob = new Blob([data], {
		            	type: "application/octet-stream"
		            });
		            fileId = fileId.substring(fileId.indexOf("."), fileId.length); // 获取到文件的末尾文件类型名
		            var objectUrl = window.URL.createObjectURL(blob);
		            var currentTime = $filter('date')(new Date(), 'yyyyMMddHHmmss');
		            var aForExcel = angular.element('<a download="免考文件-' + currentTime + fileId + '"><span class="forExcel">导出</span></a>').attr('href', objectUrl);
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
	    exemptCellCheckController.$inject = ['$scope', '$filter', '$uibModalInstance', 'item', 'stuApplyExam_exemptExaminationApplyService', 'alertService', 'FileUploader'];

        $scope.whClickAlready = function() {
			angular.element('#whExemptExaminationApplyTable').bootstrapTable('refresh');
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
            angular.element('#whExemptExaminationApplyTable').bootstrapTable('resetView',{ height: $scope.whTable_height } );
        };
        
        // 查询表单提交
        $scope.whSearchSubmit = function () {
            angular.element('#whExemptExaminationApplyTable').bootstrapTable('refresh');
        };
        
        // 查询表单重置
        $scope.whSearchReset = function () {
            $scope.exemptCellCheck = {};
            angular.element('form[name="whIsHideSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#whExemptExaminationApplyTable').bootstrapTable('refresh');
        };

    }
    
    stuApplyExempt_exemptExaminationApplyController.$inject = ['$scope', '$state', '$timeout', '$uibModal', '$compile', '$cookies', '$rootScope', '$window', 'stuApplyExam_exemptExaminationApplyService', 'baseinfo_generalService', 'alertService', 'app'];
})(window);