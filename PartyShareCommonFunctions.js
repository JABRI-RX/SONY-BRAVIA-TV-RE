/*
 * Copyright 2014 Sony Corporation
 */
/* Resource initialization */
var hideDialogId = "";
//var webAPIName = "/sony/contentshare";
var webAPIName = "/contentshare";
//var isLinux = false;
var g_userList = new Array();
var isLinux = true;
var FROM_DLNA_NICK_NAME = " ";

/* Error code Resource initialization */
var NOT_FOUND = 41804;
var COUNT_OUT_OF_RANGE = 41801;
var INDEX_OUT_OF_RANGE = 41802;
var REQUEST_RETRY = 40000;
var CLIENT_OVER_MAXIMUM = 40001;
var REQUEST_DUPLICATED = 40003;
var CANNOT_OPERATE = 7;
var FILE_SIZE_ERROR = 41809;
var FILE_FORMAT_ERROR = 41803;
var UUID_ERROR = 41806;
var NICKE_NAME_ERROR = 41807;

//following flags are initialized when page load event happen.
//flag whether the page is rotated with 90 degree or not.
var g_isRotated = false;
//flag whther the device is on Portrait mode or not.
var g_isPortraitMode = false;
//flag whether the page loading is done on Portrait mode.
var g_isLoadDoneOnPortrait = false;
//flag whether the page loaded first time
var g_isLoadPageFirstTime = false;
var g_avatarName = "";
var g_avtive_popup_id = "";
/*flag check platform*/
var iOS;
var android;
/*Check is allow get data*/
var isAllowGetData = false;

/*
 * on load - set ios, android flag
 * */
jQuery(document).ready(function() {
    android = isMobile.Android();
    iOS = isMobile.iOS();
});
/*
 * function check platform & browser
 * */
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
/* function to handle show popup */
function showPopup(cls) {
    if (cls != ".loaderpop") {
        if (cls == ".landscapePopup") {
            $('#mainDivId').append('<div class="landscapGreyLayer"></div>');
        } else {
            hideDialogId = cls;
            $('#mainDivId').append('<div class="greyLayer"></div>');
        }
    }
    $(cls).show();
    popTitleWidth = $('.popupTitle').width();
    $('.popupContent').css('width', popTitleWidth);
}

/* function to handle hide popup */
function hidePopup(cls) {
    if (cls != ".errorPopupClose")
        $(cls).hide();
    if (cls != ".loaderpop" && cls != ".errorPopupClose") {
        if (cls != ".landscapePopup") {
            $('.greyLayer').remove();
            $('.greyLayerTut').remove();
        } else {
            $('.landscapGreyLayer').remove();
        }
    } else {
        $('.loaderPopupGreyLayer').remove();
    }
    if (cls == ".errorPopup") {
        /* after error popup is closed, check need re-open popup which is closed when show error popup. */
        if (isTimeline()) {
            if (g_avtive_popup_id != "") {
                setTimeout(function() {
                    $('#' + g_avtive_popup_id).popup("open");
                    g_avtive_popup_id = "";
                }, 100);
            }
        }
    }
}

/* function to handle error pop */
function UIerrorpopUp(massage) {
    if (isTimeline()) {
        /* close current popup to show error popup. */
        if (document.getElementById("popupMusicList").style.display === "block") {
            hideMusicListPopup();
            g_avtive_popup_id = "popupMusicList";
        } else if (document.getElementById("popupOptionMenu").style.display === "block") {
            showHideOptionMenuPopup();
            g_avtive_popup_id = "popupOptionMenu";
        } else if (document.getElementById("editNickName").style.display === "block") {
            handleEditNickNameOpenClose();
            g_avtive_popup_id = "editNickName";
        } else if (document.getElementById("saveContentDialog").style.display === "block") {
            showHideSaveContentPopup();
            g_avtive_popup_id = "saveContentDialog";
        } else if (document.getElementById("exitPartyShareDialog").style.display === "block") {
            showHideExitPartySharePopup();
            g_avtive_popup_id = "exitPartyShareDialog";
        } else if (document.getElementById("toastMessage").style.display === "block") {
            document.getElementById("toastMessage").style.display = "none";
            g_avtive_popup_id = "toastMessage";
        }
    }
    /* Fix bug: display double error popup */
    document.getElementById("DyanamicInputDiv").innerHTML = "";
    var divElm1 = document.createElement("div");
    divElm1.className = "errorPopup";
    divElm1.id = "popupId";
    var ulElm = document.createElement("ul");
    ulElm.id = "errorNavlist";
    var liElm = document.createElement("li");
    liElm.className = "errorText";
    liElm.innerHTML = massage;
    ulElm.appendChild(liElm);
    var divElm4 = document.createElement("div");
    divElm4.className = "errorPopupFooter";
    divElm4.innerHTML = translationlist['3'];
    if (document.getElementById("display").style.display === "block" || document.getElementById("display").style.display === "") {
        divElm4.setAttribute("onclick", "hidePopup('.errorPopup'),ChangeDiv('mainContainer', 'display')");
    } else {
        divElm4.setAttribute("onclick", "hidePopup('.errorPopup')");
    }
    var divElm5 = document.createElement("div");
    divElm5.className = "clearLeft";
    divElm1.appendChild(ulElm);
    divElm1.appendChild(divElm4);
    divElm1.appendChild(divElm5);
    document.getElementById("DyanamicInputDiv").appendChild(divElm1);
    showPopup(".errorPopup");
}

/* function to handle Terminated error pop */
function UITerminatePopUp(massage) {
    var divElm1 = document.createElement("div");
    divElm1.className = "errorPopupClose";
    divElm1.id = "terminatePopupId";
    var ulElm = document.createElement("ul");
    ulElm.id = "errorNavlistClose";
    var liElm = document.createElement("li");
    liElm.className = "errorTextClose";
    liElm.innerHTML = massage;
    ulElm.appendChild(liElm);
    var divElm5 = document.createElement("div");
    divElm5.className = "clearLeft";
    divElm1.appendChild(ulElm);
    divElm1.appendChild(divElm5);
    document.getElementById("DyanamicInputDiv").appendChild(divElm1);
    showPopup(".errorPopupClose");
}

/* function to handle Landscap popup */
function UILandscapPopUp(massage) {
    var divElm1 = document.createElement("div");
    divElm1.className = "landscapePopup";
    divElm1.id = "LandscapPopupId";
    var ulElm = document.createElement("ul");
    ulElm.id = "landscapeNav";
    var liElm = document.createElement("li");
    liElm.className = "landscapeText";
    liElm.innerHTML = massage;
    ulElm.appendChild(liElm);
    var divElm5 = document.createElement("div");
    divElm5.className = "clearLeft";
    divElm1.appendChild(ulElm);
    divElm1.appendChild(divElm5);
    document.getElementById("DyanamicLandscapDiv").appendChild(divElm1);
    showPopup(".landscapePopup");
}

/* function to handle close PartyShare */
function closePartyShare() {
    hidePopup('.errorPopup');
    window.close();
}

/* function to control change UI */
function ChangeDiv(orginal, current) {
    if (orginal === "mainContainer") {
        setTimeout(function() {
            myScroll.refresh();
        }, 0);
    }
    $("#" + orginal).show();
    $("#" + current).hide();
}

/* Function to check the timeline page */
function isTimeline() {
    return document.URL.match(/tl.html/i) == "tl.html";
}

/* Function to hide URL bar of the browser*/
function hideAddressBar() {
    //Check iPhone OS version.
    //iPhone userAgent has "iPhone OS 7" strings
    navigator.userAgent.match(/iPhone OS (\w+){1,3}/g);
    var version = (RegExp.$1.replace(/_/g, '') + '00').slice(0, 3);
    if (android) {
        setTimeout(function() {
            if (document.documentElement.scrollHeight < window.outerHeight / window.devicePixelRatio) {
                var outerH = (window.outerHeight / window.devicePixelRatio);
                document.documentElement.style.height = outerH + 'px';
                if (!isTimeline()) {
                    $('.initialBackground').height((outerH * 0.48));
                }
            }
            window.scrollTo(0, 1);
        }, 1000);
    } else if (iOS) {
        //Check iPhone OS version.
        //iPhone userAgent has "iPhone OS 7" strings
        if (getIOSversion() < 7){
            if (!window.location.hash) {
                if (document.height <= window.outerHeight + 10) {
                    document.body.style.height = (window.outerHeight + 60) + 'px';
                    setTimeout(function() {
                        window.scrollTo(0, 1);
                    }, 50);
                } else {
                    setTimeout(function() {
                        window.scrollTo(0, 1);
                    }, 0);
                }
            }
        }
    }
}

window.addEventListener("load", function() {
    hideAddressBar();
});

/* Function to avoid return to previous page */
function avoidReturnPrePage() {
    setTimeout(function() {
        var currentPage = "#1";
        window.location.href = currentPage;
    }, 1000);
}

var storedHash = window.location.hash;

if ("onhashchange" in window) {
    // if browser supports onhashchange event, use it to handle back key
    window.addEventListener("hashchange", function() {
        handleBackEvent();
    });
} else {
    // if browser does not support, use setInterval()
    window.setInterval(function() {
        if (window.location.hash != storedHash) {
            handleBackEvent();
        }
    }, 50);
}
/* Function to handle back key event */
var countHashChangeTime = 0;
function handleBackEvent() {
    window.location.hash = storedHash;
    if (isTimeline()) {
        if (android) {
            hideAddressBar();
        }
        if (document.getElementById("inviteNewGuest").style.display === "block") {
            document.getElementById("inviteNewGuest").style.display = "none";
            document.getElementById("mainContainer").style.display = "block";
            psMasonry.layout();
        }
        if (document.getElementById("display").style.display === "block" || document.getElementById("display").style.display === "") {
            myScroll.refresh();
            document.getElementById("display").style.display = "none";
            ChangeDiv('throwiconblnk', 'throwiconanim');
            document.getElementById("mainContainer").style.display = "block";
        }
        if (document.getElementById("historyId").style.display === "block") {
            myScroll.refresh();
            document.getElementById("historyId").style.display = "none";
            document.getElementById("mainContainer").style.display = "block";
        }
        if (hideDialogId != "" && hideDialogId != ".landscapePopup") {
            hidePopup(hideDialogId);
            hideDialogId = "";
        }
        hideMusicListPopup();
        if (document.getElementById("popupOptionMenu").style.display === "block") {
            document.getElementById("popupOptionMenu").style.display = "none";
            $('.optionMenuGreyLayer').remove();
        }
        if (document.getElementById("saveContentDialog").style.display === "block") {
            document.getElementById("saveContentDialog").style.display = "none";
            $('.saveContentGreyLayer').remove();
        }
        if (document.getElementById("exitPartyShareDialog").style.display === "block") {
            document.getElementById("exitPartyShareDialog").style.display = "none";
            $('.exitPartyShareGreyLayer').remove();
        }
        if (document.getElementById("editNickName").style.display === "block") {
            document.getElementById("editNickName").style.display = "none";
            $('.editNickNameGreyLayer').remove();
        }
        /* 1 is Magic Number because when loading Webapp handleBackEvent fuction called 2 time*/
        if (document.getElementById("tutorialPopup").style.display === "block" && countHashChangeTime > 1) {
            showHideTutorial();
        }
        countHashChangeTime++;
    }
}

//code to correct invite new member layout after orientation changed for android devices
//window.onresize = function() {
//};

/* code to check orientation and show error message */
var supportsOrientationChange = "onorientationchange" in window,
        orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
window.addEventListener(orientationEvent, function() {
    hideAddressBar();
    checkOrientation(true);

    // Reload the page if this is the first rotation event after page reload on Landscape mode.
    // Without this step, the layout is calculated with wrong width/height in Galaxy S2/S3.
    if (!g_isLoadDoneOnPortrait) {
        window.location.reload();
    }
});

/* Function to check Device UI orientation and display alert dialog if Portrai mode
 This function is called when load and orientation change event happen.
 "isOrientationEventHappen" is true when orientation event happen. */
function checkOrientation(isOrientationEventHappen) {
    hidePopup('.landscapePopup');
    if (isPortraitMode(isOrientationEventHappen)) {
        // For Portrait mode
        document.getElementById('mainDivId').style.display = '';
        if (isTimeline()) {
            setTimeout(function() {
                psMasonry.layout();
            }, 500);
        }

        // Change the flag state if page loading is called on Portrait mode.
        if (!isOrientationEventHappen) {
            g_isLoadDoneOnPortrait = true;
        }
    } else {
        // For Landscape mode
        document.getElementById('mainDivId').style.display = 'none';
        if (iOS)
            document.body.style.height = "100%";
        UILandscapPopUp(translationlist['64424']);
    }
}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
/* Function to judge the current device orientation is portrait or not */
function isPortraitMode(isOrientationEventHappen) {

    // allow to use PartyShare the devices which cannot
    // detect orientation such as PC.
    if (typeof window.orientation === "undefined") {
        // typeof window.orientation not working in firefox mobile vesion.
        //  check orientation by screenW and screenH
        if (is_firefox) {
            g_isPortraitMode = (screen.width < screen.height) ? true : false;
            return g_isPortraitMode;
        }
        g_isPortraitMode = true;
        return true;
    }
    if (!isOrientationEventHappen) {
        // when page load event happen, the flags are initialized.
        // isPortraitMode is judged with window.outerWidth and window.outerHeight
        g_isRotated = (Math.abs(window.orientation) == 90) ? true : false;
        g_isPortraitMode = (screen.width < screen.height) ? true : false;
    } else {
        g_isLoadPageFirstTime = true;
        // when orientation change event happen,
        // judge isPortraitMode by comparing with previous state
        var previousRotatedState = g_isRotated;
        g_isRotated = (Math.abs(window.orientation) == 90) ? true : false;

        if (previousRotatedState != g_isRotated) {
            // if rotate state is changed, portrait status should be updated.
            g_isPortraitMode = !g_isPortraitMode;
        } else {
            // if rotaet state is not chenged even when orientation change event happen,
            // reset the portrait mode with outerWidth/outerHeight information.
            g_isPortraitMode = (screen.width < screen.height) ? true : false;
        }
    }
    if (iOS) {
        g_isPortraitMode = (Math.abs(window.orientation) == 90) ? false : true;
    }
    return g_isPortraitMode;
}
//Get current IOS version
function getIOSversion() {
  //navigator.appVersion-iphone: 5.0 (iPhone; CPU iPhone OS 10_0_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) Version/10.0 Mobile/14A403 Safari/601.1
  //navigator.appVersion-ipad: 5.0 (Ipad; CPU OS 9_2_1 like Mac OS X) AppleWebKit/601.1 (KHTML, like Gecko) Version/9.0 Mobile/13D15 Safari/601.1
    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
    return parseInt(v[1],10); 
}
/* Function to check whether the device supports <input type="file"> or not.
 This is same as whether the device is iOS 5- or not.
 iOS 5 or under does not support <input type="file"> */
function isFileSelectionSupported() {

    if (iOS) {
        //Check IOS version.
        return getIOSversion() >= 6;

   
    } else {
        //Not iOS
        return true;
    }
}

function getAvartarByUUID(uuid) {
    if (g_userList)
    {
        if (g_userList.length > 0) {
            var size = g_userList.length;
            for (var i = 0; i < size; i++) {
                var userListItem = g_userList[i];
                if (userListItem)
                {
                    if (userListItem.uuid == uuid) {
                        return userListItem.avatarUrl;
                    }
                }
            }
        }
    }
    return "";
}
