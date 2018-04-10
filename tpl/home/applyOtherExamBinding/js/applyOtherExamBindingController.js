;(function (window, undefined) {
    'use strict';
    window.stuApplyExamBinding_applyOtherExamBindingController = function ($scope, $state, $timeout, $uibModal, $cookies, $compile, $rootScope, $window, applyOtherExamBinding_applyOtherExamService, baseinfo_generalService, alertService, app) {

        // 维护tab表格的高度
        $scope.whTable_height = $window.innerHeight-225;

        $scope.applyOtherExamBinding = {};
        
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
        
        // 申请外校成绩
        $scope.applyOtherExamBindingApply = function(param){
			$("body").fadeOut();
			var obj = {
				state : param
			}
			// 把json数据转换为json字符串
			var params = angular.toJson(obj);
			$timeout(function(){  
				$state.go("home.common.applyOtherExamBindingApply",{
					"params" : params
				});
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
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="applyOtherExamBinding.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		var myCount = 0;
        function mergeCells(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }
            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentNum", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentDepartmentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterMajor", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"className", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"enCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"credit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"totalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"score", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"courseModual", colspan: colspan, rowspan:count});
                }else{
                	myCount += count;
                }
                index += count;
            }
        }

        function mergeCells2(data,fieldName,colspan,target){
            //声明一个map计算相同属性值在data对象出现的次数和
            var sortMap = {};
            for(var i = 0 ; i < data.length ; i++){
                for(var prop in data[i]){
                    if(prop == fieldName){
                        var key = data[i][prop]
                        if(key){
                            if(sortMap.hasOwnProperty(key)){
                                sortMap[key] = sortMap[key] * 1 + 1;
                            } else {
                                sortMap[key] = 1;
                            }
                            break;
                        }
                    }
                }
            }

            var index = 0;
            for(var prop in sortMap){
                var count = sortMap[prop] * 1;
                if(count>1){
                    $(target).bootstrapTable('mergeCells',{index:index, field:fieldName, colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"checkbox", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"cz", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterId", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentNum", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"studentDepartmentName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"semesterMajor", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"className", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysEnCourseName", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseModular", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseCredit", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseTotalHour", colspan: colspan, rowspan:count});
                    $(target).bootstrapTable('mergeCells',{index:index, field:"osysCourseScore", colspan: colspan, rowspan:count});
                }else{

                }
                index += count;
            }
        }

        // 查询参数
        $scope.whQueryParams = function queryParams(params) {
            var pageParam = {
            	studentNum: cookieasJson.userName,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.applyOtherExamBinding);
        }
        
        // 系统外成绩绑定申请
        $scope.examMethodMaintainTable =  {
            url:app.api.address + '/score/outSysScoreApply/queryCourseBinding',
            method: 'get',
            cache: false,
            height:  $scope.whTable_height,
            toolbar: '#toolbar1', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.whQueryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
//          showColumns: true,
//          showRefresh: true,
            onLoadSuccess: function() {
                $compile(angular.element('#examMethodMaintainTable').contents())($scope);
            },
            responseHandler:function(response){
                return response.data;
            },
            onLoadSuccess: function() {
                $compile(angular.element('#examMethodMaintainTable').contents())($scope);
                angular.element('#examMethodMaintainTable').bootstrapTable('resetView',{ height: $scope.classCurriculaRecordTableHeight } );
                //合并单元格
                var data = $('#examMethodMaintainTable').bootstrapTable('getData', true);
                // mergeCells(data, "id", 1, $('#examMethodMaintainTable'));
                mergeCells(data, "studentScoreId", 1, $('#examMethodMaintainTable'));
                if(myCount){
                    mergeCells2(data, "outSysScoreId", 1, $('#examMethodMaintainTable'));
                }
            },
            columns: [
                {checkbox: true, width: "3%"},
                {field:"semesterId", title:"学年学期",align:"center",valign:"middle"},
                {field:"applyTime", title:"申请时间",align:"center",valign:"middle"},
                {field:"cnCourseName", title:"中文课程名称",align:"center",valign:"middle"},
                {field:"enCourseName", title:"英文课程名称",align:"center",valign:"middle"},
                {field:"courseModual",title:"课程模块",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"},
                {field:"totalHour",title:"学时",align:"center",valign:"middle"},
                {field:"osysCourseScore",title:"成绩",align:"center",valign:"middle"},
                {field:"osysCnCourseName",title:"系统外中文课程名称",align:"center",valign:"middle"},
                {field:"osysEnCourseName",title:"系统外英文课程名称",align:"center",valign:"middle"},
                {field:"osysCourseModular",title:"系统外课程模块",align:"center",valign:"middle"},
                {field:"osysCourseCredit",title:"系统外课程学分",align:"center",valign:"middle"},
                {field:"osysCourseTotalHour",title:"系统外课程学时",align:"center",valign:"middle"},
                {field:"osysCourseModular",title:"系统外成绩类别",align:"center",valign:"middle"},
                {field:"osysCourseScore",title:"系统外课程成绩",align:"center",valign:"middle"},
                {field:"decidCourseNum",title:"认定课程数",align:"center",valign:"middle"},
                {field:"auditStatus",title:"审核状态",align:"center",valign:"middle"},
                {field:"cz",title:"操作",align:"center",valign:"middle",
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
        
        // 申请校外成绩绑定
        $scope.applyOtherExamBinding = function(){
			$("body").fadeOut();
			$timeout(function(){  
				$state.go("home.common.applyOtherExamBindingApply");
            },500);  
			$("body").fadeIn(800);
        };
        
        // 删除
        $scope.del = function(row){
            $uibModal.open({
                animation: true,
                backdrop: 'static',
                templateUrl: 'tpl/home/applyOtherExamBinding/delete.html',
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
	    var delController = function ($scope, $uibModalInstance, item, applyOtherExamBinding_applyOtherExamService, alertService) {
	        $scope.message = "确定要删除吗？";
	        $scope.ok = function () {
	            applyOtherExamBinding_applyOtherExamService.delete(item.id, function (error, message) {
	                if (error) {
	                    alertService(message);
	                    return;
	                }
	                angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
	                alertService('success', '删除成功');
	            });
	            $uibModalInstance.close();
	        };
	        $scope.close = function () {
	            $uibModalInstance.close();
	        };
	    };
	    delController.$inject = ['$scope', '$uibModalInstance', 'item', 'applyOtherExamBinding_applyOtherExamService', 'alertService'];
		
        // 办理完成
        $scope.finish = function(row){
        	$scope.applyOtherExam = {};
            $scope.applyOtherExam.applyType = '2';
            $scope.applyOtherExam.type = '1';
            $scope.applyOtherExam.outSysId = row.id;
        	applyOtherExamBinding_applyOtherExamService.apply($scope.applyOtherExam, function (error2, message2) {
                if (error2) {
                    alertService(message2);
                    return;
                }
           		angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
        	});
        };
        
        // 查询表单显示和隐藏切换
        $scope.whIsHideSearchForm = false; // 默认显示
        $scope.whSearchFormHideToggle = function () {
            $scope.whIsHideSearchForm = !$scope.whIsHideSearchForm
            if ($scope.whIsHideSearchForm) {
                $scope.whTable_height = $scope.whTable_height + 45;
            } else {
                $scope.whTable_height = $scope.whTable_height - 45;
            }
            angular.element('#examMethodMaintainTable').bootstrapTable('resetView',{ height: $scope.whTable_height } );
        };
        
        // 查询表单提交
        $scope.whSearchSubmit = function () {
            angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
        };
        
        // 查询表单重置
        $scope.whSearchReset = function () {
            $scope.applyOtherExamBinding = {};
            angular.element('form[name="applyOtherExamBindingForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#examMethodMaintainTable').bootstrapTable('refresh');
        };

    }
    stuApplyExamBinding_applyOtherExamBindingController.$inject = ['$scope', '$state', '$timeout', '$uibModal', '$cookies', '$compile', '$rootScope', '$window','applyOtherExamBinding_applyOtherExamService', 'baseinfo_generalService', 'alertService', 'app'];
})(window);
