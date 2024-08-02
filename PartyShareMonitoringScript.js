/*
 * Copyright 2014 Sony Corporation
 */
/* Resource initialization */
var g_polling_xhr = "";
var g_seqnum = 0;
var g_userAgent = "";
var g_networkName = "";
var g_polling_check = "";
var mTerminated = false;
/* function to Start requestToNotifyEvent from mobile to TV functionality */
function startMonitorEvent(seqNum) {
    "use strict;"
    // to check the blank timeline
    if (seqNum == 0 && isTimeline()) {
        document.getElementById("getPhotoListAll").style.display = "none";
        document.getElementById("getPhotoListBlank").style.display = "block";
    }

    // param
    g_userAgent = window.navigator.userAgent.toLowerCase();

    // start XHR
    setTimeout(doXHR, 500);
}

/* function to create xmlHttpRequest object and making connection to TV  */
function doXHR() {
    "use strict;"

    // pre check
    if (g_polling_xhr && g_polling_xhr.readystate != 4) {
        g_polling_xhr.abort();
    }

    // creation of requestToNotifyEvent method request json object
    var item = {};
    item["uuid"] = getUUID();
    item["seqNum"] = isSafari(g_userAgent) ? 0 : g_seqnum;

    var paramObj = [];
    paramObj.push(item);

    var JSONObj = {};
    JSONObj['method'] = "requestToNotifyEvent";
    JSONObj['params'] = paramObj;
    JSONObj['id'] = 72;
    JSONObj['version'] = "1.0";

    // creation and making connection of XMLHttpRequest API
    g_polling_xhr = new XMLHttpRequest();
    g_polling_xhr.onreadystatechange = callbackXHR;
    //g_polling_xhr.open("POST", webAPIName, true);
    g_polling_xhr.open("POST", "cgi-bin/photo_share_cgi.cgi", true);
    g_polling_xhr.setRequestHeader('Content-Type', 'application/json');
    g_polling_xhr.timeout = 100 * 1000; // msec
    g_polling_xhr.send(JSON.stringify(JSONObj));
    /* after 5s check if polling XHR die then send it again. */
    clearTimeout(g_polling_check);
    g_polling_check = setTimeout("doXHR()", 5000);
}

/* function to handle callback of XHR  */
function callbackXHR() {
    "use strict;"

    if (g_polling_xhr.readyState == 4 && g_polling_xhr.status == 200) {
        // parse the response.
        var data = JSON.parse(g_polling_xhr.responseText);
        var errorCode = (undefined != data.error && 0 != data.error.length) ? data.error[0] : 0;
        var eventName = "";
        var newseq = 0;
        if (undefined != data.result && 0 != data.result.length) {
            newseq = data.result[0].seqNum;
            eventName = data.result[0].eventName;
        }

        // invoke event handler
        if (g_seqnum < newseq) {
            g_seqnum = newseq;
            MonitoringEventHandler(data);
        }

        g_polling_xhr.abort();

        // do XHR again
        // - 7 ... service not avalibable.
        if (eventName == "terminated") {
            // don't send XHR.
            // disable long press -> no save as photo when PartyShareApp was teminated.
            disable();
        } else if (errorCode == 7) {
            UITerminatePopUp(translationlist['64543'].replace("[%1]", translationlist['80409']));
        } else {
            /* fix bug DM15GN1-2486, on Ipad/Phone, terminate popup doesnot display when close PhotoShare App by remote control */
            setTimeout(doXHR, 500);
        }
    }
}

/* function to handle Monitoring Events  */
function MonitoringEventHandler(data) {
    "use strict;"

    if (data.result !== undefined && data.result.length != 0) {
        var currentEvent = data.result[0].eventName;
        var newFileName = data.result[0].fileName;
        // event handler
        do { // dummy loop [BEGIN]
            if (isTimeline()) {
                if (currentEvent == "newContent") {
                    if (-50 != myScroll.y) {
                        $('.notification').slideDown('fast');
                        window.setTimeout(fadeOutClose, 3000);
                    }
                    break;
                }
                if (currentEvent == "current") {
                    if ((/\.(mp3|wav)$/i).test(newFileName))
                    {
                        getMusicList();
                        //getContentList();
                    }
                    else
                    {
                        //getUserListCall();
                        updateGetPhotoList("current", newFileName);
                    }

                    break;
                }
                if (currentEvent == "newUser") {
                    //getUserListCall();
                    getContentList();
                    break;
                }
                if (currentEvent == "nickname") {
                    updateNickNameUUID();
                    break;
                }
                if (currentEvent == "usbDisconnected") {
                    // stop XHR
                    g_polling_xhr.abort();
                    if (window.stop !== undefined && document.getElementById("display").style.display != "") {
                        window.stop();
                    }
                    g_oldTimeLineObject = "";
                    getContentList();
                    if (document.getElementById("display").style.display != "" && document.getElementById("throwiconblnk").style.display == "none") {
                        ChangeDiv("mainContainer", "display");
                        ChangeDiv('throwiconblnk', 'throwiconanim');
                    }
                    break;
                }
            }
            if (currentEvent == "terminated") {
                // stop XHR
                mTerminated = true;
                g_polling_xhr.abort();
                clearTimeout(g_polling_check);
                if (window.stop !== undefined) {
                    window.stop();
                }
                g_oldTimeLineObject = "";
                var popupArrayList =
                        new Array(".popup",
                        ".controlbgmPopup",
                        ".exitPopup",
                        ".editusernamepopup");
                for (var j = 0; j < popupArrayList.length; ++j) {
                    hidePopup(popupArrayList[j]);
                }
                forceResetNickName();
                showTerminatedPopup();
                setNickNameEdited('false');
                break;
            }
        } while (0); // dummy loop [END]
    }
}

/* function to check the IOS devices */
function isSafari(ua) {
    return (-1 != ua.indexOf('ipad')) || (-1 != ua.indexOf('iphone'));
}

/* function to show Terminate Popup */
function showTerminatedPopup() {
    if (isTimeline()) {
        g_avtive_popup_id = "";
        if (document.getElementById("popupMusicList").style.display === "block") {
            hideMusicListPopup();
        } else if (document.getElementById("popupOptionMenu").style.display === "block") {
            showHideOptionMenuPopup();
        } else if (document.getElementById("editNickName").style.display === "block") {
            handleEditNickNameOpenClose();
        } else if (document.getElementById("saveContentDialog").style.display === "block") {
            showHideSaveContentPopup();
        } else if (document.getElementById("exitPartyShareDialog").style.display === "block") {
            showHideExitPartySharePopup();
        } else if (document.getElementById("tutorialPopup").style.display === "block") {
            document.getElementById("tutorialPopup").style.display = "none";
            $('.tutorialGreyLayer').remove();
        }else if (document.getElementById("toastMessage").style.display === "block") {
            document.getElementById("toastMessage").style.display = "none";
        }
    }
    UITerminatePopUp(translationlist['64423'].replace("[%1]", translationlist['80409']).replace("[%d]", "<span><b>" + g_networkName + "</b></span>"));
}
