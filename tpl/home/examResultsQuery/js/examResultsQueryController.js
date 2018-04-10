;
(function(window, undefined) {
	'use strict';
	window.stuExamResultsQuery_examResultsQueryController = function($scope, $http, $state, $timeout, $cookies, $compile, $rootScope, baseinfo_generalService, $window, app) {
		
		// 获取当前登录用户名
		var cookieasJson = {};
		if($cookies.getObject("user") != null) {
			cookieasJson = JSON.parse($cookies.getObject("user"));
		}
		
		$scope.examPrienting = {};	// 初始化对象
		$scope.coverTotalCredit = 0;	// 总学分
		$scope.coverTotalPoint = 0;	// 总绩点
		$scope.coverModularNames = [];	// 模块对象
		var tempCourseModelId = "";	// 临时的处理模块ID的数组
		$scope.examPrienting.courseModelId = "";	// 最终传递的模块ID的数组
		
        baseinfo_generalService.findAcadyeartermNamesBox(function (error, message,data) {
            if (error) {
                alertService(message);
                return;
            }
            $scope.semesterObjs = data.data;
            var html = '' +
                '<select ui-select2 ng-options="plateObj.id as plateObj.acadYearSemester  for plateObj in semesterObjs" '
                +  ' ng-model="examPrienting.semesterId" id="semesterId" name="semesterId" ui-jq="chosen"ui-options="{search_contains: true}" class="form-control"> '
                +  '<option value="">==请选择==</option> '
                +  '</select>';
            angular.element("#semesterId").parent().empty().append(html);
            $compile(angular.element("#semesterId").parent().contents())($scope);
        });
        
		// 查询参数
		$scope.queryParams1 = function queryParams(params) {
			var pageParam = {
				studentId: cookieasJson.userName,
				semesterId: $scope.examPrienting.semesterId,
				courseModelId: $scope.examPrienting.courseModelId,
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber, //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.queryExamArrange);
		};

		$scope.examPrientingTable1 = {
	        url:app.api.address + '/scheme/studentQuery/credit',
			method: 'get',
			cache: false,
			toolbar: '#toolbar1', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams1, //传递参数（*）
			striped: true,
			pagination: false,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
			search: false,
			clickToSelect: true,
			responseHandler: function(response) {
                var data = {
                    rows : response.data
                }
                return data;
			},
			onLoadSuccess: function() {
				$compile(angular.element('#examPrientingTable1').contents())($scope);
			},
			columns: [
				{field: "courseName",title: "课程",align: "center",valign: "middle",width: "10%"},
				{field: "courseModel",title: "类别",align: "center",valign: "middle",width: "10%"},
				{field: "teacher",title: "教师",align: "center",valign: "middle",width: "10%"},
				{field: "credit",title: "学分",align: "center",valign: "middle",width: "5%"},
				{field: "score",title: "成绩",align: "center",valign: "middle",width: "5%"},
				{field: "scorePoint",title: "绩点",align: "center",valign: "middle",width: "10%"},
				{field: "rank",title: "排名",align: "center",valign: "middle",width: "10%"}
			]
		};

		// 查询表单
		$scope.searchSubmit = function() {
            angular.element('#examPrientingTable1').bootstrapTable('refresh');
		};

		// 查询参数
		$scope.queryParams2 = function queryParams(params) {
			var pageParam = {
				studentId: cookieasJson.userName,
				pageSize: params.pageSize, //页面大小
				pageNo: params.pageNumber, //页码
				sortName: params.sortName,
				sortOrder: params.sortOrder
			};
			return angular.extend(pageParam, $scope.queryExamArrange);
		};

		$scope.examPrientingTable2 = {
			url:app.api.address + '/scheme/studentQuery/creditCount',
			method: 'get',
			cache: false,
//			height: $scope.table_height,
			toolbar: '#toolbar2', //工具按钮用哪个容器
			sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
			queryParamsType: '', // 默认值为 'limit' ,在默认情况下 传给服务端的参数为：offset,limit,sort 设置为 '' 在这种情况下传给服务器的参数为：pageSize,pageNumber
			queryParams: $scope.queryParams2, //传递参数（*）
			striped: true,
			pagination: false,
			pageSize: 10,
			pageNumber: 1,
			pageList: [5, 10, 20, 50],
            paginationPreText: '上一页',
            paginationNextText: '下一页',
			search: false,
			clickToSelect: true,
			showFooter: true,
			responseHandler: function(response) {
                var data = {
                    rows : response.data
                }
                return data;
			},
			onLoadSuccess: function() {
				$compile(angular.element('#examPrientingTable2').contents())($scope);
			},
			columns: [
				{field: "type",title: "类型",align: "center",valign: "middle",width: "15%",
					footerFormatter: function(value){
						for(var i=0; i<value.length; i++){
							var typeCode = "";
							var params = [];
							var tempParams = JSON.parse(JSON.stringify(value[i])).type;
							if(tempParams == '公共基础课'){
								typeCode = "1";
							}else if(tempParams == '专业基础课'){
								typeCode = "2";
							}else if(tempParams == '专业能力课'){
								typeCode = "3";
							}else if(tempParams == '公共素质课'){
								typeCode = "4";
							}else if(tempParams == '专业测试课'){
								typeCode = "5";
							}else if(tempParams == '公共测试课'){
								typeCode = "6";
							}
							params.push(tempParams);
							params.push(typeCode);
							$scope.coverModularNames.push(params);	// 模块对象
						}
				        return '<span width: "15%">总览</span>';
					}
				},
				{field: "gradePoint",title: "绩点",align: "center",valign: "middle",width: "15%",
					footerFormatter: function(value){
						var count = 0;
						for(var i=0; i<value.length; i++){
							if(!isNaN(parseInt(JSON.parse(JSON.stringify(value[i])).gradePoint))){
								count += parseInt(JSON.parse(JSON.stringify(value[i])).gradePoint);
							}
						}
						$scope.$apply(function () {	// 强制更新上去
							$scope.coverTotalPoint = count;	// 总绩点
						});
				        return count;
					}
				},
				{field: "credit",title: "学分",align: "center",valign: "middle",width: "15%",
					footerFormatter: function(value){
						var count = 0;
						for(var i=0; i<value.length; i++){
							if(!isNaN(parseInt(JSON.parse(JSON.stringify(value[i])).credit))){
								count += parseInt(JSON.parse(JSON.stringify(value[i])).credit);
							}
						}
						$scope.$apply(function () {	// 强制更新上去
							$scope.coverTotalCredit = count;	// 总学分
						});
				        return count;
					}
				},
				{field: "modularCredit",title: "",align: "center",valign: "middle",width: "10%",
                    formatter : function (value, row, index) {
                    	var fidderCredit = "0";
                    	if(row.modularCredit != null && row.credit != null){
                    		var fidderCredit = "-" + (row.modularCredit-row.credit);	// 总-当前
                    	}
                        return "<button id='btn_create' type='button' class='btn btn-danger' disabled='disabled'>" + fidderCredit + "</button>";
                    },
					footerFormatter: function(value){
						var count = 0;
						for(var i=0; i<value.length; i++){
							if(!isNaN(parseInt(JSON.parse(JSON.stringify(value[i])).modularCredit))){
								count += parseInt(JSON.parse(JSON.stringify(value[i])).modularCredit);
							}
						}
						count = "-" + count;
				        return "<button id='btn_create' type='button' class='btn btn-danger' disabled='disabled'>" + count + "</button>";
					}
                },
				{field: "completion",title: "完成度",align: "center",valign: "middle",width: "55%",
                    formatter : function (value, row, index) {	// 遇到总览的时候，改变样式为…
                    	var modularCredit = (row.credit/row.modularCredit)*100;
						var totalCredit = 0;
//						for(var i=0; i<value.length; i++){
//							totalCredit += parseInt(JSON.parse(JSON.stringify(value[i])).modularCredit);
//						}
//						totalCredit = "-" + totalCredit;
                    	var creditWidth = (row.credit/totalCredit)*100;	// 计算出百分比
                    	return '<div class="progress active progress-striped" style="margin: 10px 10px;background-color: #ddd;height: 10px; width:' + creditWidth + '%;"><div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:' + modularCredit + '%"> </div></div>';
                    },
					footerFormatter: function(value){
						var count1 = 0.00;
						var count2 = 0.00;
//						var count3 = 0.00;
						for(var i=0; i<value.length; i++){
							count1 += parseInt(JSON.parse(JSON.stringify(value[i])).credit);
							count2 += parseInt(JSON.parse(JSON.stringify(value[i])).modularCredit);
//							count3 += parseInt(JSON.parse(JSON.stringify(value[i])).totalCredit);
						}
                    	var modularCredit = (count1/count2)*100;	// 内部百分比宽度 当前学分总和/该模块的
//                  	var creditWidth = (count1/count3)*100;		// 外部百分比宽度 当前学分总和/总
//                      return '<div class="progress active progress-striped progress-bar-success" style="margin: 10px 0;background-color: #ddd;height: 10px; width:' + creditWidth + '%;"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:' + modularCredit + '%"> </div></div>';
                        return '<div class="progress active progress-striped progress-bar-success" style="margin: 10px 10px;background-color: #ddd;height: 10px; width: 100%;"><div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width:' + modularCredit + '%"> </div></div>';
					}
                }
			]
		};
		
		$scope.checkearItemFun = function(value, $index){
			if(value[2]){
//				tempCourseModelId.push(value[1]);
				tempCourseModelId = tempCourseModelId + value[1] +",";
			}else if(!value[2]){
				tempCourseModelId = tempCourseModelId.substr(0, tempCourseModelId.length - 2);  
			}
			$scope.examPrienting.courseModelId = tempCourseModelId;
			$scope.examPrienting.courseModelId = $scope.examPrienting.courseModelId.substr(0, $scope.examPrienting.courseModelId.length - 1);
			console.log($scope.examPrienting.courseModelId);
            angular.element('#examPrientingTable1').bootstrapTable('refresh');
		};
	
		$scope.echartDatas = [{value:1, name:'90-94'},
		    {value:2, name:'95-100'},
		    {value:3, name:'85-90'},
		    {value:4, name:'80-84'},
		    {value:5, name:'75-79'},
		    {value:6, name:'70-74'},
		    {value:7, name:'<60'},
		    {value:8, name:'65-70'},
		    {value:9, name:'60-64'}
		];
		
		// 获取echarts的数据【成绩分布】
		$http({
			method: "get",
			url: "data_test/index/echartsData.json"
		}).then(function(response) {
//	        angular.forEach(response.data, function(echartData, index, array){
//	        	console.log(echartData[array]);
//	        	console.log(echartData.value);
//	        	console.log(echartData.name);
//	            $scope.echartDatas.push({
//	                value: echartData.value,
//	                name: echartData.name
//	            });
	            $scope.echartDatas = [{value:1, name:'90-94'},
				    {value:2, name:'95-100'},
				    {value:3, name:'85-90'},
				    {value:4, name:'80-84'},
				    {value:5, name:'75-79'},
				    {value:6, name:'70-74'},
				    {value:7, name:'<60'},
				    {value:8, name:'65-70'},
				    {value:9, name:'60-64'}
				];
//	        });
//			console.log($scope.echartDatas);
		}, function(response) {
			
		});
		
	};
	stuExamResultsQuery_examResultsQueryController.$inject = ['$scope', '$http', '$state', '$timeout', '$cookies', '$compile', '$rootScope', 'baseinfo_generalService', '$window', 'app'];
})(window);
