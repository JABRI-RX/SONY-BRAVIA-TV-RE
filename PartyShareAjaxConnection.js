/*
 * Copyright 2014 Sony Corporation
 */
/* Constants for request readystate */
var READYSTATE = 4;

/* Constants for request status*/
var READYSTATUS = 200;
var STATUS404 = 404;
var STATUSBUSY = 0;

/* Constants for document element */
var _DOC = document;

/* Header name*/
var HEADER_NAME = "SONY-PARTYSHARE";

/* constant for json/xml error codes */
var SUCCESS = 0;
var SESSION_EXP = 1;
var INTER_ERR = 2;
var PARTIAL_SUCCESS = 202;
var FAIL = 200;
var PERMISSION_DENIE = 300;
var HTTP_ERROR = -1;
var AJAX_NOT_SUP = -2;
var FOLDER_FOUND = -4;
var DATA_NOT_FOUND = -3;
var STATUS_0 = -5;

/* common class for making ajax request
 * accepts the url, data and the callback function name
 */
function AJAXInteraction(url, data, ajaxCallback, userCallback, reqHeaderVal) {
    var req = init();
    if (req == null) {
        errorCallback(AJAX_NOT_SUP, ajaxCallback, userCallback, req.getResponseHeader(HEADER_NAME));
        return;
    }
    req.onreadystatechange = processRequest;
    /* function to be called on ready state change of request */
    function processRequest() {
        if (req.readyState == READYSTATE) {
            if (req.status == READYSTATUS) {
                if (ajaxCallback) {
                    if (req.responseText == null) {
                        UIerrorpopUp("Response JSON is null!");
                        return;
                    }
                    var JSONObject = JSON.parse(req.responseText);
                    ajaxCallback(JSONObject, userCallback, req.getResponseHeader(HEADER_NAME));
                }
            } else {
                if (req.status == STATUSBUSY) {
                    errorCallback(STATUS_0, userCallback, req.getResponseHeader(HEADER_NAME));
                } else {
                    errorCallback(req.status, userCallback, req.getResponseHeader(HEADER_NAME));
                }
                return;
            }
        }
    }
    /* sending the request with data */
    //req.open("POST", url, true);
        req.open("POST", "cgi-bin/photo_share_cgi.cgi", true);
    var reqJSON = "";
    req.setRequestHeader("Content-Type", "application/json");
    reqJSON = data;
    req.send(reqJSON);
}

/* function to handle error class */
function ObjError() {
    this.code = null;
    this.message = "";
}

/* function to Handle error message */
function errorCallback(pCode, userCallback, reqHeader, response) {
    var objErrorMessage = new ErrorMessageClass();
    var error = new ObjError();
    error.code = pCode;
    error.message = objErrorMessage.getMessage(Number(pCode));
    if (error.message == null) {
        error.message = objErrorMessage.getMessage(HTTP_ERROR) + pCode;
    }
    delete objErrorMessage;
    userCallback(error, reqHeader);
}

/* function to return the request object */
function init() {
    if (window.ActiveXObject) {
        var aVersions = ["Msxml2.XMLHTTP.5.0", "Msxml2.XMLHTTP.4.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i = 0; i < aVersions.length; i++) {
            try {
                var oXmlHttp = new ActiveXObject(aVersions[i]);
                return oXmlHttp;
            } catch (oError) {
                //Do nothing
            }
        }
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    } else {
        return null;
    }
}