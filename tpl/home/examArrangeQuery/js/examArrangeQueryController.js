;(function (window, undefined) {
    'use strict';
    window.stuExamArrangeQuery_examArrangeQueryController = function ($scope, $http, $state, $timeout, $uibModal, $compile, $cookies, $rootScope, $window, baseinfo_generalService, alertService, app) {
		$scope.queryExamArrange = {};
		// 表格的高度
        $scope.table_height = $window.innerHeight - 270;
        
		var cookieasJson = {};
		if($cookies.getObject("user") != null){
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="queryExamArrange.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
	    $scope.queryParams = function queryParams(params) {
            var pageParam = {
//          	examType : '1',
            	studentId : cookieasJson.userName,
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.queryExamArrange);
	    };
	    
		$scope.queryExamArrangeTable = {
            url: app.api.address + '/exam/formalManage/studentExamInfo',
            //url: 'data_test/exam/tableview_makeupExaminationListManage.json',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
            clickToSelect: true,
            responseHandler:function(response){
                return response.data;
            },
			onLoadSuccess: function() {
				$compile(angular.element('#queryExamArrangeTable').contents())($scope);
			},
			columns: [
                {field:"semester",title:"学年学期",align:"center",valign:"middle",width:"10%"},
                {field:"courseName",title:"课程名称",align:"center",valign:"middle",width:"10%"},
                {field:"credit",title:"学分",align:"center",valign:"middle",width:"5%"},
                {field:"totalHour",title:"总学时",align:"center",valign:"middle",width:"5%"},
                {field:"name",title:"考试班名称",align:"center",valign:"middle",width:"10%"},
                {field:"startTime",title:"考试开始时间",align:"center",valign:"middle",width:"10%"},
                {field:"endTime",title:"考试结束时间",align:"center",valign:"middle",width:"10%"},
                {field:"locationName",title:"考试地点",align:"center",valign:"middle",width:"10%"
//              ,
//                  formatter : function (value, row, index) {
//                      if(value == '' || value == null){
//                          return "-";
//                      }
//                      var names = "";
//                      angular.forEach(value, function(data, index, array){
//                          names += data.classRoomNum + "、";
//                      });
//                      if (names.length > 0) {
//                          names = names.substring(0, names.length - 1);
//                      }
//                      return names;
//                  }
                }
//              {field:"teacher",title:"监考人员",align:"center",valign:"middle",width:"10%"},
			]
		};
		
		// 查询表单
		$scope.searchSubmit = function () {
			angular.element('#queryExamArrangeTable').bootstrapTable('selectPage', 1);
		};
		
        // 查询表单重置
        $scope.searchReset = function () {
            $scope.queryExamArrange = {};
            // 重新初始化下拉框
            angular.element('form[name="queryExamArrangeSearchForm"] select[ui-jq="chosen"]').val("").trigger("chosen:updated");
            angular.element('#queryExamArrangeTable').bootstrapTable('selectPage', 1);
        };
        
        // 开始日期参数配置
        $scope.ksrqOptions = {
            opened: false,
            open: function() {
                $scope.ksrqOptions.opened = true;
            }
        };
        
        // 结束日期参数配置
        $scope.jsrqOptions = {
            opened: false,
            open: function() {
                $scope.jsrqOptions.opened = true;
            }
        };

        // 结束日期小于开始日期时的提示
        $scope.jsrqTooltipEnableAndOpen = false;
        $scope.$watch('queryExamArrange.endTime', function (newValue) {
            if ($scope.queryExamArrange.startTime && newValue && (newValue < $scope.queryExamArrange.startTime)) {
                $scope.jsrqTooltipEnableAndOpen = true;
                return;
            }
            $scope.jsrqTooltipEnableAndOpen = false;
        });

        // 查询表单显示和隐藏切换
        $scope.isHideSearchForm = false; // 默认显示
        $scope.searchFormHideToggle = function () {
            $scope.isHideSearchForm = !$scope.isHideSearchForm
            if ($scope.isHideSearchForm) {
                $scope.table_height = $scope.table_height + 85;
            } else {
                $scope.table_height = $scope.table_height - 85;
            }
            angular.element('#queryExamArrangeTable').bootstrapTable('resetView',{ 
            	height: $scope.table_height 
            } );
        };
        
    };
	stuExamArrangeQuery_examArrangeQueryController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModal', '$compile', '$cookies', '$rootScope', '$window', 'baseinfo_generalService', 'alertService', 'app'];
})(window);