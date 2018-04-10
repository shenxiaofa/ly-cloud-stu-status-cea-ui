;(function (window, undefined) {
    'use strict';
    window.stuApplyExamBinding_applyExamBindingController = function ($scope, $http, $compile, $rootScope, $window, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight-285;

		$scope.applyExamBinding = {
			'courseNum' : 'CYY01',
			'courseName' : 'C语言程序设计',
			'deptName' : '信息科学与技术',
			'credit' : '3',
			'courseProperty' : '必修',
			'courseScore' : '120'
		}
		
        // 查询参数
        $scope.queryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.applyExamBinding);
        }

        // 申请成绩绑定 table
        $scope.applyExamBindingTable = {
            url: 'data_test/exam/tableview_examinationMethodApproval.json',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            toolbar: '#toolbar', //工具按钮用哪个容器
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            sortOrder: 'desc', // 默认排序方式
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "xnxq", // 指定主键列
            uniqueId: "xnxq", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.queryParams,//传递参数（*）
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            search: false,
            showColumns: true,
            showRefresh: true,
            clickToSelect: true,
            onLoadSuccess: function() {
                $compile(angular.element('#applyExamBindingTable').contents())($scope);
            },
            columns: [
                {checkbox: true,width: "3%"},
                {field:"xnxq",title:"课程中文名",align:"center",valign:"middle"},
                {field:"sqr",title:"课程英文名",align:"center",valign:"middle"},
                {field:"sqrszxy",title:"开课单位",align:"center",valign:"middle"},
                {field:"spzt",title:"课程属性",align:"center",valign:"middle"},
                {field:"spzt",title:"学分",align:"center",valign:"middle"}
            ],
        };
        
    }
	stuApplyExamBinding_applyExamBindingController.$inject = ['$scope', '$http', '$compile', '$rootScope', '$window', 'alertService', 'app'];
})(window);