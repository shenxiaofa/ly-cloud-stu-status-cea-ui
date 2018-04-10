;(function (window, undefined) {
    'use strict';
    // 学生端课表查询模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.scheduleQuery', {
            url: '/scheduleQuery',
            templateUrl: 'tpl/home/scheduleQuery/index.html',
            controller: stuScheduleQuery_scheduleQueryController,
            ncyBreadcrumb: {
                label: '首页 / 学生课表查询'
            }
        });
    }]);
})(window);

