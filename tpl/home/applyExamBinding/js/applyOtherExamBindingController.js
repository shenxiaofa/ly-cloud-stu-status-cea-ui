;(function (window, undefined) {
    'use strict';
    window.stuApplyExamBinding_applyOtherExamBindingController = function ($scope, $http, $state, $timeout, $uibModal, $compile, $rootScope, $window, alertService, app) {

        // 表格的高度
        $scope.table_height = $window.innerHeight-270;

		$scope.applyExamBinding = {
			'courseNum' : 'CYY01',
			'courseName' : 'C语言程序设计',
			'deptName' : '信息科学与技术',
			'credit' : '3',
			'courseProperty' : '必修',
			'courseScore' : '120'
		}
		
        // 查询参数
        $scope.outsideQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.applyOtherExamBinding);
        }

        // 系统外课程列表
        $scope.completeCredit = 0;;
        $scope.outsideCourseTable =  {
            url: 'data_test/scheme/tableview_SchemeVersion.json',
            //url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.outsideQueryParams,//传递参数（*）
            search: false,
            onLoadSuccess: function(data) {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"cnCourseName",title:"课程中文名",align:"center",valign:"middle"},
                {field:"enCourseName",title:"课程英文名",align:"center",valign:"middle"},
                {field:"departmentNam",title:"开课单位",align:"center",valign:"middle"},
                {field:"courseProperty",title:"课程属性",align:"center",valign:"middle"},
                {field:"credit",title:"学分",align:"center",valign:"middle"}
            ]
        };
        
        // 查询参数
        $scope.courseQueryParams = function queryParams(params) {
            var pageParam = {
                pageSize: params.pageSize,   //页面大小
                pageNo: params.pageNumber,  //页码
                sortName: params.sortName,
                sortOrder: params.sortOrder
            };
            return angular.extend(pageParam, $scope.applyOtherExamBinding);
        }

        // 计划课程列表
        $scope.courseCurriculaTable =  {
            url: 'data_test/scheme/tableview_SchemeVersion.json',
            //url: app.api.address + '/scheme/classCurricula/curriculaChange',
            method: 'get',
            cache: false,
            height: $scope.table_height,
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            striped: true,
            pagination: true,
            pageSize: 10,
            pageNumber:1,
            pageList: [10, 20, 30], // 设置可供选择的页面数据条数
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            silentSort: false, // 设置为 false 将在点击分页按钮时，自动记住排序项
            idField : "id", // 指定主键列
            uniqueId: "id", // 每行唯一标识
            queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
            queryParams: $scope.courseQueryParams,//传递参数（*）
            search: false,
            onLoadSuccess: function(data) {
                $compile(angular.element('#teacherIntoTable').contents())($scope);
                $scope.$apply(function () {
                    $scope.completeCredit = 0;
                    for(var index=0; index < data.rows.length; index++){
                        $scope.completeCredit += parseFloat(data.rows[index].credit);
                    }
                });
            },
            columns: [
                {checkbox: true, width: "5%"},
                {field:"semester",title:"课程中文名",align:"center",valign:"middle"},
                {field:"courseNum",title:"课程英文名",align:"center",valign:"middle"},
                {field:"courseName",title:"开课单位",align:"center",valign:"middle"},
                {field:"credit",title:"课程属性",align:"center",valign:"middle"},
                {field:"totalHour",title:"学分",align:"center",valign:"middle"}
            ]
        };
        
    }
	stuApplyExamBinding_applyOtherExamBindingController.$inject = ['$scope', '$http', '$state', '$timeout', '$uibModal', '$compile', '$rootScope', '$window', 'alertService', 'app'];
})(window);