;(function (window, undefined) {
    'use strict';
    // 学生端系统外绑定申请
    hiocsApp.config(['$stateProvider', function ($stateProvider) {
        $stateProvider
        .state('home.common.applyOtherExamBinding', {
            url: '/applyOtherExamBinding',
            templateUrl: 'tpl/home/applyOtherExamBinding/index.html',
            controller: stuApplyExamBinding_applyOtherExamBindingController,
            ncyBreadcrumb: {
                label: '首页 / 申请系统外成绩绑定',
            }
        })
	.state('home.common.applyOtherExamBindingApply', {
            url: '/applyOtherExamBinding/applyOtherExamBindingApply/:params',
            templateUrl: 'tpl/home/applyOtherExamBinding/applyOtherExam.html',
            controller: stuApplyExamBinding_applyOtherExamController,
            ncyBreadcrumb: {
                label: '首页 / 申请系统外成绩绑定 / 申请系统外成绩绑定',
            }
        });
    }]);
})(window);


