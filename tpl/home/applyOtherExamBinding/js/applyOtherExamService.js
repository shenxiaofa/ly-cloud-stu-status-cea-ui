;(function (window, undefined) {
    'use strict';

    hiocsApp.service("applyOtherExamBinding_applyOtherExamService", ['$http', '$log', 'app', function($http, $log, app) {

        // 添加
        this.courseBinding = function(outSysScoreIds, studentScoreIds , callback) {
            $log.debug("applyOtherExamBinding_applyOtherExamService add run ...");
            $http.post(app.api.address + '/score/outSysScoreApply/courseBinding', {}, {
                    params:{
                        outSysScoreIds:outSysScoreIds,
                        studentScoreIds:studentScoreIds
                    }
                })
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
        this.apply = function(outSideMaintain , callback) {
            $log.debug("applyOtherExamBinding_applyOtherExamService apply run ...");
            console.log(outSideMaintain);
            $http.post(app.api.address + '/score/outSysScoreApply/apply', outSideMaintain)
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
            $log.debug("applyOtherExamBinding_applyOtherExamService delete run ...");
            $log.debug(ids);
            $http.delete(app.api.address + '/score/outSysScoreApply/deleteBinding/'+ids)
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