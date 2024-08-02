/*
 * Copyright 2014 Sony Corporation
 */

var MEDIA_STOPPED = "stopped";
var MEDIA_PLAYING = "playing";
var MEDIA_PAUSED = "paused";

var UNKNOWN_ARTIST = "Unknown Artist"

function createItem(objMusic)
{
    var item;
    if (!objMusic.fileNameAlias)
    {
        objMusic.fileNameAlias = objMusic.fileName;
    }
    if (!objMusic.userNickname)
    {
        objMusic.userNickname = FROM_DLNA_NICK_NAME;
    }
    item = createNewItem(objMusic.fileNameAlias, objMusic.artistName, objMusic.userNickname, objMusic.status);
    item.setAttribute('name', objMusic.fileName);
    item.setAttribute('status', objMusic.status);
    item.onclick = function()
    {
        if (!clickTimeOut)
        {
            clickTimeOut = true;
            playContent(objMusic);
            setTimeout(function() {
                clickTimeOut = false;
            }, 700);
        }
    }
    return item;
}
var clickTimeOut = false;
function createNewItem(fileNameAlias, artist, nickN, status)
{
    var itemMusic = document.createElement("li");
    var musicName = document.createElement("div");
    var statusContainer = document.createElement("div");
    var statusIcon = document.createElement("img");
    var artistName = document.createElement("div");
    var marquee = document.createElement("div");
    var nickName = document.createElement("div");
    var songTitle = document.createElement("div");
    var tilteContainer = document.createElement("div");

    itemMusic.setAttribute('id', "musicListItem");
    musicName.setAttribute('id', 'musicName');
    statusIcon.setAttribute('id', 'status');
    statusIcon.src = "images/pause.png";
    artistName.setAttribute('id', 'artistName');
    marquee.setAttribute('id', 'marquee');
    songTitle.setAttribute('id', 'songTitle');
    tilteContainer.setAttribute('id', 'tilteContainer');
    statusContainer.setAttribute('id', 'statusContainer');
    nickName.setAttribute('id', 'nickName');

    if (!fileNameAlias) {
        musicName.innerText = " ";
        musicName.textContent = " ";
    }
    else
    {
        musicName.innerText = fileNameAlias;
        musicName.textContent = fileNameAlias;
    }
    //create artistName
    if (!artist) {
        artistName.innerText = UNKNOWN_ARTIST;
        artistName.textContent = UNKNOWN_ARTIST;
    }
    else {
        artistName.innerText = artist;
        artistName.textContent = artist;
    }

    if (!nickN) {
        nickN = FROM_DLNA_NICK_NAME;
    }
    nickName.innerText = nickN;
    nickName.textContent = nickN;


    statusContainer.appendChild(statusIcon);
    marquee.appendChild(musicName);
    songTitle.appendChild(marquee);

    tilteContainer.appendChild(statusContainer);
    tilteContainer.appendChild(songTitle);

    itemMusic.appendChild(tilteContainer);
    itemMusic.appendChild(artistName);
    itemMusic.appendChild(nickName);

    return itemMusic;
}
function playContent(itemMusic) {
    document.getElementById("historyBackButton").disabled = true;
    var objPlayPhotoContenClass = new GetContentListClass();
    objPlayPhotoContenClass.fileName = itemMusic.fileName;
    objPlayPhotoContenClass.type = "music";
    objPlayPhotoContenClass.togglePlayStatus(playMusicContentMethodUICallback, "");
}
function playMusicContentMethodUICallback(retObj)
{
    setTimeout(function() {
        // after finish play content, enable click event on masonry gird and close current preview.
        if (retObj instanceof ObjError) {
            if (retObj.code == CANNOT_OPERATE) {
                //switchToTimeLineUI();
            } else if (retObj.code == NOT_FOUND) {
                UIerrorpopUp(retObj.message);
            } else if (retObj.code != SUCCESS) {
                //UIerrorpopUp(retObj.message);
                UIerrorpopUp(translationlist['64364']);
            }
        }
    }, 1000);
}
function onLoadMusicList()
{
    if (isMobile.iOS())
    {
        $('#btnAdd').remove();
    }
}
function countItemMusicList()
{
    var countItem = $("#list").children().size();
    return countItem;
}
/* function to set max-height Music List popup */
function setMaxHeightMusicList()
{
    var count = 0;
    count = $("#list").children().size()
    if (count >= 4) {
        count = 4;
    }
    $("#musicListScroll").css({"max-height": (count * $("#musicListItem").height() * 1.2) + 'px'});
    musicScroll.refresh();
}

var musicScroll = null;
/* function to create iScroll Music List object */
function createMusicListScroll() {
    if (null != musicScroll) {
        musicScroll.destroy();
        musicScroll = null;
    }
    musicScroll = new iScroll('musicListScroll', {
        hScrollbar: false,
        hScroll: false,
        hideScrollbar: true
    });
}
