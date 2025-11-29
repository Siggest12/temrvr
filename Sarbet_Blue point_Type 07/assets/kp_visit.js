var swiper, layer, layerform = null, isSwiperLoading = false, isVrFirstloading = false, isAutoRotate = true, sceneVideoHotspotTmp = [];
layui.use(function () {
    layer = layui.layer;
    layerform = layui.form;
});

window.onload = function () {
    /***iPhone手机端不能全屏***/
    if (isIOS()) {
        $('.iconRight .fullscreen').hide();
    }
    template.defaults.minimize = true;
    if (groupMode == 0) {
        loadingItemSceneListHtml(visitItemSceneList[0]);
    } else {
        loadingItemSceneListHtml(visitItemSceneList[groupModeFirstId]);
        $('.itemGroupListContainer .itemGroupList .groupName' + groupModeFirstId).addClass('active').siblings('div').removeClass('active');
    }
    isSwiperLoading = true;
    if ($('.marqueeTop').length > 0) {
        $('.marqueeContent').liMarquee();
        setTimeout(function () {
            $('.marqueeTop').show();
        }, 300);
    }
    $('.itemSwiper .swiper-wrapper .swiper-slide:eq(0)').children('.swiper-box').addClass('active').children('img').show();
    addScrollAnimationStyle();
    autoClipboard();
    /**移动端不展示部分内容**/
    if (isMobile()) {
        $('.iconBottomRight .share').hide();
        $('.iconRight .gyro').show();
        $('.gestureTips div').html('<img src="skin/img/touch_alert.png"><span>Drag the mouse to browse</span>');
        if ($('.itemGroupListContainer').length == 0) {
            $('.itemPreview').css('bottom', '55px');
        }
    } else {
        $('.iconBottomRight .share').show();
        $('.iconRight .gyro').hide();
        $('.gestureTips div').html('<img src="skin/img/mouse_alert.png"><span>Finger drag screen browsing</span>');
        if ($('.itemGroupListContainer').length == 0) {
            $('.itemPreview').css('bottom', '90px');
        }
        /*createQrcode('canvasQrcode', VRVISITURL, 300, 300);*/
    }
    if (visitPwdOpen == 2) {
        lockFullScreen();
    } else {
        onloadCompalteInit();
    }
    if (isFirstSceneCompareMode > 0) {
        $('.iconRight .openCompare').show();
        $('.iconRight .openCompare').click();
    }
    if (sceneListShow == 2) {
        setTimeout(function () {
            $('.itemPreview').css({'z-index': 50});
            $('.itemGroupList').css({'z-index': 50});
        }, 1500);
    }
}

function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

/**初次加载后执行**/
function onloadCompalteInit() {
    if (!isVrFirstloading) {
        if ($('.marqueeTop').length > 0) {
            $('.marqueeContent').liMarquee();
            setTimeout(function () {
                $('.marqueeTop').show();
            }, 300);
        }
        setTimeout(function () {
            $('.gestureTips').show();
        }, 1000);
        setTimeout(function () {
            $('.gestureTips').hide();
        }, 4000);
        isVrFirstloading = true;
    }
}

/**退出全屏对比模式**/
$('.exitCompare div').on('click', function () {
    $('#pano').show();
    $('#panoCompare').hide();
    $('.exitCompare div').hide();
    if (krpanoCompare != null) {
        removepano('panoCompare');
        krpanoCompare = null;
    }
});
/**开启全屏对比模式**/
$('.openCompare').on('click', function () {
    $('#pano').hide();
    $('#panoCompare').show();
    $('.exitCompare div').show();
    let _id = panoFirstCompareInfo.id;
    if (panoSceneNums > 1) {
        _id = $('.itemPreviewContainer .itemPreview .swiper-slide-active').attr('data-id');
    }
    let _xml = VRXMLURL + "comparexml/" + visitId + '-' + _id + '-' + lastTime + '.xml';
    if (krpanoCompare != null) {
        removepano('panoCompare');
    }
    embedpano({
        id: "krpanoCompareObject", xml: _xml, sameorigin: false, target: "panoCompare", onready: function (k) {
            krpanoCompare = k;
        }
    });
});

/**切换视角弹窗**/
$('.viewswitching').on('click', function () {
    let _area = ['300px', '150px'];
    if (isMobile()) {
        _area = ['90%', '150px'];
    }
    layer.open({
        type: 1,
        title: 'Switch view',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.viewswitchingContainer')
    });
});

/**切换视角**/
$('.viewswitchingContainer div').on('click', function () {
    $(this).addClass('active').siblings('div').removeClass('active');
    let _index = $(this).index();
    if (_index == 2) {
        krpano.call('skin_view_fisheye();');
    } else if (_index == 1) {
        krpano.call('skin_view_littleplanet();');
    } else {
        krpano.call('skin_view_normal();');
    }
});

window.onresize = function () {
    if (isSwiperLoading) {
        loadingSwiperPlugin();
    }
}

/**加载swiper插件**/
function loadingSwiperGroupPlugin() {
    let _clienWidth = document.body.clientWidth;
    new Swiper(".groupSwiper", {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: parseInt(_clienWidth / 75),
                spaceBetween: 10
            },
            768: {
                slidesPerView: parseInt(_clienWidth / 85),
                spaceBetween: 10
            },
            1280: {
                slidesPerView: parseInt(_clienWidth / 95),
                spaceBetween: 10
            }
        },
        grabCursor: true,
        on: {
            init: function () {
                let _slideWidth = $('.itemSwiper .swiper-slide').css("width");
                $('.groupSwiper .swiper-slide').css({"width": (parseInt(_slideWidth) + 10) + 'px'});
            },
            resize: function () {
            },
        },
        centerInsufficientSlides: true,
        freeMode: true,
    });
}

/**加载swiper插件**/
function loadingSwiperPlugin() {
    let _clienWidth = document.body.clientWidth;
    swiper = new Swiper(".itemSwiper", {
        slidesPerView: 'auto',
        spaceBetween: 10,
        breakpoints: {
            320: {
                slidesPerView: parseInt(_clienWidth / 75),
                spaceBetween: 10
            },
            768: {
                slidesPerView: parseInt(_clienWidth / 85),
                spaceBetween: 10
            },
            1280: {
                slidesPerView: parseInt(_clienWidth / 95),
                spaceBetween: 10
            }
        },
        grabCursor: true,
        on: {
            init: function () {
                let _slideWidth = $('.itemSwiper .swiper-slide').css("width");
                $('.itemSwiper .swiper-slide .swiper-box').css({"width": (parseInt(_slideWidth) - 4) + 'px', "height": (parseInt(_slideWidth) - 4) + 'px'});
                showSceneThumbHandler();
            },
            resize: function () {
            },
        },
        centerInsufficientSlides: true,
        freeMode: true,
        observer: true,
    });
    loadingSwiperGroupPlugin();
}

/**重载场景列表数据**/
function loadingItemSceneListHtml(data) {
    $('.itemSwiper .swiper-wrapper').html(template('itemSlideTpl', data));
    loadingSwiperPlugin();
}

/**点击分组加载数据**/
$(document).on('click', '.itemGroupList .groupName', function () {
    $(this).addClass('active').siblings('div').removeClass('active');
    let _index = $(this).attr('data-id');
    loadingItemSceneListHtml(visitItemSceneList[_index]);
    $('.itemSwiper .swiper-wrapper .swiper-slide:eq(0)').click();
});

/**点击场景**/
$(document).on('click', '.itemSwiper .swiper-wrapper .swiper-slide', function () {
    let _id = $(this).attr('data-id');
    let _compareId = $(this).attr('data-compare');
    $(this).children('.swiper-box').addClass('active').parent().siblings().children('.swiper-box').removeClass('active');
    $(this).children('.swiper-box').children('img').show();
    swiper.slideTo($(this).index(), 1000, false);
    if (_compareId > 0) {
        $('.exitCompare div').click();
        $('.iconRight .openCompare').show();
        $('.iconRight .openCompare').click();
    } else {
        $('.iconRight .openCompare').hide();
        $('.exitCompare div').click();
    }
    if (krpano.get('action[dh_doblend].name') == null) {
        krpano.call('loadscene(scene_' + _id + ', null, MERGE, BLEND(1.0, easeInCubic));scene3dtransition(scene_' + _id + ');');
    } else {
        krpano.call('dh_doblend("scene_' + _id + '",' + switcheffect + ')');
    }
    clickSceneThumbTmpHandler(_id);
    isSwitchSceneAutoPlaybg(_id);
});

/**点击展示场景选择**/
var _fristClickScene = false;
$(document).on('click', '.iconBottomLeft .scene', function () {
    if (!_fristClickScene && $('.itemPreviewContainer .itemPreview').css("z-index") == -1) {
        _fristClickScene = true;
        setTimeout(function () {
            $('.itemPreviewContainer .itemPreview').css('z-index', 50);
            $('.itemGroupListContainer .itemGroupList').css('z-index', 50);
            _fristClickScene = false;
        }, 500);
    } else {
        $('.itemPreviewContainer .itemPreview').css('z-index', -1);
        $('.itemGroupListContainer .itemGroupList').css('z-index', -1);
        _fristClickScene = false;
    }
});

/**点赞**/
$(document).on('click', '.iconBottomRight .like', function () {
    let _that = $(this);
    let _zanNum = parseInt(_that.children('span').text());
    if (_that.hasClass('-ok')) {
        layer.msg('succeed!');
        return false;
    }
    $.ajax({
        type: "POST",
        url: VRURL + "addlike",
        data: {
            visitid: visitId,
        },
    }).done(function (data) {
        layer.msg(data.msg, {time: 1000}, function () {
            if (data.status == 200) {
                _that.addClass('-ok').children('span').text(_zanNum + 1);
                _that.children('img').attr('src', _that.attr('data-img'));
            }
        });
    });
});

/**当前环境是否是手机**/
function isMobile() {
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        return true;
    } else {
        return false;
    }
}

/**作品简介 弹窗**/
$(document).on('click', '.iconBottomRight .infos', function () {
    let _area = ['450px', '350px'];
    if (isMobile()) {
        _area = ['90%', '400px'];
    }
    layer.open({
        type: 1,
        title: 'Work information',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.infosContainer')
    });
});

/**在线预约 弹窗**/
$(document).on('click', '.iconBottomRight .yuyue', function () {
    let _area = ['500px', '400px'];
    if (isMobile()) {
        _area = ['90%', '400px'];
    }
    layer.open({
        type: 1,
        title: 'Online Reservation',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.yuyueContainer')
    });
});

/**在线预约 提交**/
function addItemYuyue() {
    let _username = $('#username').val();
    let _userphone = $('#userphone').val();
    let _userinfos = $('#userinfos').val();
    if (_username == '') {
        layer.msg('Please enter your name.');
        return false;
    }
    if (_userphone == '') {
        layer.msg('Please enter your contact number so that we can contact you easily.');
        return false;
    }
    if (_userinfos == '') {
        layer.msg('Briefly describe your needs.');
        return false;
    }
    $.ajax({
        type: "POST",
        url: VRURL + "addyuyue",
        data: {
            visitid: visitId,
            username: _username,
            userphone: _userphone,
            userinfos: _userinfos,
        },
    }).done(function (data) {
        layer.msg(data.msg, {time: 1000}, function () {
            if (data.status == 200) {
                $('#username').val("");
                $('#userphone').val("");
                $('#userinfos').val("");
                layer.closeAll();
            }
        });
    });
}

/**联系方式 弹窗**/
$(document).on('click', '.iconBottomRight .contacts', function () {
    let _area = ['260px', '260px'];
    if (isMobile()) {
        _area = ['90%', '260px'];
    }
    layer.open({
        type: 1,
        title: 'Contact information',
        shadeClose: false,
        shade: 0.8,
        area: _area,
        content: $('.contactsContainer')
    });
});

/**复制插件**/
function autoClipboard() {
    let clipboard = new ClipboardJS('.clipboard');
    clipboard.on('success', function (e) {
        if (e.text.length > 0) {
            layer.msg('succeed！', {time: 1000});
        }
    });
}

/**分享 弹窗**/
$(document).on('click', '.iconBottomRight .share', function () {
    layer.open({
        type: 1,
        title: false,
        shadeClose: false,
        shade: 0.8,
        area: ['430px', '460px'],
        content: $('.shareContainer'),
    });
});

/**生成二维码**/
function createQrcode(obj, text, width, height) {
    new QRCode(document.getElementById(obj), {
        render: "canvas",
        text: text,
        width: width,
        height: height,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

/** 清除canvas画布**/
function clearDrawCanvas() {
    let c = document.getElementById("itemCanvas");
    c.height = c.height;
    let ctx = c.getContext("2d");
    ctx.clearRect(0, 0, 400, 500);
}

/**绘制cansvas**/
function drawCanvas() {
    let _scale = 1;
    let _title = $('#canvasName').val();
    if (_title.length > 14) {
        _title = _title.substring(0, 12) + '...';
    }
    let _author = $('#canvasAuthor').val();
    if (_author.length > 12) {
        _author = _author.substring(0, 10) + '...';
    }
    let _avatarimgUrl = $('#canvasAvatarUrl').val();
    let _itmeThumbUrl = $('#canvasThumbUrl').val();
    let _canvasWidth = 400;
    let _canvasHeight = 500;
    let c = document.getElementById("itemCanvas");
    let ctx = c.getContext("2d");
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, _canvasWidth * _scale, _canvasHeight * _scale)
    ctx.font = "normal bold 24px 'Microsoft YaHei'";
    ctx.fillStyle = "#333333";
    ctx.textAlign = "center";
    ctx.fillText(_title, 200 * _scale, 50 * _scale, 240 * _scale);
    /**绘制直线**/
    ctx.moveTo(50 * _scale, 100 * _scale);
    ctx.lineTo(120 * _scale, 100 * _scale);
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = "1";
    ctx.moveTo(270 * _scale, 100 * _scale);
    ctx.lineTo(340 * _scale, 100 * _scale);
    ctx.strokeStyle = "#666666";
    ctx.lineWidth = "1";
    ctx.stroke();
    /**绘制个人头像**/
    let _avatarimg = new Image();
    _avatarimg.src = _avatarimgUrl;
    _avatarimg.setAttribute('crossorigin', 'anonymous');
    _avatarimg.onload = function () {
        drawCanvasRound(ctx, _avatarimg, 130 * _scale, 84 * _scale, 15);
    };
    /**个人昵称**/
    ctx.font = "14px 'Microsoft YaHei'";
    ctx.fillStyle = "#333333";
    ctx.textAlign = "left";
    ctx.fillText(_author, 165 * _scale, 104 * _scale, 100 * _scale);
    /**绘制预览图**/
    let _itmeThumb = new Image();
    _itmeThumb.src = _itmeThumbUrl;
    _itmeThumb.setAttribute('crossorigin', 'anonymous');
    _itmeThumb.onload = function () {
        let _scalex = 1.25;
        ctx.drawImage(_itmeThumb, 70, 115, 360 * _scalex, 270 * _scalex, 20 * _scale, 140 * _scale, 360 * _scale, 270 * _scale);
        /*drawCanvasRoundRect(ctx, _itmeThumb, 20 * _scale, 140 * _scale, 360 * _scale, 270 * _scale, 10);*/
        /**生成作品二维码**/
        let _canvasQrcode = new Image();
        _canvasQrcode.src = $('#canvasQrcode img').attr('src');
        _canvasQrcode.setAttribute('crossorigin', 'anonymous');
        _canvasQrcode.onload = function () {
            //先填充一个白色背景
            ctx.fillStyle = '#fafafa';
            ctx.fillRect(240 * _scale, 350 * _scale, 120 * _scale, 120 * _scale)
            ctx.drawImage(_canvasQrcode, 250 * _scale, 360 * _scale, 100 * _scale, 100 * _scale);
        };
    };
}

/**绘制圆形头像**/
function drawCanvasRound(ctx, img, x, y, r) {
    ctx.save();
    var d = 2 * r;
    var cx = x + r;
    var cy = y + r;
    ctx.arc(cx, cy, r, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(img, x, y, d, d);
    ctx.restore();
}

/**绘制矩形图片圆角**/
function drawCanvasRoundRect(ctx, img, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, 0);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, 0);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
    ctx.save();
    ctx.clip();
    ctx.drawImage(img, x, y, w, h);
    ctx.restore();
}

/**保存canvas图片**/
function downLoadCanvasImage(obj) {
    var _shareImg = new Image();
    _shareImg.setAttribute('crossorigin', 'anonymous');
    _shareImg.src = document.getElementById("itemCanvas").toDataURL("image/png");
    _shareImg.onload = function () {
        var a = document.createElement("a");
        a.href = _shareImg.src;
        a.download = $(obj).attr('data-name');
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}

/**保存canvas qrcode图片**/
function downLoadCanvasQrcode(obj) {
    var a = document.createElement("a");
    a.href = $('#canvasQrcode img').attr('src');
    a.download = $(obj).attr('data-name');
    document.body.appendChild(a);
    a.click();
    a.remove();
}

/**音乐播放状态切换**/
function soundOnPlay() {
    $('.iconRight .music img').attr('src', 'skin/img/music-open.png');
}

/**音乐暂停状态切换**/
function soundOnPause() {
    $('.iconRight .music img').attr('src', 'skin/img/music-close.png');
}

/**热点音频暂停**/
function hotspotAudioOnPlay(src) {
    var _src = $('#autoHotspotAudio').attr('src');
    if (_src === undefined || _src != src) {
        $('#autoHotspotAudio').attr('src', src);
        document.getElementById('autoHotspotAudio').play();
        krpano.call("pausesound('bgsnd')");
    } else {
        var _obj = document.getElementById('autoHotspotAudio');
        if (_obj.paused == false) {
            hotspotAudioOnPause();
            krpano.call("playsound('bgsnd')");
        } else {
            document.getElementById('autoHotspotAudio').play();
            krpano.call("pausesound('bgsnd')");
        }
    }
}

/**热点音频播放**/
function hotspotAudioOnPause() {
    document.getElementById('autoHotspotAudio').pause();
}

/**点击热点 跳转场景**/
function HotspotToScene(t) {
    loadingItemSceneListHtml(visitItemSceneList[scene2group[t]]);
    $('.itemSwiper .swiper-wrapper .swiper-slide' + t).click();
    $('.itemSwiper .swiper-wrapper .swiper-slide' + t).children('.swiper-box').children('img').show();
    $('.itemGroupListContainer .itemGroupList .groupName' + scene2group[t]).addClass('active').siblings('div').removeClass('active');
    clickSceneThumbTmpHandler(t);
}

/**点击热点 打开图片**/
function HotspotToPic(t) {
    let _arr = [];
    _arr['list'] = hotspotlistpics[t];
    $('.hotspotlistpics').html(template('glightBoxPicTpl', _arr));
    var lightboxPics = GLightbox({
        selector: '.glightboxpic',
    });
    lightboxPics.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
    });
    lightboxPics.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxPics.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.8)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开视频**/
function HotspotToVideo(t) {
    let _arr = [];
    _arr['list'] = hotspotlistvideo[t];
    $('.hotspotlistvideo').html(template('glightBoxVideoTpl', _arr));
    var lightboxVideo = GLightbox({
        selector: '.glightboxvideo',
    });
    lightboxVideo.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
    });
    lightboxVideo.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxVideo.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.8)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开图文热点**/
function hotspotImg2Text(t) {
    let _arr = JSON.parse(hotspotlistImg2Text[t]);
    $('.hotspotlistimgs2text').html(template('glightBoxImgs2TextTpl', _arr));
    var lightboxImgs2Text = GLightbox({
        selector: '.glightboximgs2text',
        moreText: 'See More',
        descPosition: 'right',
    });
    lightboxImgs2Text.on('open', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", false);
        }
        $('.gcontainer .gdesc-inner').css({'box-sizing': 'border-box'});
        $('.gcontainer .gslide-desc').css({'color': '#666666', "font-size": '14px'});
        if (isMobile()) {
            $('.glightbox-clean .gprev').css({"top": "45%", "background-color": 'rgba(0,0,0,.5)'});
            $('.glightbox-clean .gnext').css({"top": "45%", "background-color": 'rgba(0,0,0,.5)'});
            $('.gcontainer .gslide-desc').css({'color': '#ffffff', "font-size": '14px'});
        }
    });
    lightboxImgs2Text.on('close', () => {
        if (isAutoRotate === true) {
            krpano.set("autorotate.enabled", true);
        }
    });
    lightboxImgs2Text.open();
    $('#glightbox-body .goverlay').css("background-color", "rgba(0, 0, 0, 0.8)");
    $('.glightbox-open').css("height", "100%");
}

/**点击热点 打开超链接热点**/
function HotspotToLink(id, target, link) {
    let _arr = target.split(':');
    if (_arr[0] == 0) {
        krpano.call('openurl("' + link + '","_blank")');
    } else if (_arr[0] == 1) {
        krpano.call('openurl("' + link + '","_self")');
    } else {
        let _width = "90vw", _height = "90vh";
        if (_arr[1] == 1) {
            let _h = $(window).height() * 0.5625;
            if (_h > $(window).width() * 0.9) {
                _h = $(window).width() * 0.9;
            }
            _width = _h + "px";
        }
        var lightboxLink = GLightbox({
            elements: [
                {
                    'href': link,
                }
            ],
            width: _width,
            height: _height,
        });
        lightboxLink.on('open', () => {
            if (isAutoRotate === true) {
                krpano.set("autorotate.enabled", false);
            }
        });
        lightboxLink.on('close', () => {
            if (isAutoRotate === true) {
                krpano.set("autorotate.enabled", true);
            }
        });
        lightboxLink.open();
    }
}

/**密码输入**/
function lockFullScreen() {
    layui.use(function () {
        layer = layui.layer;
        layerform = layui.form;
        layer.open({
            type: 1,
            title: false, // 禁用标题栏
            closeBtn: false, // 禁用默认关闭按钮
            area: ['100%', '100%'],
            scrollbar: false, // 暂时屏蔽浏览器滚动条
            anim: -1, // 禁用弹出动画
            isOutAnim: false, // 禁用关闭动画
            id: 'lockFullScreen',
            skin: 'skin-layer-lockFullScreen',
            content: ['<div class="layui-form">',
                '<div class="layui-input-wrap">',
                '<input type="password" maxlength="8" class="skin-layer-lockFullScreen-layer-pin" lay-affix="eye">',
                '<div class="layui-input-suffix">',
                '<i class="layui-icon layui-icon-right" id="lockFullScreen-unlock"></i>',
                '</div>',
                '</div>',
                '<div>Enter the correct password</div>',
                '</div>'].join(''),
            success: function (layero, index) {
                var input = layero.find('input');
                /**表单组件渲染**/
                layerform.render();
                input.focus();
                /**点击解锁按钮**/
                var elemUnlock = layero.find('#lockFullScreen-unlock');
                elemUnlock.on('click', function () {
                    let _pwd = $.trim(input[0].value);
                    $.ajax({
                        type: "GET",
                        url: VRURL + "checkitempwd",
                        data: {
                            visitid: visitId,
                            pwd: _pwd,
                        },
                    }).done(function (data) {
                        if (data.status == 200) {
                            layer.closeAll();
                            embedpano({
                                xml: visitXml, target: "pano", sameorigin: false, onready: function (k) {
                                    krpano = k;
                                    onloadCompalteInit();
                                }
                            });
                        } else if (data.status == -200) {
                            layer.msg('Too many password errors, try again in 10 minutes', {offset: '16px', anim: 'slideDown'})
                            input.focus();
                        } else {
                            layer.msg('Password error', {offset: '16px', anim: 'slideDown'})
                            input.focus();
                        }
                    });
                });
                /**回车**/
                input.on('keyup', function (e) {
                    var elem = this;
                    var keyCode = e.keyCode;
                    if (keyCode === 13) {
                        elemUnlock.trigger('click');
                    }
                });
            }
        });
    });
}

/**自动切换下一场景 赋予缩略图新的样式**/
function switchSceneThumb(id) {
    if (groupMode == 0) {
        $('.itemSwiper .swiper-slide' + id).children('.swiper-box').addClass('active').parent().siblings().children('.swiper-box').removeClass('active');
        $('.itemSwiper .swiper-slide' + id).children('.swiper-box').children('img').show();
        clickSceneThumbTmpHandler(id);
    } else {
        HotspotToScene(id);
    }
}

/**临时储存已经访问过的场景的id**/
function clickSceneThumbTmpHandler(t) {
    clickSceneThumbTmp.includes(t) === false ? clickSceneThumbTmp.push(t) : '';
    addScrollAnimationStyle();
}

/**增加滚动的样式**/
function addScrollAnimationStyle() {
    $("body,html").removeClass('scroll-animation');
    let _gText = $('.itemGroupListContainer .itemGroupList .active div span').text();
    let _iText = $('.itemPreviewContainer .itemPreview .swiper-wrapper .swiper-slide .active div span').text();
    if (_gText.length > 5) {
        $('.itemGroupListContainer .itemGroupList .active div span').addClass('scroll-animation');
    }
    if (_iText.length > 5) {
        $('.itemPreviewContainer .itemPreview .swiper-wrapper .swiper-slide .active div span').addClass('scroll-animation');
    }
}

/**赋予已经访问过的场景的缩略图选中状态**/
function showSceneThumbHandler() {
    $('.itemSwiper .swiper-slide').each(function (index, element) {
        let _id = $(this).attr('data-id');
        if (clickSceneThumbTmp.includes(_id) == true) {
            $(this).children('.swiper-box').children('img').show();
        }
    });
}

/**ai光影效果加载**/
function showEffectInformation(json_string) {
    var _s = JSON.parse(json_string);
    krpano.set("plugin[pp_light].exposure", _s.exposure);
    krpano.set("plugin[pp_light].lights", _s.lights);
    krpano.set("plugin[pp_light].shadows", _s.shadows);
    krpano.set("plugin[pp_light].filterrange", _s.filterrange);
    krpano.set("plugin[pp_light].masking", _s.masking);
    krpano.set("plugin[pp_sharpen].strength", _s.strength);
    krpano.set("plugin[pp_sharpen].range", _s.range);
    krpano.set("plugin[pp_blur].range", _s.blurrange);
}

/**切换陀螺仪**/
function switchGyro(obj) {
    krpano.call('copy(plugin[skin_gyro].url, plugin[skin_gyro].plugin_url);switch(plugin[skin_gyro].enabled);');
    let _opacity = $(obj).css('opacity');
    if (_opacity == 1) {
        $(obj).css('opacity', 0.5);
    } else {
        $(obj).css('opacity', 1);
    }
}

/**全屏设置**/
function jsfullScreen() {
    var isFull = !!(document.webkitIsFullScreen || document.mozFullScreen ||
        document.msFullscreenElement || document.fullscreenElement
    );
    if (isFull == false) {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        }
        $('.iconRight .fullscreen img').attr('src', 'skin/img/exitfullscreen.png');
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
        $('.iconRight .fullscreen img').attr('src', 'skin/img/fullscreen.png');
    }
}

/***商品热点弹窗显示***/
function hotspotShop(id) {
    let _clas = "";
    let _area = ['570px', '210px'];
    if (isMobile()) {
        _area = ['90%', '300px'];
        _clas = "mobile-bottom";
    }
    let _shopinfo = JSON.parse(hotspotlistShop[id]);
    let _tplobj = {};
    _tplobj['list'] = [
        {
            "thumb": VRIMGURL + _shopinfo.thumb,
            "name": _shopinfo.name,
            "intro": _shopinfo.intro,
            "price": _shopinfo.price,
            "unit": _shopinfo.unit,
            "link": _shopinfo.link,
            "clas": _clas,
        },
    ];
    layer.open({
        type: 1,
        title: false,
        shadeClose: true,
        area: _area,
        content: template('edit-item-info-hotspot-shop-container-tpl', _tplobj),
    });
}

/**外部分享使用**/
function openKpShare(type) {
    var api;
    if (type == 1) {
        api = 'https://www.facebook.com/sharer/sharer.php?u={url}&t={title}&hashtags=keypano';
    } else {
        api = 'https://twitter.com/intent/tweet?text={content}&url={url}&related=&hashtags=keypano' + document.domain;
    }
    var ourl = api.replace('{url}', location.href).replace('{title}',
        $('#canvasName').val()).replace('{content}', $('#canvasContent').val()).replace('{pic}', $('#canvasThumbUrl').val());
    window.open(ourl, 'newwindow', 'height=600,width=900,top=60,left=40');
}

/**临时储存已经播放过的全景视频的场景id**/
function sceneVideoHotspotTmpHandler(t) {
    sceneVideoHotspotTmp.includes(t) === false ? sceneVideoHotspotTmp.push(t) : '';
}

/**切换场景是否自动播放背景音乐**/
function isSwitchSceneAutoPlaybg(t) {
    if (sceneVideoHotspotTmp.length > 0 && sceneVideoHotspotTmp.includes(t) === false) {
        krpano.call("sound[bgsnd].play()");
    }
}

/**特效 执行特效效果**/
function showSpecialInformation(id) {
    if (specialJson !== "" && specialJson !== undefined) {
        if (specialJson.hasOwnProperty(id)) {
            if (specialJson[id].hasOwnProperty("mode") && specialJson[id].mode == 2) {
                krpano.call("add_single_lensflare('lensflare_" + id + "', '" + specialJson[id].style + "', '" + specialJson[id].ath + "', '" + specialJson[id].atv + "', 'true');")
            } else {
                krpano.call("specialSnow('skin/hotspot/" + specialJson[id].icon + "','" + specialJson[id].imagescale + "','" + specialJson[id].flakes + "','" + specialJson[id].speed + "')");
            }
        }
    }
}

/**开启清屏模式**/
var isClearScreen = false;
var ClearScreenClickTimeout = null;
$('.clearScreen').on('click', function () {
    $('.iconLeftTop').css('display', 'none');
    $('.iconRight').css('display', 'none');
    $('.iconBottomLeft').css('display', 'none');
    $('.iconBottomRight').css('display', 'none');
    $('.itemPreviewContainer').css('display', 'none');
    $('.exitClearScreen').css('display', 'flex');
    isClearScreen = true;
    ClearScreenClickTimeout = setTimeout(function () {
        $('.exitClearScreen').css('display', 'none');
    }, 3000);
});

/**关闭清屏模式**/
$('.exitClearScreen').on('click', function () {
    $('.iconLeftTop').css('display', 'block');
    $('.iconRight').css('display', 'flex');
    $('.iconBottomLeft').css('display', 'flex');
    $('.iconBottomRight').css('display', 'flex');
    $('.itemPreviewContainer').css('display', 'block');
    $('.exitClearScreen').css('display', 'none');
    isClearScreen = false;
    clearTimeout(ClearScreenClickTimeout);
});


const divContainer = document.getElementById('itemPreviewContainer');

/**监听点击事件**/
function ClearScreenHandleClickOrTouch(event) {
    if (isClearScreen) {
        if (!divContainer.contains(event.target)) {
            $('.exitClearScreen').css('display', 'flex');
        }
        clearTimeout(ClearScreenClickTimeout);
        ClearScreenClickTimeout = setTimeout(function () {
            $('.exitClearScreen').css('display', 'none');
        }, 3000);
    }
}

$('.music').on('click', function () {
    krpano.call('togglesound(bgsnd);');
});

document.addEventListener('click', ClearScreenHandleClickOrTouch);
document.addEventListener('touchstart', ClearScreenHandleClickOrTouch);
document.addEventListener('DOMContentLoaded', function () {
    var kr = document.getElementById("krpanoSWFObject");
    kr.addEventListener("onloadcomplete", function () {
        if (kr.get('autorotate.enabled') === false) {
            isAutoRotate = false;
        }
        kr.call('togglesound(bgsnd);');
    });
}, false);

/**监听左右键**/
document.addEventListener("keydown", function (event) {
    if (krpano !== undefined && krpano !== null) {
        let _scene = krpano.get("scene[get(xml.scene)].thumburl");
        if (_scene.indexOf('_flat') > -1) {
            switch (event.keyCode) {
                case 37:
                    krpano.call("prevscene();");
                    break;
                case 39:
                    krpano.call("nextscene()");
                    break;
            }
        }
    }
});

/**视频热点**/
function videohotspotplay(id) {
    let _muted = krpano.get("hotspot[spot" + id + "].muted");
    if (!_muted) {
        krpano.call("sound[bgsnd].pause()");
        hotspotAudioOnPause();
        soundOnPause();
        sceneVideoHotspotTmpHandler(id);
    }
}

/***视频暂停***/
function videohotspotpaused(id) {
    krpano.call("sound[bgsnd].play()");
}

/**开场场景**/
function startsceneonload(gid, id) {
    $('.itemSwiper .swiper-wrapper .swiper-slide').children('.swiper-box').removeClass('active').children('img').hide();
    if (groupMode == 0) {
        loadingItemSceneListHtml(visitItemSceneList[0]);
    } else {
        loadingItemSceneListHtml(visitItemSceneList[gid]);
        $('.itemGroupListContainer .itemGroupList .groupName' + gid).addClass('active').siblings('div').removeClass('active');
    }
    swiper.slideTo($('.itemSwiper .swiper-wrapper .swiper-slide' + id).first().index(), 1000, false);
    $('.itemSwiper .swiper-wrapper .swiper-slide' + id).children('.swiper-box').addClass('active').children('img').show();
    if (sceneListShow == 2) {
        setTimeout(function () {
            $('.itemPreview').css({'z-index': 50});
            $('.itemGroupList').css({'z-index': 50});
            isSwiperLoading = true;
            addScrollAnimationStyle();
        }, 1500);
    }
}

/**场景加载完成调用方法**/
function sceneOnStartLoad(id) {
    showSpecialInformation(id);
    if (effectShow == 1) {
        krpano.call("updateeffect(" + id + ");");
    }
    if (beautify_show == 1) {
        let _jsonbeautify = krpano.get("scene[scene_" + id + "].jsonbeautify");
        showBeautifyInformation(_jsonbeautify);
    }
    showMapDetail(id);
}

/**美化效果加载**/
function showBeautifyInformation(json_string) {
    var _s = JSON.parse(json_string);
    if (_s.brightness == 1 && _s.contrast == 1 && _s.saturate == 1 && _s.hue == 0 && _s.gamma == 1 && _s.temperature == 0 && _s.opacity == 1) {
        krpano.set("plugin[colorfilter].enabled", "false");
    } else {
        krpano.set("plugin[colorfilter].enabled", "true");
        for (const [key, value] of Object.entries(_s)) {
            krpano.set("plugin[colorfilter]." + key, value);
        }
    }
}


/**平面图动态展示**/
function showMapDetail(id) {
    if (mapNewObj !== "" && mapNewObj !== undefined) {
        if (mapNewObj.hasOwnProperty('isShowAll')) {
            if (mapNewObj['isShowAll'] == 1) {
                let _mapid = mapNewObj['mapFirst']['id'];
                mapAddSopt(_mapid);
            } else if (mapNewObj.hasOwnProperty('mapSceneObj')) {
                if (mapNewObj['mapSceneObj'].hasOwnProperty(id)) {
                    let _mapid = mapNewObj['mapSceneObj'][id];
                    /**平面图信息**/
                    if (mapNewObj.hasOwnProperty('mapInfoObj')) {
                        if (mapNewObj['mapInfoObj'].hasOwnProperty(_mapid)) {
                            let _mapInfo = mapNewObj['mapInfoObj'][_mapid];
                            krpano.call('map_update_info(' + _mapInfo['url'] + ',' + _mapInfo['width'] + ',' + _mapInfo['height'] + ');');
                        }
                    }
                    /**平面图标记点信息**/
                    krpano.call("map_remove_mapspots();");
                    mapAddSopt(_mapid);
                } else {
                    krpano.call("map_hide();");
                }
            }
        }
    }
}

/**平面图动态添加标记点**/
function mapAddSopt(_mapid) {
    krpano.call("map_show();");
    if (mapNewObj.hasOwnProperty('mapSpotObj')) {
        if (mapNewObj['mapSpotObj'].hasOwnProperty(_mapid)) {
            let _mapSpot = mapNewObj['mapSpotObj'][_mapid];
            let _currentSceneId = krpano.get('scene[get(xml.scene)].id');
            let _currentSceneHeading = parseFloat(krpano.get('scene[get(xml.scene)].xmlHlookat')) || 0;
            for (let i = 0; i < _mapSpot.length; i++) {
                let _spot = _mapSpot[i];
                let _isactive = 0;
                if (_currentSceneId == _spot.target) {
                    _isactive = 1;
                    if (_spot.radaropen == 2) {
                        _isactive = 2;
                    }
                }
                let _heading = parseFloat(_spot.heading) + parseFloat(_currentSceneHeading);
                let _spotInfo = _spot.target + "," + _spot.x + "," + _spot.y + "," + _isactive + "," + _heading;
                krpano.call('map_add_mapspots(' + _spotInfo + ');');
            }
        }
    }
}
