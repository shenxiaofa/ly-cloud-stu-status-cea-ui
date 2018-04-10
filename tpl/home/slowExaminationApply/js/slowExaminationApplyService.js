;(function (window, undefined) {
    'use strict';

    hiocsApp.service("stuApplyExam_slowExaminationApplyService", ['$http', '$log', 'app', function($http, $log, app) {
        
        // 缓考申请
        this.apply = function(slowCellApply, callback) {
			$http.post(app.api.address + '/exam/slowExam/apply', slowCellApply)
				.then(function successCallback(response) {
					$log.debug(response);
					if(response.data.code == app.api.code.success){
						callback();
					} else {
						callback(true, response.data.message);
					}
				}, function errorCallback(response) {
					$log.debug(response);
					callback(true, response.data.message);
				});
        };
        
        this.deleteAttachment = function (fileId, permission, callback) {
            $http.delete(app.api.address + '/system/informNotice/deleteAttachment', {
                headers : {permission: permission},
                params : {
                    fileId : fileId
                }
            })
            .then(function successCallback(response) {
                if (response.meta.success) {
                    callback();
                } else {
                    callback(true, response.meta.message);
                }
            }, function errorCallback(response) {
                $log.debug(response);
                callback(true, app.api.message.error);
            });
        };
        
        // 下载模板
        this.exportTemplate = function(data, callback) {
            $log.debug("exportTemplate run ...");
            $log.debug(data);
            console.log(data);
            $http.get(app.api.address + '/system/informNotice/downloadAttachment', {
                params: data,
                responseType: 'blob'	// 二进制的流
            })
            .then(function successCallback(response) {
                callback(response.data);
            }, function errorCallback(response) {
                $log.debug(response);
                callback(true, app.api.message.error);
            });
        };

    }]);

})(window);