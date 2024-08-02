/*
 * Copyright 2014 Sony Corporation
 */
/* Resource initialization */
var g_noThumbItemList = new Array(); // store items which have no thumbnail to generate thumbnail later.
var g_currOrNewFileName = "";
var g_oldTimeLineObject = "";
var myScroll = null;
var pullDownEl = null;
var pullDownOffset = 0;
var g_delItemList = new Array();
var newItemList = new Array();
var MUSIC_TYPE = ["music"];
var PHOTO_AND_VIDEO_TYPE = ["photo", "video"];
/* function to handle release to refresh functionality */
function loaded() {
    if (document.URL.match(/tl.html/i) == "tl.html") {
        pullDownEl = document.getElementById('pullDown');
        pullDownOffset = pullDownEl.offsetHeight;
        setTimeout(createScroll, 200);
    }
}

/* function to create iScroll object */
function createScroll() {
    // just in case delete the instance if it exists.
    if (null != myScroll) {
        myScroll.destroy();
        myScroll = null;
    }
    // creation of iScroll object.
    myScroll = new iScroll('wrapper', {
        topOffset: pullDownOffset,
        onRefresh: function() {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = translationlist['64545'];
            }
        },
        onScrollMove: function() {
            if (this.y > 3 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = translationlist['64346'];
                this.minScrollY = 0;
            } else if (this.y < 3 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = translationlist['64346'];
                this.minScrollY = -pullDownOffset;
            }
        },
        onScrollEnd: function() {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = translationlist['64546'];
                pullDownAction();
            }
        }
    });
    setTimeout(function() {
        document.getElementById('wrapper').style.left = '0';
    }, 500);
}

// event listener
document.addEventListener('touchmove', function(e) {
    if (-140.0 <= myScroll.y) {
        $("#" + "newPhotoId").hide();
        fadeOutClose();
    }

    if (document.getElementById("InviteNewGuestId").style.display != "block") {
        e.preventDefault();
    }
}, false);

window.addEventListener('load', loaded, false);

/* function to handle release to refresh functionality */
function pullDownAction() {
    try {
        manualGetContentListUpdate();
    } catch (e) {
        setTimeout(function() {
            myScroll.refresh();
        }, 1000);
    }
}

/* function to handle getPhotoList functionality */
function getContentList() {
    var type = PHOTO_AND_VIDEO_TYPE;
    getMediaList(getPhotoListUICallback, type);
}
function getMediaList(callback, type)
{
    if (isAllowGetData === false)
    {
        return;
    }
    var objGetContentListClass = new GetContentListClass();
    objGetContentListClass.type = type;
    objGetContentListClass.getContentList(callback, "");
}


/* handle error object */
function handleError(retObj) {
    if (retObj instanceof ObjError) {
        if (retObj.code == CANNOT_OPERATE) {
            //UIerrorpopUp(retObj.message);
        } else if (retObj.code == COUNT_OUT_OF_RANGE) {
            UIerrorpopUp(retObj.message);
        } else if (retObj.code == INDEX_OUT_OF_RANGE) {
            UIerrorpopUp(retObj.message);
        } else if (retObj.code != SUCCESS) {
            //UIerrorpopUp(retObj.message);
        }
        return true;
    }
    return false;
}

/* update background object */
function updateBackgroundObject(retObj) {
    var len = retObj.photoListArr.length;
    if (len == 0) {
        document.getElementById("getPhotoListAll").style.display = "none";
        document.getElementById("getPhotoListBlank").style.display = "block";
        return false;
    } else {
        document.getElementById("getPhotoListBlank").style.display = "none";
        return true;
    }
}

/* function to handle call back of getPhotoList functionality */
function getPhotoListUICallback(retObj, reqHeader) {

    if (handleError(retObj)) {
        return;
    }

    g_oldTimeLineObject = retObj;

    if (updateBackgroundObject(retObj)) {
        populateGetPhotoListUI2(retObj);
    }
}

function populateGetPhotoListUI2(retObj) {
    /***** filter new items *****/
    if (newItemList.length > 0) {
        // if processing add new items to masonry grid, do nothing.
        return;
    }
    g_noThumbItemList = new Array();
    var isFound = false;
    var itemList = psMasonry.itemList;
    for (var i = 0; i < retObj.photoListArr.length; ++i) {
        var photo = retObj.photoListArr[i];
        isFound = false;
        var item;
        if (itemList.length > 0) {
            for (var j = 0; j < itemList.length; j++) {
                item = itemList[j];
                if (item.id == photo.fileName) {
                    isFound = true;
                    break;
                }
            }
        }
        if (isFound == false) {
            // add to new items list.
            var thumUrl;
            var ava_url;
            var nickNameUser;
            var _isVideo = false;
            if (isPhoto({name: photo.fileName})) {
                if (photo.thumbnailUrl == "") {
                    thumUrl = "images/defaultPhoto.png";
                } else {
                    thumUrl = photo.thumbnailUrl;
                }
            } else if (isVideo({name: photo.fileName})) {
                _isVideo = true;
                if (photo.thumbnailUrl == "") {
                    thumUrl = "images/video_frame.png";
                } else {
                    thumUrl = photo.thumbnailUrl;
                }
            }
            if (photo.userNickname == "")
            {
                nickNameUser = FROM_DLNA_NICK_NAME;
            } else {
                nickNameUser = photo.userNickname;
            }
            if (photo.avatarUrl == "")
            {
                ava_url = "images/default_DLNA_Avatar.png";
            } else {
                ava_url = photo.avatarUrl;
            }
            var newItem = new MasonryItem(ava_url, thumUrl, nickNameUser, photo.fileName, _isVideo);
            newItem.status = photo.status;
            newItem.originalUrl = photo.originalUrl;
            newItem.size = photo.size;
            // if photo have no thumbnail, create thumbnail later.
            if (isPhoto({name: photo.fileName}) && photo.thumbnailUrl == "") {
                g_noThumbItemList.push(newItem);
            }
            newItemList.push(newItem);
        } else {
            /* update status and nickname of old items */
            item.updateStatusUI(photo.status);
            if (photo.userNickname == "")
            {
                photo.userNickname = FROM_DLNA_NICK_NAME;
                item.updateAvatar("images/default_DLNA_Avatar.png");
            } else {
                item.updateAvatar(getAvartarByUUID(photo.uuid));
            }
            item.updateNickName(photo.userNickname);
        }
    }
    // delete items which does not exist on server.
    deleteOlderItemInMasonryList(retObj);
    // start add new items to masonry grid.
    startLoadNewItems();
}
function deleteOlderItemInMasonryList(retObj)
{
    // data
    var dataOnMasonry = psMasonry.itemList;
    var dataFromServer = retObj.photoListArr;
    // size of data
    var sizeOnMasonry = dataOnMasonry.length;
    var sizeOnServer = dataFromServer.length;
    g_delItemList = new Array();
    var isMustDeleted = true;
    for (var i = 0; i < sizeOnMasonry; i++)
    {
        isMustDeleted = true;
        var itemOnMasonry = dataOnMasonry[i];
        for (var j = 0; j < sizeOnServer; j++)
        {
            var itemOnServer = dataFromServer[j];
            if (itemOnMasonry.id == itemOnServer.fileName)
            {
                isMustDeleted = false;
                break;
            }
        }
        if (isMustDeleted)
        {
            // add item to list for deleted
            g_delItemList.push(itemOnMasonry);
        }
    }
    psMasonry.batchRemove(g_delItemList);
    myScroll.refresh();
}
function startLoadNewItems() {
    if (newItemList != null && newItemList.length > 0) {
        // get and remove last item from 'newItemList' array.
        var item = newItemList.pop();
        // add item to masonry grid.
        psMasonry.addItem(item, function() {
            // add next item to masonry grid after previous item is completed.
            startLoadNewItems();
        });
    } else {
        // after finishing load new items to masonry grid,
        // start generating thumbnails for images which has no thumbnail.
        startLoadingNoThumbnailItems();
    }
}

/* function to update nickname functionality */
function updateNickNameUUID() {
    getMusicList();
    var type = PHOTO_AND_VIDEO_TYPE;
    getMediaList(updateNickNameUUIDUICallback, type);
}


/* function to handle call back of update nickname functionality */
function updateNickNameUUIDUICallback(retObj, reqHeader) {
    if (handleError(retObj)) {
        return;
    }

    g_oldTimeLineObject = retObj;

    var contentHashtable = retObj.fullURLList;
    var itemList = psMasonry.itemList;
    // retreive all grid items to update nickName
    for (var i = 0; i < itemList.length; i++) {
        var item = itemList[i];
        var nickName = contentHashtable.get(item.id).userNickname;
        if (nickName == "")
        {
            nickName = FROM_DLNA_NICK_NAME;
        }
        item.updateNickName(nickName);
    }
    psMasonry.layout();
}

/* funtion to handle the New Photo Arrival Message */
function hideNewPhotoDiv() {
    $("#newPhotoId").hide();
    myScroll.scrollTo(0, 0);
}

/* function to handle release to refresh functionality */
function manualGetContentListUpdate() {
    if (typeof (g_oldTimeLineObject.photoListArr) != undefined && g_oldTimeLineObject.photoListArr != null) {
        var type = PHOTO_AND_VIDEO_TYPE;
        getMediaList(updatePhotoListUICallback, type);
    } else {
        getContentList();
    }
}


/* function to handle call back of release to refresh functionality */
function updatePhotoListUICallback(retObj, reqHeader) {

    if (handleError(retObj)) {
        return;
    }

    updateBackgroundObject(retObj);

    populateGetPhotoListUI2(retObj);

    g_oldTimeLineObject = retObj;
}

/* update  updateGetPhotoList function for current and newphoto event*/
function updateGetPhotoList(eventName, fileName) {
    g_currOrNewFileName = fileName;
    if (typeof (g_oldTimeLineObject.photoListArr) != undefined && g_oldTimeLineObject.photoListArr != null) {
        if (eventName == "newContent" || eventName == "current") {
            var type = PHOTO_AND_VIDEO_TYPE;
            getMediaList(updateNewPhotoUICallback, type);
        }
    } else {
        getContentList();
    }
}


/* function to handle callback method of newPhoto event*/
function updateNewPhotoUICallback(retObj, reqHeader) {

    if (handleError(retObj)) {
        return;
    }

    if (updateBackgroundObject(retObj)) {
        populateGetPhotoListUI2(retObj);
    }
}

/* function to redirect from history UI to timeline UI */
function backToTimeline() {
    document.getElementById("historyImg").src = "";
    setTimeout(function() {
        myScroll.refresh();
    }, 0);
    document.getElementById("historyId").style.display = "none";
    document.getElementById("mainContainer").style.display = "block";
}

var togglePlayType;
/* function to handle history PartyShare functionality */
function togglePlayStatusMethod(id) {
    "use strict;"

    var photo = getContent(id);
    var objTogglePlayStatusClass = new GetContentListClass();
    objTogglePlayStatusClass.fileName = photo.fileName;
    togglePlayType = photo.type;
    objTogglePlayStatusClass.togglePlayStatus(togglePlayStatusMethodUICallback, "");
}

function getContent(fileName) {
    for (var i = 0; i < g_oldTimeLineObject.photoListArr.length; ++i) {
        var content = g_oldTimeLineObject.photoListArr[i];
        if (content.fileName == fileName) {
            return content;
        }
    }
    return null;
}

function togglePlayStatusMethodUICallback(retObj) {
    "use strict;"

    setTimeout(function() {
        playingItemFlag = false;
        // after finish play content, enable click event on masonry gird and close current preview.
        if (retObj instanceof ObjError) {
            if (retObj.code != SUCCESS) {
                if (togglePlayType == "video") {
                    UIerrorpopUp(translationlist['80395']);
                } else if (togglePlayType == "photo") {
                    UIerrorpopUp(translationlist['64370']);
                } else {
                    UIerrorpopUp(translationlist['80396']);
                }
            }
        }
    }, 1000); //milisecond
}

function switchToTimeLineUI() {
    ChangeDiv('throwIconBlank', 'throwIconBlink');
    setTimeout(function() {
        myScroll.refresh();
    }, 100);
    $("#" + "mainContainer").show();
    $("#" + "historyId").hide();
}

function getMusicList()
{
    var type = MUSIC_TYPE;
    getMediaList(getMusicUICallback, type);
}
// adding a new Item to music list
function addingToList(itemMusic) {
    $('#list').append(itemMusic);
    setMaxHeightMusicList();
}

/* function to handle call back of getPhotoList functionality */

function updateStatus(photoListArr) {
    var arrMusicItem = photoListArr;
    var countListLocal = $("#list").children().size();
    if (countListLocal === 0)
    {
        return;
    }
    for (var i = 0; i < countListLocal; i++) {
        var musicItem = arrMusicItem[countListLocal - i - 1];
        //
        var fileNameInList = $("#list").children().eq(i).attr("name");
        var fileNameInRequest = musicItem.fileName;
        if (fileNameInRequest == fileNameInList) {
            var statusInRequest = musicItem.status;
            // update usernickname
            var nickNameInList = $("#list").children().eq(i).find("#nickName").text();
            var nickNameServer = musicItem.userNickname;
            if (!nickNameServer) {
                nickNameServer = FROM_DLNA_NICK_NAME;
            }
            if (nickNameInList !== nickNameServer) {
                $("#list").children().eq(i).find("#nickName").text(nickNameServer);
            }
            updateStatusItemMusic($("#list").children().eq(i), statusInRequest);
        } else {
            var item = createItem(musicItem);
            $("#list").children().eq(i).after(item);
            $("#list").children().eq(i).remove();
            var statusInRequest = musicItem.status;
            updateStatusItemMusic($("#list").children().eq(i), statusInRequest);
        }
    }
}
function updateStatusItemMusic(itemInList, statusInRequest)
{
    var status = itemInList.find("#status");
    var musicName = itemInList.find("#musicName");
    if (statusInRequest === MEDIA_PLAYING) {
        musicName.css("color", "#6093be");
        if (!is_firefox) {
            status.css("content", "url('images/play.png')");
        } else {
            //on firefox css(content,url) is not running
            status.attr("src", "images/play.png");
        }
        //status.attr("src", "images/play.png");
        status.css("visibility", "visible");
    } else if (statusInRequest === MEDIA_PAUSED) {
        
        if (!is_firefox) {
            status.css("content", "url('images/pause.png')");
        } else {
            //on firefox css(content,url) is not running
            status.attr("src", "images/pause.png");
        }
        
        //status.attr("src", "images/pause.png");
        status.css("visibility", "visible");
    } else {
        musicName.css("color", "#828282");
        status.css("visibility", "hidden");
    }
}
function synchronizeList(photoListArr) {
    var countListSever = photoListArr.length;
    var countListLocal = $("#list").children().size();
    if (countListSever < countListLocal)
    {
        // remove all item - re-add
        $("#list").empty();
        for (var j = 0; j < countListSever; j++)
        {
            var musicItem = photoListArr[j];
            var item = createItem(musicItem);
            addingToList(item);
        }
    }
    else
    {
        // add new item receiver from server
        for (var j = countListLocal; j < countListSever; j++)
        {
            var musicItem = photoListArr[j];
            var item = createItem(musicItem);
            addingToList(item);
        }
    }
}
function getMusicUICallback(retObj, reqHeader) {
    if (handleError(retObj)) {
        return;
    }
    synchronizeList(retObj.photoListArr);
    updateStatus(retObj.photoListArr);
    setMaxHeightMusicList();
}
// reusable resources for rendering thumbnail.
var canvas0 = document.createElement('canvas');
var context = canvas0.getContext("2d");
var is_supported = true;

/* loading image and creating thumbnail */
function startLoadingNoThumbnailItems() {
    "use strict";
    if (g_noThumbItemList == null || g_noThumbItemList.length <= 0) {
        myScroll.refresh();
    }
    if (is_supported == false) {
        return;
    }
    var item = g_noThumbItemList.shift()
    var img = document.createElement("img");
    img.onload = function () {
        // calculate thumbnail size.
        var w = screen.width/2;
        var h = screen.width/2 * this.height / this.width;

        // render thumbnail.
        canvas0.width = w;
        canvas0.height = h;

        // for iOS6 rendering problem.
        if (isSafari(g_userAgent)) {
            if (false /* detectSubsampling(this) */ ) {
                var r = detectVerticalSquash(this);
                var ow = this.naturalWidth / 2;
                var oh = this.naturalHeight * r;
                var div_w = Math.ceil(ow / 1024);
                var div_h = Math.ceil(oh / 1024);
                var sw = ow / div_w;
                var sh = oh / div_h;
                var tw = w / div_w;
                var th = h / div_h;
                for (var y = 0; y < div_h; ++y) {
                    for (var x = 0; x < div_w; ++x) {
                        context.drawImage(this, sw * x, sh * y, sw, sh, tw * x, th * y, tw, th);
                    }
                }
            } else {
                var r = detectVerticalSquash(this);
                context.drawImage(img, 0, 0, this.width, this.height * r, 0, 0, w, h);
            }
        } else {
            context.drawImage(this, 0, 0, w, h);
        }

        var url = canvas0.toDataURL("image/jpeg");
        if (0 == url.indexOf("data:image", 0)) {
            item.updateUrl(url, function() {
                // create thumbnail for next image after previous item is completed.
                startLoadingNoThumbnailItems();
            });
        } else {
            is_supported = false;
        }

        //delete this.onload;
        this.src = '';
        this.remove();
    };
    img.src = item.originalUrl;
}
/* Function to detect vertical squash
 *
 * original code :
 * https://github.com/stomita/ios-imagefile-megapixel/blob/master/src/megapix-image.js
 * Copyright (c) 2012 Shinichi Tomita <shinichi.tomita@gmail.com>
 * Released under the MIT license
 */
function detectVerticalSquash(img) {
    "use strict";

    var h = img.naturalHeight;
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, h).data;
    var sy = 0;
    var ey = h;
    var py = h;
    while (sy < py) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    canvas = null;
    ctx = null;
    var ratio = (py / h);
    return (ratio === 0) ? 1 : ratio;
}