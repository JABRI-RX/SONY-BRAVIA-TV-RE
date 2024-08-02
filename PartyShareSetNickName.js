/*
 * Copyright 2014 Sony Corporation
 */
/* Resource initialization */
var g_nameFlag = true;

/*check user for input  nickname if its blank then get default user name */
function validateUserNickName(nameObject) {
    if (!validateNickNameBlank(nameObject)) {
        nameObject.value = translationlist['64342'];
        nameObject.setAttribute('class', 'logintextBox');
    } else {
        nameObject.setAttribute('class', 'logintextBox inputTextBlack');
    }
}

/* Change Nickname Validation */
function validateChangeUserNickName(nameObject) {
    // On blur event
    if (!validateNickNameBlank(nameObject)) {
        g_nameFlag = false;
        nameObject.setAttribute('class', 'inputTextGrey');
        // if input text is blank and nickname is edited before then display nickname with black color.
        if (isNickNameEdited() == 'true') {
            nameObject.setAttribute('class', 'inputTextBlack');
            nameObject.value = getNickName();
        } else {
            // if input text is blank and nickname is not edited before then display 'Input your nickname' hint text.
            nameObject.value = translationlist['64342'];
        }
    } else {
        // if input text is not blank then display it with black color.
        g_nameFlag = true;
        nameObject.setAttribute('class', 'inputTextBlack');
//        setNickName(nameObject.value); // when editing nick name, does not update immediately.
    }
    /* fire 'orientation change' event to re-struct page -> page can display on full screen */
    $(window).orientationchange();
}

/* validation for nickname blank */
function validateNickNameBlank(nameObject) {
    var regExpression = /^[ ]+$/;
    return (nameObject.value.length != 0 && !nameObject.value.match(regExpression) && nameObject.value != translationlist['64342']);
}

/* Changing the user name */
var currentNickname;
function changeUserNickName() {
    var inputTextObj = document.getElementById("editNickNameId");
    g_nameFlag = false;
    inputTextObj.setAttribute('class', 'inputTextGrey');
    nickNameStorageCheck();
    inputTextObj.value = getNickName();
    // If user already input nick name then display it with black color
    // otherwise display 'Input your nickname' with grey color.
    if (isNickNameEdited() == 'true') {
        inputTextObj.setAttribute('class', 'inputTextBlack');
    } else {
        inputTextObj.value = translationlist['64342'];
    }
    hidePopup(".popup");
    //validate to disable ok button
    currentNickname = $("#editNickNameId").val();
    disableOk();
    handleEditNickNameOpenClose();
}
/* Function handle disable ok button on edit nick name */
$(document).ready(function() {
    $('#editNickNameId').bind('input keyup', function(e) {
        var inputName = $("#editNickNameId").val();
        if (inputName.length == 0 || inputName == currentNickname) {
            disableOk();
        } else {
            enableOk();
        }
    });
    $('#editNickNameId').on("focus", function(e) {
        var inputName = $("#editNickNameId").val();
        if (currentNickname == inputName) {
            $("#editNickNameId").val("");
        }
    });
});
function disableOk() {
    $("#dialogOk").css("background-color", "#b9b9b9");
    $("#dialogOk").css("color", "#fff");
    $("#dialogOk").css("pointer-events", "none");
    $("#dialogOk").css("border", "2px solid #b9b9b9");
}
function enableOk() {
    $("#dialogOk").css("background-color", "#fff ");
    $("#dialogOk").css("color", "#6093be");
    $("#dialogOk").css("border", "2px solid #6093be");
    $("#dialogOk").css("pointer-events", "auto");
}
/* check user name and uuid stored in local storage  */
function nickNameStorageCheck(userName) {
    getUUID();
    getNickName();
}

/* function to fatching default device name functionality useing browserUserAgent */
function getDefaultUserNickName() {
    var deviceName = "";
    var iPadAgent = navigator.userAgent.match(/iPad/i) != null;
    var iPodAgent = navigator.userAgent.match(/iPod/i) != null;
    var iPhoneAgent = navigator.userAgent.match(/iPhone/i) != null;
    var AndroidAgent = navigator.userAgent.match(/Android/i) != null;
    var webOSAgent = navigator.userAgent.match(/webOS/i) != null;
    var windows = navigator.userAgent.match(/Windows/i) != null;
    if (iPadAgent) {
        deviceName = "iPad";
    } else if (iPodAgent) {
        deviceName = "iPod";
    } else if (iPhoneAgent) {
        deviceName = "iPhone";
    } else if (AndroidAgent) {
        var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox');
        if (is_firefox > -1) {
            deviceName = "Mozilla";
        } else {
            var userAgent = navigator.userAgent.match(/; Android (\d.\d.\d)/);
            var regExp = /(.*Android\s+)(.*)(\s+Build.*)/;
            var usrAgentName = navigator.userAgent.replace(regExp, "$2");
            if (usrAgentName.split(';')[2]) {
                deviceName = usrAgentName.split(';')[2];
            } else {
                deviceName = usrAgentName.split(';')[1];
            }
        }
    } else if (windows) {
        deviceName = "windows";
    } else if (webOSAgent) {
        deviceName = "webOS";
    } else {
        deviceName = "default";
    }

    if (!deviceName || deviceName == "") {
        deviceName = "default";
    }

    return deviceName;
}

/* function to send the username and uuid to Ajax function and handling response from Ajax call*/
function setUserNickName(currOperation) {
    if (g_nameFlag) {
        if (currOperation == "EDITNICKNAME") {
            var nameObject = document.getElementById('editNickNameId');
            // Set flag to identify that nickname is edited.
            setNickNameEdited('true');
            setNickName(nameObject.value);
        }
        nickNameStorageCheck();
        var objName = new setUserNickNameClass();
        objName.nickname = getNickName();
        objName.uuid = getUUID();
        objName.setNickNameObject(setNickNameUICallback, "");
    }

    // callback from XHR.
    function setNickNameUICallback(responsObj, reqHeader) {
        if (responsObj instanceof ObjError) {
            if (responsObj.code == UUID_ERROR) {
                forceUpdateUUID(); // new proposal of UUID.
                setUserNickName(); // try again.
            } else if (responsObj.code == CANNOT_OPERATE || responsObj.code == NICKE_NAME_ERROR) {
                UIerrorpopUp(translationlist['64364']);
            } else if (responsObj.code == SUCCESS) {
                //update user nick name
                getContentList();
            } else {
                UIerrorpopUp(translationlist['64364']);
            }
        }
    }
}
/*function handle close/play EditNickname Popup*/
function handleEditNickNameOpenClose() {
    if (document.getElementById("editNickName").style.display === "none") {
        document.getElementById("editNickName").style.display = "block";
        $('#mainDivId').append('<div class="editNickNameGreyLayer" onclick = "handleEditNickNameOpenClose();"></div>');
    } else {
        document.getElementById("editNickName").style.display = "none";
        $('.editNickNameGreyLayer').remove();
    }
}
/* for private mode */
var g_uuid_value = "";
var g_nickname_value = "";
var g_nickNameEdited = 'false';

/* function to get UUID */
function getUUID() {
    try {
        // can use localStorage
        var data = JSON.stringify(Math.uuid());
        if (!localStorage.getItem('uuidValue')) {
            localStorage.setItem('uuidValue', data);
        }
        return JSON.parse(localStorage.getItem('uuidValue'));
    } catch (e) {
        // cannot use localStorage
        if (g_uuid_value == "") {
            if (null != self.location.toString().match(/uuid=([\w\-]+)/)) {
                g_uuid_value = RegExp.$1;
            } else {
                g_uuid_value = Math.uuid();
            }
        }
        return g_uuid_value;
    }
}

/* function to force update UUID */
function forceUpdateUUID() {
    try {
        // can use localStorage
        localStorage.removeItem('uuidValue');
        localStorage.setItem('uuidValue', Math.uuid());
    } catch (e) {
        // cannot use localStorage
        g_uuid_value = "";
        g_uuid_value = Math.uuid();
    }
}
function isHasLocalStorage() {
    try {
        localStorage.setItem("name", "name.value");
        localStorage.setItem("post", "post.value");
        return true;
    }
    catch (e) {
        return false;
    }
}
/* function to get Nickname */
function getNickName() {
    try {
        // can use localStorage
        if (!isHasLocalStorage()) {
            if (g_nickname_value == "") {
                if (null != self.location.toString().match(/nick=([^&]+)/)) {
                    g_nickname_value = decodeURI(RegExp.$1);
                } else {
                    g_nickname_value = getDefaultUserNickName();
                }
            }
            if (!g_nickname_value || g_nickname_value == "") {
                g_nickname_value = "default";
            }
        } else {
            g_nickname_value = localStorage.getItem('userNickName');
            if (!g_nickname_value || g_nickname_value == "") {
                g_nickname_value = getDefaultUserNickName();
                localStorage.setItem('userNickName', g_nickname_value);
            }
        }
    } catch (e) {
        // cannot use localStorage
        if (g_nickname_value == "") {
            if (null != self.location.toString().match(/nick=([^&]+)/)) {
                g_nickname_value = decodeURI(RegExp.$1);
            } else {
                g_nickname_value = getDefaultUserNickName();
            }
        }
        if (!g_nickname_value || g_nickname_value == "") {
            g_nickname_value = "default";
        }
    }
    return g_nickname_value;
}

/* function to set Nickname */
function setNickName(nickname) {
    try {
        // can use localStorage
        localStorage.setItem('userNickName', nickname);
        localStorage.setItem("test", "test"); // dummy
    } catch (e) {
        // cannot use localStorage
        g_nickname_value = nickname;
    }
}

/* function to force reset Nickname */
function forceResetNickName() {
    try {
        // can use localStorage
        localStorage.removeItem('userNickName');
        localStorage.setItem("test", "test"); // dummy
    } catch (e) {
        // cannot use localStorage
        g_nickname_value = "";
    }
}
/* function to set nickname is edited flag */
function setNickNameEdited(value) {
    try {
        // can use localStorage
        localStorage.setItem('nickNameEdited', value);
    } catch (e) {
        // cannot use localStorage
        g_nickNameEdited = value;
    }
}
/* function to check nickname is edited */
function isNickNameEdited() {
    try {
        // can use localStorage
        if (localStorage.getItem('nickNameEdited') == null) { // first time
            localStorage.setItem('nickNameEdited', 'false');
        }
        g_nickNameEdited = localStorage.getItem('nickNameEdited');
    } catch (e) {
        // cannot use localStorage
    }
    return g_nickNameEdited;
}
