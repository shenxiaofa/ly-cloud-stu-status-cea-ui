;(function (window, undefined) {
    'use strict';
    // 学生端成绩查询模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.examResultsQuery', {
            url: '/examResultsQuery',
            templateUrl: 'tpl/home/examResultsQuery/index.html',
            controller: stuExamResultsQuery_examResultsQueryController,
            ncyBreadcrumb: {
                label: '首页 / 成绩查询'
            }
        });
    }]);
})(window);


