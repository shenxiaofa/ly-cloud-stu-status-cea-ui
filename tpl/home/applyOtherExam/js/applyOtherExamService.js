;(function (window, undefined) {
    'use strict';

    hiocsApp.service("applyOtherExam_applyOtherExamService", ['$http', '$log', 'app', function($http, $log, app) {

        // 添加
        this.add = function(applyOtherExam , callback) {
            $log.debug("applyOtherExam_applyOtherExamService add run ...");
            $http.post(app.api.address + '/score/outSysScoreApply', applyOtherExam)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback(null, null, response.data);
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 申请
        this.apply = function(applyOtherExam , callback) {
            $log.debug("applyOtherExam_applyOtherExamService apply run ...");
            console.log(applyOtherExam);
            $http.post(app.api.address + '/score/outSysScoreApply/apply', applyOtherExam)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        };

        // 删除
        this.delete = function(ids, callback) {
            $log.debug("applyOtherExam_applyOtherExamService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/score/outSysScoreApply/'+ids)
                .then(function successCallback(response) {
                    if (response.data.code == app.api.code.success) {
                        callback();
                    } else {
                        callback(true, response.data.message);
                    }
                }, function errorCallback(response) {
                    $log.debug(response);
                    callback(true, app.api.message.error);
                });
        }

    }]);

})(window);
