/*
 * Copyright 2014 Sony Corporation
 */
/********************/
/* load onto WebAPP */
/********************/
//########### Music & Video ############################
var music_aliasname = '';
var music_filename = '';
var music_src = '';
var music_grab = false;
var uploadUrl = '/contentshare/postphoto/';
//######################################################
/* 1. function to read image file from the gallery */
function getLocalPhotos() {
    "use strict;"
    // can not throw when display PU close PS app
    if (mTerminated) {
        $('#mainDivId').append('<div class="greyLayer"></div>');
        return;
    }

    var input = document.getElementById('file');

    // check the input value (just in case)
    if (input.value == "") {
        return;
    }

    var fileObj = input.files[0];
    //########################## filename #############################
    music_grab = false;
    music_aliasname = fileObj.name;
    music_filename = '';
    music_src = '';
    //#################################################################
    //if(!isPhoto(fileObj)) {
    //hidePopup(".loaderpop");
    //ChangeDiv("display", "mainContainer");
    //}
    // filter both video and image but user still can select other contents (music,...).
    // so that need check content after selected.
    if (document.getElementById("file").accept == "image/*") {
        if (!isPhoto(fileObj)) {
            UIerrorpopUp(translationlist['81022']);
            return;
        }
    } else if (document.getElementById("file").accept == "video/*,image/*") {
        if (!isVideo(fileObj) && !isPhoto(fileObj)) {
            UIerrorpopUp(translationlist['64365']);
            return;
        }
    } else if (document.getElementById("file").accept == "audio/*") {
        if (!isMusic(fileObj)) {
            if (isLinux) {
                UIerrorpopUp(translationlist['81022']);
            } else {
                UIerrorpopUp(translationlist['64365']);
            }
            return;
        }
    }

    if (window.FileReader) {
        var errcode = validateLocalFile(fileObj);
        if ("SUCCESS" == errcode) {
            if (isMusic(fileObj)) {
                loadFileTypeMusic(fileObj);
                isMusicListType = true;
            }
            if (isPhoto(fileObj)) {
                // Get orientation, check pixcel size and upload to server (TV).
                getOrientationFromFileObj(fileObj, null);
            } else {
                fileUpload(document.getElementById('formId'), uploadUrl, 'upload');
            }
        } else {
            // PRE-LOADING-CHECK ERROR
            if (errcode == '64371') {
                if (isPhoto(fileObj)) {
                    UIerrorpopUp(translationlist['64371'].replace("[%1]", "10MB"));
                } else {
                    UIerrorpopUp(translationlist['64371'].replace("[%1]", "100MB"));
                }
            } else {
                UIerrorpopUp(translationlist[errcode]);
            }
        }
    }

    // for Android 2.3 (no FileReader API)
    else {
        if (validateFileType(fileObj)) {
            if (isMusic(fileObj)) {
                isMusicListType = true;
                loadFileTypeMusic(fileObj);
            }
            if (isPhoto(fileObj)) {
                // set orientation to the form.
                var form = document.getElementById("formId");
                form['orientationval'].value = 0;
                // Because FileReader API is not supported, pixel size will be checked on Server Side (TV).
            }
            fileUpload(document.getElementById('formId'), uploadUrl, 'upload');
            return;
        } else {
            if (isLinux) {
                UIerrorpopUp(translationlist['81022']);
            } else {
                UIerrorpopUp(translationlist['64365']);
            }
        }
    }
}

/**
 * Loading the tags using the FileAPI.
 */
function loadFileTypeMusic(file) {

    if (window.FileReader)
    {
        var url = file.urn || file.name;
        ID3.loadTags(url, function() {
            showTags(url);
        }, {
            tags: ["title", "artist", "album", "picture"],
            dataReader: FileAPIReader(file)
        });
    }
    else
    {
        //add new item
        var title = file.name;
        var artist = "";
        var nickName = getNickName();
        var itemMusic = createNewItem(title, artist, nickName, 100);
        addingToList(itemMusic);
    }
}

/**
 * Generic function to get the tags after they have been loaded.
 */
function showTags(url) {
    var tags = ID3.getAllTags(url);
    //add new item
    var title = tags.title;
    var artist = tags.artist;
    var nickName = getNickName();
    var itemMusic = createNewItem(title, artist, nickName, 100);
    addingToList(itemMusic);
}

/* 2. get orientation information from file object */
function getOrientationFromFileObj(fileObj, callback) {
    "use strict;"

    // rotation
    var reader = new FileReader();
    reader.onload = function(e) {
        var o = getOrientation(e.target.result);
        readLocalFile(fileObj, o);
    };
    reader.readAsDataURL(fileObj);
}

/* 3. reading local file from the mobile */
function readLocalFile(fileObj, orientation) {
    "use strict;"
    var imageObj = new Image();
    imageObj.onload = function() {
        callbackImgLoadFinsh(this, orientation);
    };
    imageObj.onerror = function() {
        if (isLinux) {
            UIerrorpopUp(translationlist['81022']);
        } else {
            UIerrorpopUp(translationlist['64365']);
        }
    };
    // createObjectURL(blob URL)
    if (window.URL && window.URL.createObjectURL) {
        imageObj.src = window.URL.createObjectURL(fileObj);
    } else if (window.webkitURL && window.webkitURL.createObjectURL) {
        imageObj.src = window.webkitURL.createObjectURL(fileObj);
    } else {
        alert("createObject is not supported.");
    }
}

/* 4. callback function for image loading completion */
function callbackImgLoadFinsh(imgObj, orientation) {
    "use strict;"
    // pixel size check
    if (validateImagePixelSize(imgObj)) {
        // set orientation to the form.
        var form = document.getElementById("formId");
        form['orientationval'].value = orientation;
        try {
            localStorage.setItem('img_width', "" + imgObj.width);
            localStorage.setItem('img_height', "" + imgObj.height);
        } catch (e) {
        }
        fileUpload(document.getElementById('formId'), uploadUrl, 'upload');
    }
    // POST-LOADING-CHECK ERROR
    else {
        var w = imgObj.width;
        var h = imgObj.height;
        if (w < 16 || h < 16)
        {
            UIerrorpopUp(translationlist['64323']);
        }
        else if (w > 16384 || h > 16384)
        {
            UIerrorpopUp(translationlist['64372'].replace("[%1]", "16k x 16k"));
        }
    }
}

function getImageWidth() {
    var width = 0;
    try {
        width = localStorage.getItem('img_width');
    } catch (e) {
    }
    return width;
}

function getImageHeight() {
    var height = 0;
    try {
        height = localStorage.getItem('img_height');
    } catch (e) {
    }
    return height;
}

/*************/
/* utilities */
/*************/

/* generate on click event for file selection */
function FileSelectionEvent() {
    if (isFileSelectionSupported()) {
        // to clear the value of file input.
        document.getElementById("formId").reset();
        var area = document.getElementById("span_file");
        var temp = area.innerHTML;
        area.innerHTML = temp;

        // click the input.
        document.getElementById("file").click();
    } else {
        //TODO: Please move string to translation list.
        UIerrorpopUp(translationlist['64542']);
    }
}

/* validation function */
function validateLocalFile(fileObj) {
    if (!validateFileType(fileObj)) {
        if (isLinux) {
            return '81022';
        } else {
            return '64365';
        }
        return '64365';
    } else if (!validateFileSize(fileObj)) {
        return '64371';
    }
    return "SUCCESS";
}

/* validation for jpg */
function validateFileType(fileObj) {
    return (/\.(jpe|jpg|jpeg|3gp|mp4|mp3|mov)$/i).test(fileObj.name);
}

/* check photo */
function isPhoto(fileObj) {
    return (/\.(jpe|jpg|jpeg)$/i).test(fileObj.name);
}

/* check type music */
function isMusic(fileObj) {
    return (/\.(mp3)$/i).test(fileObj.name);
}

/* check type video */
function isVideo(fileObj) {
    return (/\.(3gp|mp4|mov)$/i).test(fileObj.name);
}

/* check type video */
function isVideoExtension(extension) {
    return (/\.(3gp|mp4|mov)$/i).test(extension);
}

/* validation for size */
function validateFileSize(fileObj) {
    if (isPhoto(fileObj)) {
        /* Image size limit up to 10 MByte */
        return fileObj.size < (10 * 1024 * 1024);
    } else{
        /* Image size limit up to 100 MByte */
        return fileObj.size < (100 * 1024 * 1024);
    }
}

/* validation for pixel */
function validateImagePixelSize(imgObj) {
    "use strict;"
    var w = imgObj.width;
    var h = imgObj.height;
    return ((w != undefined) &&
            (h != undefined) &&
            (w <= 16384) &&
            (h <= 16384) &&
            (w >= 16) &&
            (h >= 16));
}

/* obtain orientation information from Exif */
function getOrientation(dataURL) {
    "use strict;"

    var data = atob(dataURL.split(',')[1]);
    var ptr = 0; // pointer
    while (0xff == data.charCodeAt(ptr)) {
        ++ptr;
        switch (data.charCodeAt(ptr)) {
            case 0xd8: // soi
                ++ptr;
                break;
            case 0xe1: // app1
                ++ptr;
                ptr += 2 + 6; // size + 'Exif' + 0x00 + 0x00
                var be = (data.charAt(ptr) == 'M');
                ptr += 2 + 2 + 4; // endian + tiff mark + start pointer
                var cnt = getShort(data, ptr, be);
                ptr += 2;
                for (var i = 0; i < cnt; ++i) {
                    var tag = getShort(data, ptr, be);
                    var val = getShort(data, ptr + 8, be);
                    ptr += 2 + 2 + 4 + 4; // tag, type, count, value(ptr)
                    if (0x112 == tag)
                        return val;
                }
                break;
            case 0xda: // sos
            case 0xd9: // eoi
                return 0; // not found.
            default:
                ++ptr;
                ptr = ptr + getShort(data, ptr, true /* always big-endian */);
                break;
        }
    }
    return 0; // not found.

    // internal-func
    function getShort(d, p, b) {
        return (b) ? (d.charCodeAt(p) << 8 | d.charCodeAt(p + 1)) : (d.charCodeAt(p + 1) << 8 | d.charCodeAt(p));
    }
}

/* set size of image container(s) */
function setImageContainerSize() {
    var w = document.body.clientWidth * 1.00; // see CSS too.
    var h = document.body.clientHeight * 0.60; // see CSS too.
    var share = document.getElementById("shareImgContainer");
    share.setAttribute("orgw", w);
    share.setAttribute("orgh", h);
    var history = document.getElementById("shareImgContainer");
    history.setAttribute("orgw", w);
    history.setAttribute("orgh", h);
}

/********************/
/* upload to server */
/********************/

/* iframe for target of submit to upload the photo */
var g_fileuploadIframe = null;
var file_submit = null;
var isMusicListType = false;
/* function to Upload Image File Throught Http Post useing Iframe */
function fileUpload(form, action_url, div_id) {
    // JSON RESPONS HANDLINING (event handler)
    var eventHandler = function() {
        document.getElementById("formId").reset();
        var dataObj;
        try {
            dataObj = $.parseJSON($("#upload_iframe_id").contents().find("*").first().text());
        } catch (e) {
            //alert('parseJSON error');
            // errorCallback(SUCCESS, FileUploadUICallBack, "");
            //return;
        }
        if (dataObj != undefined) {
            if (dataObj.result !== undefined && dataObj.result.length == 0) {
                errorCallback(SUCCESS, FileUploadUICallBack, "");
                return;
            }
            if (dataObj.error !== undefined && dataObj.error.length != 0) {
                var codeVal = dataObj.error[0];
                errorCallback(codeVal, FileUploadUICallBack, "");
                return;
            }
        } else {
            errorCallback(DATA_NOT_FOUND, FileUploadUICallBack, "");
            return;
        }
        FileUploadUICallBack(self, "");
    }

    // iframe code
    g_fileuploadIframe = document.createElement("iframe");
    g_fileuploadIframe.setAttribute("id", "upload_iframe_id");
    g_fileuploadIframe.setAttribute("name", "upload_iframe_name");
    g_fileuploadIframe.setAttribute("style", "width: 0; height: 0; border: none;");

    // add iframe to the page.
    form.parentNode.appendChild(g_fileuploadIframe);
    window.frames['upload_iframe_id'].name = "upload_iframe_name";

    // register event handler.
    eventie.bind(g_fileuploadIframe, 'load', eventHandler);

    file_submit = document.getElementById("file");
    var orientation = form['orientationval'].value;
    var w = getImageWidth();
    if (w == null || w == "") {
        w = 0;
    }
    var h = getImageHeight();
    if (h == null || h == "") {
        h = 0;
    }

    var nickname = getNickName().replace(";", "");
    if (nickname == "" || !nickname) {
        nickname = getDefaultUserNickName();
    }
    var filename = new String(getUUID() + new Date().getTime()).hashCode();
    var array = music_aliasname.split(".");
    music_filename = filename + "." + array[array.length - 1];
    if (orientation == null || orientation == "") {
        orientation = "0";
    }

    var id;
    if (isLinux)
    {
        id = getUUID().replace(";", "")
                + ";" + nickname
                + ";" + orientation.replace(";", "")
                + ";" + w
                + ";" + h
                + ";" + filename;
    }
    else
    {
        var j = {
            "UUID": getUUID().replace(";", ""),
            "nickname": nickname, "orientation": orientation.replace(";", ""),
            "w": w,
            "h": h,
            "filename": filename
        };
        id = encodeURIComponent(JSON.stringify(j));
    }
    file_submit.setAttribute("id", id);
    file_submit.setAttribute("name", id);

    // Set properties of form...
    form['uuidval'].value = getUUID();
    form.setAttribute("target", "upload_iframe_name");
    //form.setAttribute("action",  action_url);
    form.setAttribute("action", "cgi-bin/photo_share_cgi.cgi");
    form.setAttribute("method", "post");
    form.setAttribute("enctype", "multipart/form-data");
    //submit form to port 10000 for throwing big file
    //form.action = form.action.replace("/sony", ":10000");
    // Submit the form...
    form.submit();
    if (!isMusicListType) {
        openToastTimmer = setTimeout(function() {
            showToastMessage();
        }, 1000);
    }
    isMusicListType = false;
    //showPopup('.loaderpop');
    file_submit.setAttribute("id", "file");
    file_submit.setAttribute("name", "source");
}

/* callback function of file upload */
var openToastTimmer;
function FileUploadUICallBack(responsObj, reqHeader) {
    clearTimeout(openToastTimmer);
    var form = document.getElementById("formId");
    file_submit.setAttribute("id", "file");
    file_submit.setAttribute("name", "source");
    var errorCode = responsObj.code;
    //setTimeout('g_fileuploadIframe.parentNode.removeChild(g_fileuploadIframe)', 50);
    setTimeout(function() {
        var frame = document.getElementById('upload_iframe_id');
        if (frame != null) {
            frame.parentNode.removeChild(frame);
        }
    }, 50);
    document.getElementById("file").value = "";

    setTimeout(function() {
        //hidePopup('.loaderpop');
        if (errorCode == SUCCESS) {
            //ChangeDiv('throwiconblnk', 'throwiconfinsh');
            //ChangeDiv('mainContainer', 'display');
            getContentList();
            //remove last item in list
            getMusicList();
            return;
        } else {
            //ChangeDiv('throwiconblnk', 'throwiconfinsh');
            if (errorCode == NOT_FOUND) {
                UIerrorpopUp(translationlist['64370']);
            } else if (errorCode == FILE_SIZE_ERROR) {
                UIerrorpopUp(translationlist['64371'].replace("[%1]", "( photo: 10MB, video: 100MB) "));
            } else if (errorCode == FILE_FORMAT_ERROR) {
                if (isLinux) {
                    UIerrorpopUp(translationlist['81022']);
                } else {
                    UIerrorpopUp(translationlist['64365']);
                }
            } else {
                UIerrorpopUp(translationlist['64364']);
            }
            //$("#list :first-child").remove();
            $("#list li").eq(0).remove();
            setMaxHeightMusicList();
        }
    }, 1000);
}
