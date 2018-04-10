;(function (window, undefined) {
    'use strict';
    // 学生端缓考申请模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.slowExaminationApply', {
            url: '/slowExaminationApply',
            templateUrl: 'tpl/home/slowExaminationApply/index.html',
            controller: stuApplySlow_slowExaminationApplyController,
            ncyBreadcrumb: {
                label: '首页 / 缓考申请'
            }
        });
    }]);
})(window);


