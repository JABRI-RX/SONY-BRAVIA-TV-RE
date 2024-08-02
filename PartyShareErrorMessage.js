/*
 * Copyright 2014 Sony Corporation
 */
/* function to handle error messages */
function ErrorMessageClass() {
    var ERR_MSG = new Hashtable();
    ERR_MSG.put(SUCCESS, "Operation Completed Successfully");
    ERR_MSG.put(SESSION_EXP, "Session has expired.");
    ERR_MSG.put(INTER_ERR, "Some internal error occured");
    ERR_MSG.put(PARTIAL_SUCCESS, "Operation has succeeded partially.");
    ERR_MSG.put(FAIL, "Operation could not be completed.");
    ERR_MSG.put(PERMISSION_DENIE, "Permission Denied!");
    ERR_MSG.put(STATUS404, "Request URL does not exist");
    ERR_MSG.put(STATUS_0, "Server is busy.");
    ERR_MSG.put(HTTP_ERROR, "HTTP Server Error Occured. Error code : ");
    ERR_MSG.put(AJAX_NOT_SUP, "AJAX is not supported by your browser");
    ERR_MSG.put(DATA_NOT_FOUND, "Requested data is not available");
    ERR_MSG.put(FOLDER_FOUND, "No photos left");
    ERR_MSG.put(CANNOT_OPERATE , "Request failed.Please try again");
    ERR_MSG.put(UUID_ERROR,"wrong uuid");
    ERR_MSG.put(NICKE_NAME_ERROR,"wrong nickname");
    ERR_MSG.put(FILE_SIZE_ERROR, "This file exceeds the maximum allowable size");
    ERR_MSG.put(FILE_FORMAT_ERROR, "This file is not supported");
    ERR_MSG.put(NOT_FOUND, "This photo is already deleted on TV.");
    ERR_MSG.put(COUNT_OUT_OF_RANGE, "Count out of range.");
    ERR_MSG.put(INDEX_OUT_OF_RANGE, "Index out of range.");
    this.setMessage = function (eCode, eMessage) {
        ERR_MSG.put(eCode, eMessage);
    }
    this.getMessage = function (eCode) {
        return (ERR_MSG.get(eCode));
    }
}