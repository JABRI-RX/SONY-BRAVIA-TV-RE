/*
 * Copyright 2014 Sony Corporation
 */
/*function handle showMusicListPopup Popup*/
function showMusicListPopup() {
    if (document.getElementById("popupMusicList").style.display === "none") {
        document.getElementById("popupMusicList").style.display = "block";
        $('#mainDivId').append('<div class="musicListGreyLayer" onclick = "hideMusicListPopup();"></div>');
    }
}
function hideMusicListPopup() {
    if (document.getElementById("popupMusicList").style.display === "block") {
        document.getElementById("popupMusicList").style.display = "none";
        $('.musicListGreyLayer').remove();
        clearTimeout(timmer);
    }
}
var timmer;
var musicListClosetimmer = 10000;
function closeMusicListByTimmer() {
    timmer = setTimeout(function() {
        hideMusicListPopup();
    }, musicListClosetimmer);

}

$(document).ready(function() {
    $('#popupMusicList').on("click", function(e) {
        clearTimeout(timmer);
        closeMusicListByTimmer();
    });
    $('#popupMusicList').on("touchend", function(e) {
        clearTimeout(timmer);
        closeMusicListByTimmer();
    });
    $('#popupMusicList').on("touchstart", function(e) {
        clearTimeout(timmer);
    });
});
/*function handle showHideOptionMenuPopup Popup*/
function showHideOptionMenuPopup() {
    if (document.getElementById("popupOptionMenu").style.display === "none") {
        document.getElementById("popupOptionMenu").style.display = "block";
        $('#mainDivId').append('<div class="optionMenuGreyLayer" onclick = "showHideOptionMenuPopup();"></div>');
    } else {
        document.getElementById("popupOptionMenu").style.display = "none";
        $('.optionMenuGreyLayer').remove();
    }
}
/*function handle close/play SaveContent Popup*/
function showHideSaveContentPopup() {
    if (document.getElementById("saveContentDialog").style.display === "none") {
        document.getElementById("saveContentDialog").style.display = "block";
        $('#mainDivId').append('<div class="saveContentGreyLayer" onclick = "showHideSaveContentPopup();"></div>');
    } else {
        document.getElementById("saveContentDialog").style.display = "none";
        $('.saveContentGreyLayer').remove();
    }
}
/*function handle close/play exitPartyShareDialog Popup*/
function showHideExitPartySharePopup() {
    if (document.getElementById("exitPartyShareDialog").style.display === "none") {
        document.getElementById("exitPartyShareDialog").style.display = "block";
        $('#mainDivId').append('<div class="exitPartyShareGreyLayer" onclick = "showHideExitPartySharePopup();"></div>');
    } else {
        document.getElementById("exitPartyShareDialog").style.display = "none";
        $('.exitPartyShareGreyLayer').remove();
    }
}
/* function to show tutorial functionality */
function showHideTutorial() {
    if (document.getElementById("tutorialPopup").style.display === "none") {
        isAllowGetData = false;
        document.getElementById("tutorialPopup").style.display = "block";
        $('#mainDivId').append('<div class="tutorialGreyLayer" onclick = "showHideTutorial();"></div>');
    } else {
        document.getElementById("tutorialPopup").style.display = "none";
        $('.tutorialGreyLayer').remove();
        isAllowGetData = true;
        getContentList();
        //get music list after closing Tutorial
        getMusicList();
    }
}
/*function handle show Toast Message and close after 3s Popup*/
function showToastMessage() {
    document.getElementById("toastMessage").style.display = "block";
    setTimeout(function() {
        if (document.getElementById("toastMessage").style.display === "block") {
            document.getElementById("toastMessage").style.display = "none";
        }
    }, 3000);

}
/* function to handle inviteNewMember UI functionality */
function showInviteNewGuest() {
    if (isLinux) {
        document.getElementById("textId21").style.display = "none";
        document.getElementById("touchImageId").style.display = "none";
    }
    GetPartyShareServerInfoUI();
}
var inviteScroll = null;
function createInviteScroll() {
    inviteScroll = new iScroll('nfcScroll');
}
/* function to open inviteNewMember UI functionality */
function openInviteNewGuest() {
    GetPartyShareServerInfoUI();
}

/* function to handle inviteNewMember slide load functionality */
function sliderLoaded(args) {
    $(args.sliderObject).find('.text1, .text2').attr('style', '');
    $(args.currentSlideObject).find('.text1').animate({
        right: '100px',
        opacity: '0.8'
    }, 400, 'easeOutQuint');
    $(args.currentSlideObject).find('.text2').delay(200).animate({
        right: '70px',
        opacity: '0.8'
    }, 400, 'easeOutQuint');
    slideChange(args);
}

/* function to handle close inviteNewMember functionality */
function CloseInviteNewGuest() {
    if (android) {
        hideAddressBar();
    }
    setTimeout(function() {
        myScroll.refresh();
    }, 0);
    document.getElementById("inviteNewGuest").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
    psMasonry.layout();
}
/* function to handle get user list */
function getUserListCall()
{
    var objGetUserListClass = new getUserListClass();
    objGetUserListClass.getUserList(getUserListUICallback, "");
}

/* function to handle callback of method getUserList */
function getUserListUICallback(retObj, reqHeader)
{
    if (retObj instanceof ObjError) {
        return;
    }
    getContentList();
}
/* function to handle get inviteNewMember deatils functionality */
function GetPartyShareServerInfoUI() {
    isProcessing = true;
    var objGetPartyShareServerInfo = new PartyShareControlClass();
    objGetPartyShareServerInfo.GetPartyShareServerInfo(GetPartyShareServerInfoUICallback, "");
}

/* function to handle callback method of GetPartyShareServerInfoUI*/
function GetPartyShareServerInfoUICallback(retObj, reqHeader) {
    var screenH = $(window).height();
    var qrcodeHeight = 50;
    qrcodeHeight = screenH / 8;
    if (retObj instanceof ObjError) {
        if (retObj.code != SUCCESS) {
            UIerrorpopUp(translationlist['64364']);
            return;
        }
    }
    networkName = retObj.ssid;
    document.getElementById("networkName").innerHTML = translationlist['64302'] + translationlist['37935'] + " " + networkName + "<br>" + translationlist['51519'] + translationlist['37935'] + " " + retObj.Key;
    document.getElementById("urlAddress").innerHTML = retObj.URL;
    document.getElementById("qrcodeImg").innerHTML = "";
    jQuery('#qrcodeImg').qrcode({
        render: "canvas",
        text: retObj.URL,
        "width": qrcodeHeight,
        "height": qrcodeHeight,
    });
    document.getElementById("inviteNewGuest").style.display = "block";
    document.getElementById("mainContainer").style.display = "none";
}

/* function to show Control BGM popup */
function controlBGM() {
    hidePopup(".popup");
    showPopup(".controlbgmPopup");
}

/* function to handle setBgmControlMode functionality from mobile to TV  */
function setBgmControlMode(value) {
    var boolValue = (value === "true");
    var objBgm = new PartyShareControlClass();
    objBgm.playback = boolValue;
    objBgm.controlBgm(setBgmControlModeCallback, "undefined");

    function setBgmControlModeCallback(responsObj, reqHeader) {
        if (responsObj instanceof ObjError) {
            if (responsObj.code == SUCCESS) {
                return;
            }
        }
    }
}

/* function to handle setRotationDegree functionality from mobile to TV */
var acceptRotate = false;
function setRotationDegree(id, value) {
    var photo = getContent(id);
    var objRotDeg = new PartyShareControlClass();
    objRotDeg.degree = value;
    objRotDeg.filename = photo.fileName;
    if (!acceptRotate)
    {
        acceptRotate = true;
        objRotDeg.setRotationDegree(setRotationDegreeCallback, "undefined");
        setTimeout(function() {
            acceptRotate = false;
        }, 500);
    }

    function setRotationDegreeCallback(responsObj, reqHeader) {
        setTimeout(function() {
            if (responsObj instanceof ObjError) {
                if (responsObj.code == SUCCESS) {
                    return;
                } else if (responsObj.code == NOT_FOUND) {
                    UIerrorpopUp(responsObj.message);
                } else if (responsObj.code != SUCCESS) {
                    UIerrorpopUp(translationlist['64364']);
                }
            }
        }, 1000);
    }
}

/* function to handle setQuickInvitationMode functionality from mobile to TV  */
function setQuickInvitationMode(value) {
    var objQuicInv = new PartyShareControlClass();
    objQuicInv.mode = value;
    objQuicInv.setQuickInvitationMode(setQuickInvitationModeCallback, "");

    function setQuickInvitationModeCallback(responsObj, reqHeader) {
        if (responsObj instanceof ObjError) {
            if (responsObj.code == SUCCESS) {
                return;
            } else {
                UIerrorpopUp(translationlist['64364']);
            }
        }
    }
}

/* function to get network name from TV*/
function GetNetworkName() {
    var objGetNetworkName = new PartyShareControlClass();
    objGetNetworkName.GetPartyShareServerInfo(GetNetworkNameUICallback, "");
}

/* function to handle callback method of GetNetworkName */
function GetNetworkNameUICallback(retObj, reqHeader) {
    if (retObj instanceof ObjError) {
        if (retObj.code == CANNOT_OPERATE) {
            //UIerrorpopUp(retObj.message);
        } else if (retObj.code != SUCCESS) {
            //UIerrorpopUp(retObj.message);
        }
        return;
    }
    g_networkName = retObj.ssid;
    loadDataFromLocalStorage(retObj.startTime);
}

/* function to close PartyShare application running on TV */
function closePartyShareApplication() {
    var objClosePartyShareApp = new PartyShareControlClass();
    objClosePartyShareApp.closePartyShareApp(ClosePartyShareAppUICallback, "");
}

/* function to handle callback method of GetNetworkName */
function ClosePartyShareAppUICallback(retObj, reqHeader) {
    if (retObj instanceof ObjError) {
        if (retObj.code == CANNOT_OPERATE) {
            //UIerrorpopUp(retObj.message);
        } else if (retObj.code != SUCCESS) {
            //UIerrorpopUp(retObj.message);
        }
        return;
    }
}
function slideUpClose() {
    $('.notification').slideUp('fast');
}
function fadeOutClose() {
    $('.notification').fadeOut('slow');
}