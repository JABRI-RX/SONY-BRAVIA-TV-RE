/*
 * Copyright 2014 Sony Corporation
 */
function setUserNickNameClass() {
    /* function to handle setUserNickName functionality */
    this.setNickNameObject = function(callback, reqHeader) {
        var self = this;
        var data = self.getnicknameParameterObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, GetUserNickNameInfoCallBack, callback, reqHeader);

        function GetUserNickNameInfoCallBack(request, callback, reqHeader) {
            var data = request;
            if (data != undefined) {
                if (data.result !== undefined && data.result.length == 0) {
                    errorCallback(SUCCESS, callback, reqHeader);
                } else if (data.error !== undefined && data.error.length != 0) {
                    var codeVal = data.error[0];
                    errorCallback(codeVal, callback, reqHeader);
                } else {
                    errorCallback(DATA_NOT_FOUND, callback, reqHeader);
                }
            }
        }
    };

    /* function to handle setUserNickName request object functionality */
    this.getnicknameParameterObject = function() {
        var reqJSONObject = {
            "id": 36,
            "method": "setUserNickName",
            "params": [{
                    "nickname": this.nickname,
                    "uuid": this.uuid
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };
}

function getUserListClass() {
    this.avatarUrl = "";
    this.uuid = "";
    this.userNickname = "";
    this.userListArr = new Array();

    /* function to handle getUserList functionality */
    this.getUserList = function(callback, reqHeader) {
        "use strict;"

        var self = this;
        var data = self.getUserListObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, getUserListCallBack, callback, reqHeader);

        function getUserListCallBack(request, callback, reqHeader) {
            "use strict;"

            var data = request;

            if (data == typeof ('undefined')) {
                errorCallback(DATA_NOT_FOUND, callback, reqHeader);
            }
            if (data.result != undefined && data.result.length != 0) {
                if (!g_userList)
                {
                    g_userList = new Array();
                }
                while (g_userList.length) {
                    g_userList.pop();
                }
                for (var i = 0; i < data.result.length; i++) {
                    var userObj = new getUserListClass();
                    userObj.avatarUrl = data.result[i].avatarUrl;
                    userObj.uuid = data.result[i].uuid;
                    userObj.userNickname = data.result[i].userNickname;
                    g_userList.push(userObj);
                }
                callback(self, reqHeader);
            }
            if (data.error !== undefined && data.error.length != 0) {
                var codeVal = data.error[0];
                errorCallback(codeVal, callback, reqHeader);
            }
        }
    };
    /* function to handle getUserList request object functionality */
    this.getUserListObject = function() {
        var reqJSONObject = {
            "id": 33,
            "method": "getUserList",
            "params": [],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };
}

function PartyShareControlClass() {
    this.ssid = "";
    this.startTime = "";
    this.KeyType = "";
    this.Key = "";
    this.DeviceName = "";
    this.URL = "";
    this.method = "";
    this.connectionParamArr = new Array();
    this.playback = "";
    this.degree = "";
    this.filename = "";
    this.mode = "";
    this.touchPadRemote = "";

    /* function to handle getPartyShareServerInfo functionality */
    this.GetPartyShareServerInfo = function(callback, reqHeader) {
        var self = this;
        var data = self.getConnectionParameterObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, GetPartyShareServerInfoCallBack, callback, reqHeader);

        function GetPartyShareServerInfoCallBack(request, callback, reqHeader) {
            var data = request;
            if (data == typeof ('undefined')) {
                errorCallback(DATA_NOT_FOUND, callback, reqHeader);
            }
            if (data.result !== undefined && data.result.length != 0) {
                self.ssid = data.result[0].ssid;
                self.startTime = data.result[0].startTime;
                self.KeyType = data.result[0].keyType;
                self.Key = data.result[0].key;
                self.DeviceName = data.result[0].deviceName;
                self.URL = data.result[0].url;
                self.touchPadRemote = data.result[0].touchPadRemote;
                callback(self, reqHeader);
            }
            if (data.error !== undefined && data.error.length != 0) {
                var codeVal = data.error[0];
                errorCallback(codeVal, callback, reqHeader);
            }
        }
    };

    /* function to handle getPartyShareServerInfo request object functionality */
    this.getConnectionParameterObject = function() {
        var reqJSONObject = {
            "id": 80,
            "method": "getContentShareServerInfo",
            "params": [],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };

    /* function to handle closePartyShare functionality */
    this.closePartyShareApp = function(callback, reqHeader) {
        var self = this;
        var data = self.closePartyShareAppObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, closePartyShareAppCallBack, callback, reqHeader);

        function closePartyShareAppCallBack(request, callback, reqHeader) {
            var data = request;
            if (data != undefined) {
                if (data.result !== undefined && data.result.length == 0) {
                    errorCallback(SUCCESS, callback, reqHeader);
                } else if (data.error !== undefined && data.error.length != 0) {
                    var codeVal = data.error[1];
                    errorCallback(codeVal, callback, reqHeader);
                } else {
                    errorCallback(DATA_NOT_FOUND, callback, reqHeader);
                }
            }
        }
    };

    /* function to handle closePartyShare request object functionality */
    this.closePartyShareAppObject = function() {
        var reqJSONObject = {
            "id": 45,
            "method": "closeContentShare",
            "params": [],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };

    /* function to handle setBgmControlMode functionality */
    this.controlBgm = function(callback, reqHeader) {
        var self = this;
        var data = self.controlBgmObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, controlBgmCallBack, callback, reqHeader);

        function controlBgmCallBack(request, callback, reqHeader) {
            var data = request;
            if (data != undefined) {
                if (data.result !== undefined && data.result.length == 0) {
                    errorCallback(SUCCESS, callback, reqHeader);
                } else if (data.error !== undefined && data.error.length != 0) {
                    var codeVal = data.error[1];
                    errorCallback(codeVal, callback, reqHeader);
                } else {
                    errorCallback(DATA_NOT_FOUND, callback, reqHeader);
                }
            }
        }
    };

    /* function to handle setBgmControlMode request object functionality */
    this.controlBgmObject = function() {
        var reqJSONObject = {
            "id": 99,
            "method": "setBgmControlMode",
            "params": [{
                    "playback": this.playback,
                    "url": ""
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };

    /* function to handle setRotationDegree functionality */
    this.setRotationDegree = function(callback, reqHeader) {
        var self = this;
        var data = self.setRotationDegreeObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, setRotationDegreeCallBack, callback, reqHeader);

        function setRotationDegreeCallBack(request, callback, reqHeader) {
            var data = request;
            if (data != undefined) {
                if (data.result !== undefined && data.result.length == 0) {
                    errorCallback(SUCCESS, callback, reqHeader);
                } else if (data.error !== undefined && data.error.length != 0) {
                    var codeVal = data.error[1];
                    errorCallback(codeVal, callback, reqHeader);
                } else {
                    errorCallback(DATA_NOT_FOUND, callback, reqHeader);
                }
            }
        }
    };

    /* function to handle setRotationDegree request object functionality */
    this.setRotationDegreeObject = function() {
        var reqJSONObject = {
            "id": 22,
            "method": "rotatePhoto",
            "params": [{
                    "fileName": this.filename,
                    "rotationDegree": this.degree,
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };

    /* function to handle setQuickInvitationMode functionality */
    this.setQuickInvitationMode = function(callback, reqHeader) {
        var self = this;
        var data = self.setQuickInvitationModeObject();
        self.method = webAPIName;
        var a = new AJAXInteraction(self.method, data, setQuickInvitationModeCallBack, callback, reqHeader);

        function setQuickInvitationModeCallBack(request, callback, reqHeader) {
            var data = request;
            if (data != undefined) {
                if (data.result !== undefined && data.result.length == 0) {
                    errorCallback(SUCCESS, callback, reqHeader);
                } else if (data.error !== undefined && data.error.length != 0) {
                    var codeVal = data.error[1];
                    errorCallback(codeVal, callback, reqHeader);
                } else {
                    errorCallback(DATA_NOT_FOUND, callback, reqHeader);
                }
            }
        }
    };

    /* function to handle setQuickInvitationMode request object functionality */
    this.setQuickInvitationModeObject = function() {
        var reqJSONObject = {
            "id": 47,
            "method": "setQuickInvitationMode",
            "params": [{
                    "mode": this.mode
                }],
            "version": "1.0"
        };
        return JSON.stringify(reqJSONObject);
    };
}