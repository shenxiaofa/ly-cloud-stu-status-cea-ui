;(function (window, undefined) {
    'use strict';
    // 学生端免考申请模块
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.exemptExaminationApply', {
            url: '/exemptExaminationApply',
            templateUrl: 'tpl/home/exemptExaminationApply/index.html',
            controller: stuApplyExempt_exemptExaminationApplyController,
            ncyBreadcrumb: {
                label: '首页 / 免考申请'
            }
        });
    }]);
})(window);


