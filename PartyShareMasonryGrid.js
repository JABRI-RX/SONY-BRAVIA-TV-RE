/*
 * Copyright 2014 Sony Corporation
 */
var playingItemFlag = false;
var psMasonry = new PSMasony();
var download = null;

docReady(function() {
    setTimeout(function() {
        var timelineW = $("#timelineId").width();
        $('.masonry').width(timelineW);
        psMasonry.init();
        // add transparent div to bottom of masonry grid to scroll to last items of grid.
        var addBtn = document.getElementById("addButtonImg");
        if (addBtn.complete) {
            var emptyDiv = document.createElement('div');
            emptyDiv.className = "emptyDiv";
            emptyDiv.style.height = addBtn.offsetHeight * 13 / 16 + "px"; // height of div must equals to height of plus icon.
            psMasonry.addElemToTopLayout(emptyDiv);
        } else {
            addBtn.onload = function() {
                var emptyDiv = document.createElement('div');
                emptyDiv.className = "emptyDiv";
                emptyDiv.style.height = addBtn.offsetHeight * 13 / 16 + "px"; // height of div must equals to height of plus icon.
                psMasonry.addElemToTopLayout(emptyDiv);
            }
        }
    }, 200);
});

function MasonryItem(_avatarUrl, _url, _nickName, _id, _isVideo) {
    this.url = _url;
    this.id = _id;
    if (_nickName == "")
    {
        this.nickName = FROM_DLNA_NICK_NAME;
    } else {
        this.nickName = _nickName;
    }
    this.imageObj;
    this.divObj;
    this.onClickHandler;
    this.msnry;
    this.divVideoButton;
    this.imageVideoButton;
    this.imgTV;
    this.isVideo = _isVideo;
    if (_avatarUrl == "")
    {
        this.avatarUrl = "images/default_DLNA_Avatar.png";
    } else {
        this.avatarUrl = _avatarUrl;
    }
    this.originalUrl = "";
    this.status = MEDIA_STOPPED;
    this.size = 0;
    // update url of image on masonry timeline.
    this.updateUrl = function(newUrl, callback) {
        var self = this;
        self.imageObj.onload = function() {
            psMasonry.layout();
            if (callback != null) {
                callback.call();
            }
        };
        self.imageObj.src = newUrl;
    }

    this.buildUI = function(msnry) {
        var self = this;
        self.msnry = msnry;
        self.divObj = document.createElement('div');
        var tempDiv = document.createElement('div');
        tempDiv.className = "itemTemp";
        self.imageObj = document.createElement('img');
        self.divVideoOption = document.createElement('div');
        self.imageVideoOption = document.createElement('img');
        self.divOpBottom = document.createElement('div');
        self.spanNickName = document.createElement('div');

        self.imageObj.id = self.id + "thumbId";
        self.imageObj.src = self.url;
        self.imageObj.className = "imgItem";
        self.imageVideoOption.src = "images/playIcon.png";
        self.imageVideoOption.className = "playIconUI";
        if (!isLinux) {
            self.imgTV = document.createElement('img');
            self.imgTV.src = "images/icon_tv.png";
            self.imgTV.className = "imgIconTV";
        }
        self.spanNickName.id = self.id + "nickNameId";
        self.spanNickName.className = "divNickName";
        self.spanNickName.textContent = self.nickName;
        self.spanNickName.innerText = self.nickName;
        self.spanNickName.style.color = "black";
        self.divObj.id = self.id;
        self.divObj.className = "item";
        self.divOpBottom.className = "opBottom";
        // bind event click to play content when click on image
        self.onClickHandler = function() {
            if (playingItemFlag == true) {
                return;
            }
            playingItemFlag = true;
            /* Check file size, if >1MB -> use animation, else not use.*/
            if (self.size < (1024 * 1024)) {
                togglePlayStatusMethod(self.id);
                return;
            }
            var ratio = 1.2;
            var itemDiv = document.createElement("div");
            var itemDiv2 = document.createElement("div");
            itemDiv.style.top = self.divVideoOption.style.top;
            itemDiv.style.left = self.divVideoOption.style.left;
            itemDiv.style.height = self.divVideoOption.style.height;
            itemDiv.style.width = self.divVideoOption.style.width;
            itemDiv.innerHTML = self.divVideoOption.innerHTML;
            itemDiv.style.position = "relative";

            //itemDiv2.style = "position: absolute; top:0px; left:0px; width: 100%; height:100%; z-index:20";
            itemDiv2.style.position = "absolute";
            itemDiv2.style.top = "0px";
            itemDiv2.style.left = "0px";
            itemDiv2.style.width = "100%";
            itemDiv2.style.zIndex = "20";
            itemDiv2.id = "playingAnmDivId";
            $(itemDiv2).append(itemDiv);
            $(self.divVideoOption).append(itemDiv2);
            var divTop = $(itemDiv2).position().top;
            var newHeight = $(itemDiv2).height() * ratio;
            var oldHeight = $(itemDiv2).height();
            var divLeft = $(itemDiv2).position().left;
            var newWidth = $(itemDiv2).width() * ratio;
            var oldWidth = $(itemDiv2).width();
            setTimeout(function() {
                togglePlayStatusMethod(self.id);
                $(itemDiv2).animate({
                    top: (divTop - (newHeight - oldHeight) / 2) + 'px',
                    left: (divLeft - (newWidth - oldWidth) / 2) + 'px',
                    height: newHeight + 'px',
                    width: newWidth + 'px',
                    opacity: 1.0
                }, {
                    complete: function() {
                        $(itemDiv2).animate({
                            top: (divTop - (newHeight - oldHeight) / 2 + 20) + 'px',
                            opacity: 0.5
                        }, {
                            complete: function() {
                                $(itemDiv2).animate({
                                    top: (divTop - $(document).height()) + 'px',
                                    opacity: 0.1
                                }, {
                                    complete: function() {
                                        $(itemDiv2).remove();
                                    }
                                });
                            }
                        });
                    }
                });
            }, 200);
        }

        var longpress = false;
        var pressTimer = null;
        var preventShortPress = false;
        var ox;
        var oy;
        // Save content if item is photo or video
        if (!self.isVideo) {
            $(self.imageObj).on('touchstart', function(e) {
                clearTimeout(pressTimer);
                preventShortPress = false;
                ox = e.originalEvent.touches[0].clientX;
                oy = e.originalEvent.touches[0].clientY;
                longpress = false; //longpress is false initially
                pressTimer = window.setTimeout(function() {
                    //download = self.originalUrl.replace("contentshare/image/", "contentshare/download/");
                    download = self.originalUrl;
                    //alert('long press');
                    showHideSaveContentPopup();
                    longpress = true; //if run hold function, longpress is true
                }, 1000)
            });

            $(self.imageObj).on('touchend', function() {
                if (!longpress && !preventShortPress) {
                    self.onClickHandler();
                }
                longpress = false;
                preventShortPress = false;
                clearTimeout(pressTimer); //clear time on mouseup
            });

            $(self.imageObj).on('touchmove', function(e) {
                var tx = e.originalEvent.touches[0].clientX;
                var ty = e.originalEvent.touches[0].clientY;
                if (Math.abs(ox - tx) > 5 | Math.abs(oy - ty) > 5) {
                    //if move distance is long enough, can not show save dialog
                    preventShortPress = true;
                    clearTimeout(pressTimer);
                }
            });
        } else {
            var touchStart = function(e) {
                clearTimeout(pressTimer);
                preventShortPress = false;
                ox = e.originalEvent.touches[0].clientX;
                oy = e.originalEvent.touches[0].clientY;
                longpress = false; //longpress is false initially
                pressTimer = window.setTimeout(function() {
                    var extension = self.originalUrl.substring(self.originalUrl.length - 4);
                    if (iOS) {
                        //if device run iOS and current play media is video,
                        //show error message can not save video
                        UIerrorpopUp(translationlist['80848']);
                    } else {
                        //download = self.originalUrl.replace("contentshare/image/", "contentshare/download/");
                        download = self.originalUrl;
                        showHideSaveContentPopup();
                    }
                    longpress = true; //if run hold function, longpress is true
                }, 1000)
            }
            $(self.imageVideoOption).on('touchstart', touchStart);
            $(self.imageObj).on('touchstart', touchStart);
            var touchEnd = function() {
                if (!longpress && !preventShortPress) {
                    self.onClickHandler();
                }
                longpress = false;
                preventShortPress = false;
                clearTimeout(pressTimer); //clear time on mouseup
            }
            $(self.imageVideoOption).on('touchend', touchEnd);
            $(self.imageObj).on('touchend', touchEnd);
            var touchMove = function(e) {
                var tx = e.originalEvent.touches[0].clientX;
                var ty = e.originalEvent.touches[0].clientY;
                if (Math.abs(ox - tx) > 5 | Math.abs(oy - ty) > 5) {
                    //if move distance is long enough, can not show save dialog
                    clearTimeout(pressTimer && !preventShortPress);
                    preventShortPress = true;
                }
            }
            $(self.imageVideoOption).on('touchmove', touchMove);
            $(self.imageObj).on('touchmove', touchMove);
        }

        self.divVideoOption.style.position = "relative";
        if (self.isVideo) {
            self.divVideoOption.appendChild(self.imageVideoOption);
        }
        self.divVideoOption.appendChild(self.imageObj);
        if (!isLinux)
            self.divVideoOption.appendChild(self.imgTV);
        tempDiv.appendChild(self.divVideoOption);
        if (!isLinux) {
            self.imgEmotion = document.createElement('img');
            self.imgEmotion.className = "imgAnimal";
            self.imgEmotion.src = self.avatarUrl;
            self.divOpBottom.appendChild(self.imgEmotion);
        } else {
            self.spanNickName.style.paddingLeft = 0;
        }
        if (!isLinux) {
            self.imgRotate = document.createElement('img');
            self.imgRotate.className = "imgRotate";
            self.imgRotate.src = "images/turn1.png";
            self.imgRotate.setAttribute("onclick", "setRotationDegree('" + self.id + "', 90);");
            self.divOpBottom.appendChild(self.imgRotate);
        }
        self.divOpBottom.appendChild(self.spanNickName);
        tempDiv.appendChild(self.divOpBottom);

        var tempDiv2 = document.createElement('div');
        tempDiv2.className = "itemTemp2";
        tempDiv2.appendChild(tempDiv);
        self.divObj.appendChild(tempDiv2);
        self.updateStatusUI(self.status);
        return self.divObj;
    }

    this.updateNickName = function(newNickName) {
        var self = this;
        self.nickName = newNickName;
        var nickNameSpan = document.getElementById(self.id + "nickNameId");
        if (nickNameSpan != null && nickNameSpan != 'undefined') {
            nickNameSpan.textContent = self.nickName;
            nickNameSpan.innerText = self.nickName;
        }
    }
    this.updateStatusUI = function(newStatus) {
        var self = this;
        self.status = newStatus;
        if (self.status == MEDIA_PLAYING) {
            if (!isLinux) {
                if (!self.isVideo) {
                    self.imgRotate.style.display = "block";
                } else {
                    self.imgRotate.style.display = "none";
                }
                self.imgTV.style.display = "block";
            }
            psMasonry.playingItem = self;
        } else if(self.status == MEDIA_PAUSED) {
            if(!isLinux){
                if (self.isVideo) {
                    self.imgTV.style.display = "block";
                }
            }
        } else {
            if (!isLinux) {
                self.imgRotate.style.display = "none";
                self.imgTV.style.display = "none";
            }
        }
    }
    this.updateAvatar = function(newAvatar) {
        var self = this;
        if (!isLinux) {
            if (!self.avatarUrl || self.avatarUrl.length == 0 || self.avatarUrl != newAvatar)
            {
                if (self.divOpBottom.children[0]) {
                    self.avatarUrl = newAvatar;
                    self.imgEmotion.src = self.avatarUrl;
                }
            }
        } else {
            self.spanNickName.style.paddingLeft = 0;
        }
    }
}

function PSMasony() {
    this.msnry = null;
    this.container = null;
    this.itemList = new Array(); // store all items (MasonryItem) of masonry grid
    this.playingItem = null;
    this.layout = function() {
        var self = this;
        if (self.msnry != null) {
            self.msnry.layout();
        }
        playingItemFlag = false;
        /* remove animation if exist */
        var anmDiv = $("#playingAnmDivId");
        if (anmDiv != null) {
            anmDiv.remove();
        }
    }
    this.init = function() {
        var self = this;
        // Create masonry object
        self.container = document.querySelector('.masonry');
        self.msnry = new Masonry(self.container, {
            columnWidth: self.container.offsetWidth / 2
        });
        self.msnry.on('layoutComplete', function() {
            if (myScroll != null)
                myScroll.refresh();
            return false;
        });
    }
    this.addElemToTopLayout = function(elem) {
        var self = this;
        var fragment = document.createDocumentFragment();
        fragment.appendChild(elem);
        // append elements to container
        self.container.appendChild(fragment);
        // add and lay out newly appended elements
        self.msnry.prepended(elem);
    }
    this.addItem = function(item, callback) {
        var self = this;
        // check type of item
        if (item instanceof MasonryItem) {
            // push item to array
            if (self.itemList.indexOf(item) == -1) {
                self.itemList.push(item);
                // display on UI
                item.buildUI(self.msnry);
                if (true == item.imageObj.complete) {
                    self.addElemToTopLayout(item.divObj);
                    if (callback != null) {
                        callback.call();
                    }
                } else {
                    item.imageObj.onload = function() {
                        // set null to 'onload event'
                        // to prevent add item again if src property of image is changed.
                        item.imageObj.onload = null;
                        self.addElemToTopLayout(item.divObj);
                        if (callback != null) {
                            callback.call();
                        }
                    };
                }
            }
        }
    }

    /* Remove specified items from masonry item list */
    this.batchRemove = function(removedItems) {
        var self = this;
        if (removedItems != null && removedItems instanceof Array && removedItems.length > 0) {
            for (var i = 0; i < removedItems.length; i++) {
                var item = removedItems[i];
                var index = self.itemList.indexOf(item);
                if (index != -1) {
                    self.msnry.remove(item.divObj);
                    // remove one item after position = index.
                    self.itemList.splice(index, 1);
                }
            }
            // layout remaining item elements
            self.msnry.layout();
        }
    }
    this.saveContent = function() {
        if (download != null) {
            /*
            $.fileDownload(download)
                    .done(function() {
            })
                    .fail(function() {
                UIerrorpopUp(translationlist['80585']);
            });
            */
            //alert("download url:" + download);
            var win = window.open(download, '_blank');
            win.focus();
            download = null;
        } else {
            UIerrorpopUp(translationlist['80585']);
        }
    }
}
