/*
 * Copyright 2014 Sony Corporation
 */
function GetContentListClass() {
    "use strict;"

    this.count = 50;
    this.index = 0;
    this.fileName = "";
    this.uuid = "";
    this.userNickname = "";
    this.originalUrl = "";
    this.thumbnailUrl = "";
    this.originalOrientation = "";
    this.thumbnailOrientation = "";
    this.method = "";
    this.photoListArr = new Array();
    this.uuidNames = new Hashtable();
    this.fullURLList = new Hashtable();
    this.status = "";
    this.fileNameAlias = "";
    this.artistName = "";
    this.type = "";
    this.size = 0;
    this.avatarUrl = "";
    /* function to handle getPhotoList functionality */
    this.getContentList = function(callback, reqHeader) {
        "use strict;"

        var self = this;
        var data = self.getContentListObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, getPhotoListCallBack, callback, reqHeader);

        function getPhotoListCallBack(request, callback, reqHeader) {
            "use strict;"
            var data = request;
            if (data == typeof ('undefined')) {
                errorCallback(DATA_NOT_FOUND, callback, reqHeader);
            }
            if (data.result !== undefined) {
                if (data.result.length != 0) {
                    self.uuidNames = new Hashtable();
                    self.fullURLList = new Hashtable();
                    for (var i = 0; i < data.result.length; ++i) {
                        var obj = data.result[i];
                        if (isLinux && obj.type == "music" && obj.status != MEDIA_PAUSED
                                && obj.status != MEDIA_PLAYING) {
                            // if linux model, only keep 1 playing item in music list.
                            continue;
                        }
                        var photoListObj = new GetContentListClass();
                        // set parameters.
                        photoListObj.index = obj.index;
                        photoListObj.fileName = obj.fileName;
                        photoListObj.userNickname = obj.userNickname;
                        photoListObj.uuid = obj.uuid;
                        photoListObj.originalUrl = obj.originalUrl;
                        photoListObj.thumbnailUrl = obj.thumbnailUrl;
                        photoListObj.originalOrientation = obj.originalOrientation;
                        photoListObj.thumbnailOrientation = obj.thumbnailOrientation;
                        photoListObj.status = obj.status;
                        photoListObj.fileNameAlias = obj.fileNameAlias;
                        photoListObj.artistName = obj.artistName;
                        photoListObj.type = obj.type;
                        photoListObj.size = obj.size;
                        photoListObj.avatarUrl = getAvartarByUUID(obj.uuid);
                        // update array & hash
                        if (isLinux && obj.type == "music") {
                            self.photoListArr[0] = photoListObj;
                        } else {
                            self.photoListArr[i] = photoListObj;
                        }
                        self.uuidNames.put(obj.uuid, obj.userNickname);
                        self.fullURLList.put(obj.fileName, photoListObj);
                    }
                    if (isLinux && obj.type == "music" && self.photoListArr.length == 0) {
                        if (data.result.length > 0) {
                            var obj = data.result[0];
                            var photoListObj = new GetContentListClass();
                            // set parameters.
                            photoListObj.index = obj.index;
                            photoListObj.fileName = obj.fileName;
                            photoListObj.userNickname = obj.userNickname;
                            photoListObj.uuid = obj.uuid;
                            photoListObj.originalUrl = obj.originalUrl;
                            photoListObj.thumbnailUrl = obj.thumbnailUrl;
                            photoListObj.originalOrientation = obj.originalOrientation;
                            photoListObj.thumbnailOrientation = obj.thumbnailOrientation;
                            photoListObj.status = obj.status;
                            photoListObj.fileNameAlias = obj.fileNameAlias;
                            photoListObj.artistName = obj.artistName;
                            photoListObj.type = obj.type;
                            photoListObj.size = obj.size;
                            photoListObj.avatarUrl = getAvartarByUUID(obj.uuid);
                            self.photoListArr[0] = photoListObj;

                        }
                    }
                }
                callback(self, reqHeader);
            }
            if (data.error !== undefined && data.error.length != 0) {
                var codeVal = data.error[0];
                errorCallback(codeVal, callback, reqHeader);
            }
        }
    };

    /* function to handle getPhotoList request object functionality */
    this.getContentListObject = function() {
        "use strict;"
        var reqJSONObject = {
            "id": 33,
            "method": "getContentList",
            "params": [{
                    "count": 50,
                    "index": 0,
                    "type": this.type
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };

    /* function to handle togglePlayStatus functionality */
    this.togglePlayStatus = function(callback, reqHeader) {
        "use strict;"

        var self = this;
        var data = self.togglePlayStatusObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, togglePlayStatusCallBack, callback, reqHeader);

        function togglePlayStatusCallBack(request, callback, reqHeader) {
            "use strict;"

            var data = request;
            if (data == typeof ('undefined')) {
                errorCallback(DATA_NOT_FOUND, callback, reqHeader);
            }
            if (data.result !== undefined && data.result.length == 0) {
                callback(self, reqHeader);
            }
            if (data.error !== undefined && data.error.length != 0) {
                var codeVal = data.error[0];
                errorCallback(codeVal, callback, reqHeader);
            }
        }
    };
    /* function to handle togglePlayStatus request object functionality */
    this.togglePlayStatusObject = function() {
        "use strict;"
        var methodName = "togglePlayStatus";
        if (isLinux) {
            if ("music" == this.type) {
                methodName = "togglePlayStatus";
            } else {
                methodName = "playPhotoContent";
            }
        }
        var reqJSONObject = {
            "id": 52,
            "method": methodName,
            "params": [{
                    "fileName": this.fileName
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };
}