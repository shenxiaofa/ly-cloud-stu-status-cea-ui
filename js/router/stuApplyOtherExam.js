;(function (window, undefined) {
    'use strict';
    // 学生端系统外成绩申请模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.applyOtherExam', {
            url: '/applyOtherExam',
            templateUrl: 'tpl/home/applyOtherExam/index.html',
            controller: stuApplyExam_applyOtherExamController,
            ncyBreadcrumb: {
                label: '首页 / 系统外成绩申请'
            }
        });
    }]);
})(window);

