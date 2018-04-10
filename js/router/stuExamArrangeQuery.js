;(function (window, undefined) {
    'use strict';
    // 学生端考试安排查询
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.examArrangeQuery', {
            url: '/examArrangeQuery',
            templateUrl: 'tpl/home/examArrangeQuery/index.html',
            controller: stuExamArrangeQuery_examArrangeQueryController,
            ncyBreadcrumb: {
                label: '首页 / 考试安排查询'
            }
        });
    }]);
})(window);


