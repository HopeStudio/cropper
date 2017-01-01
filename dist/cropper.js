/*!
 * cropper v0.0.1
 * Sun Jan 01 2017 16:30:40 GMT+0800 (CST) yangfch3
 * Released under the MIT License.
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery);
    }
}(function ($) {
'use strict';

var REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
var IS_PHONE = /android|iphone/i;
var ISIMAGEBASE64 = /(data:image\/(?:png|jpeg|gif);base64,)/i;

// 两个图片 DOM 的 ID
var CROPPER_IMAGE_ID = 'cropperImage';
var CROPPER_BOX_CLIENT_TARGET_IMAGE_ID = 'cropperBoxClientTargetImage';

var ACTION_EAST = 'e';
var ACTION_WEST = 'w';
var ACTION_SOUTH = 's';
var ACTION_NORTH = 'n';

var JPEG = 'image/jpeg';
var DEFAULT_OUTPUT_TYPE = 'file';
var RANGE_POS_TOP = 'top';
var RANGE_POS_BOTTOM = 'bottom';

var MASK_BGCOLOR = 'rgba(0,0,0,0.65)';
var WRAP_BGCOLOR = '#ccc';

var UA = navigator.userAgent;
var IS_SAFARI_OR_UIWEBVIEW = navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);

var DEFAULTS = {
    // 默认输出为 file，可选 'data'，输出图片元素和坐标数据
    outputType: DEFAULT_OUTPUT_TYPE,
    range: {
        min: 1,
        max: 5,
        step: 0.05,
        init: 1,
        pos: RANGE_POS_BOTTOM
    },
    cropper: {
        minSpace: 30,
        fixed: false,
        antWidth: 2
    },
    canvas: {
        type: JPEG,
        quality: 0.7
    }
};

function getImageSize(image, callback) {
    var newImage = void 0;

    if (image.naturalWidth && !IS_SAFARI_OR_UIWEBVIEW) {
        return callback(image.naturalWidth, image.naturalHeight);
    }

    // IE8: Don't use `new Image()` here (#319)
    newImage = document.createElement('img');

    newImage.onload = function () {
        callback(this.width, this.height);
    };

    newImage.src = image.src;
}

function hyphenate(str) {
    if (typeof str !== 'string') {
        return false;
    }
    str = str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
    return str;
}

function isOkImg(element) {
    if (!element) {
        return false;
    }
    if (element.nodeName && element.nodeName.toLowerCase() === 'img' && element.src) {
        return true;
    }
    return false;
}

function base64ToArrayBuffer(base64) {
    if (ISIMAGEBASE64.test(base64)) {
        base64 = base64.replace(RegExp.$1, '');
    } else {
        return;
    }
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
}

var TEMPLATE = "\n<div class=\"cropper-mask\" id=\"cropperMask\">\n    <div class=\"cropper-box\" id=\"cropperBox\">\n        <!-- \u56FE\u7247 -->\n\n        <!-- cropper-box-mask \u7528\u4E8E\u5B9E\u73B0\u9634\u5F71\u906E\u7F69 -->\n        <div class=\"cropper-box-mask\" id=\"cropperBoxMask\"></div>\n        <div class=\"cropper-box-client\" id=\"cropperBoxClient\">\n            <div class=\"cropper-box-client-target\" id=\"cropperBoxClientTarget\">\n                <!-- \u56FE\u7247 -->\n            </div>\n            <div class=\"cropper-box-client-n cropper-box-client-bar\"></div>\n            <div class=\"cropper-box-client-s cropper-box-client-bar\"></div>\n            <div class=\"cropper-box-client-w cropper-box-client-bar\"></div>\n            <div class=\"cropper-box-client-e cropper-box-client-bar\"></div>\n        </div>\n    </div>\n    <input type=\"button\" value=\"\u786E\u8BA4\u88C1\u526A\" class=\"cropper-ensure\" id=\"cropperEnsure\">\n    <div class=\"cropper-range\" id=\"cropperRange\">\n        <input type=\"range\" min=\"1\" max=\"5\" step=\"0.05\" value=\"1\">\n    </div>\n</div>\n";

var STYLE = "\nbody, html {\n    padding: 0;\n    margin: 0;\n}\n.cropper-box-mask {\n    width: 100%;\n    height: 100%;\n    opacity: .4;\n    background-color: black;\n}\n.cropper-box-client {\n    overflow: hidden;\n    position: absolute;\n    top: 0;\n    left: 0;\n    box-sizing: border-box;\n    border: 2px dashed red;\n    background-color: transparent;\n}\n.cropper-box-client-target {\n    width: 100%;\n    height: 100%;\n    overflow: hidden;\n}\n.cropper-box-client-n {\n    position: absolute;\n    height: 48px;\n    width: 100%;\n    cursor: ns-resize;\n    top: -24px;\n    left: 0;\n}\n.cropper-box-client-s {\n    position: absolute;\n    width: 100%;\n    height: 48px;\n    cursor: ns-resize;\n    bottom: -24px;\n    left: 0;\n}\n.cropper-box-client-w {\n    position: absolute;\n    height: 100%;\n    width: 48px;\n    cursor: ew-resize;\n    left: -24px;\n    top: 0;\n}\n.cropper-box-client-e {\n    position: absolute;\n    width: 48px;\n    height: 100%;\n    cursor: ew-resize;\n    right: -24px;\n    top: 0;\n}\n.cropper-range input {\n    display: inline-block;\n}\n";

function render(width, height) {
    var $mask = this.dom.$mask = $(TEMPLATE),
        $wrap = this.dom.$wrap = $mask.find('#cropperBox'),
        $client = this.dom.$client = $mask.find('#cropperBoxClient'),
        $target = this.dom.$target = $mask.find('#cropperBoxClientTarget'),
        $range = this.dom.$range = $mask.find('#cropperRange input'),
        $btn = this.dom.$btn = $mask.find('#cropperEnsure'),
        $ele0 = this.dom.$ele0 = $('<img/>').attr({
        class: hyphenate(CROPPER_IMAGE_ID),
        id: CROPPER_IMAGE_ID,
        src: this.$element.attr('src')
    }).prependTo($wrap),
        $ele1 = this.dom.$ele1 = $('<img/>').attr({
        class: hyphenate(CROPPER_BOX_CLIENT_TARGET_IMAGE_ID),
        id: CROPPER_BOX_CLIENT_TARGET_IMAGE_ID,
        src: this.$element.attr('src')
    }).prependTo($target);

    var space = this.options.cropper.minSpace,
        value = this.cache.value = $range.val(),
        $window = $(window);

    var computedWidth = void 0,
        computedHeight = void 0;
    if (width < $(window).width() - 2 * space && height < $(window).height() - 4 * space) {
        computedWidth = this.cache.width = width;
        computedHeight = this.cache.height = height;

        this.cache.ratio = 1;
    } else {
        if (width / height <= $(window).width() / $(window).height()) {
            // 图片过高
            computedHeight = this.cache.height = $(window).height() - space * 4;
            computedWidth = this.cache.width = computedHeight * width / height;
        } else {
            // 图片过宽
            computedWidth = this.cache.width = $(window).width() - space * 2;
            computedHeight = this.cache.height = computedWidth * height / width;
        }
        this.cache.ratio = computedWidth / width;
    }

    $mask.css({
        width: $window.width(),
        height: $window.height(),
        backgroundColor: MASK_BGCOLOR,
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10000
    });

    $wrap.css({
        width: computedWidth,
        height: computedHeight,
        position: 'absolute',
        left: ($mask.width() - computedWidth) / 2,
        top: ($mask.height() - computedHeight) / 4,
        overflow: 'hidden',
        backgroundColor: WRAP_BGCOLOR
    });

    $ele0.css({
        width: computedWidth * value,
        position: 'absolute',
        top: 0,
        left: 0
    });

    // 注意插入的时机
    $mask.prependTo('body');

    $btn.css({
        top: $wrap.height() + $wrap.position().top + 10,
        left: $mask.width() / 2,
        marginLeft: -$btn.width() / 2,
        position: 'absolute'
    });

    this.cache.wrapTop = $wrap.position().top;
    this.cache.wrapLeft = $wrap.position().left;

    // 增加 input[type=range] 元素
    if (this.options.range.pos === RANGE_POS_TOP) {
        $range.parent().css({
            top: this.cache.wrapTop - space,
            left: $mask.width() / 2,
            marginLeft: -$range.width() / 2,
            position: 'absolute'
        });
    } else {
        $range.parent().css({
            top: computedHeight + this.cache.wrapTop + space,
            left: $mask.width() / 2,
            marginLeft: -$range.width() / 2,
            position: 'absolute'
        });
    }

    $client.css({
        width: computedWidth,
        height: computedHeight,
        top: 0,
        left: 0
    });

    $ele1.css({
        position: 'absolute',
        width: computedWidth * value,
        height: computedHeight * value,
        top: -this.options.cropper.antWidth,
        left: -this.options.cropper.antWidth
    });

    if (!$('style#cropperStyleSheet')[0]) {
        $('<style/>').html(STYLE).attr({
            id: 'cropperStyleSheet'
        }).appendTo('head');
    }
}

function rectPhone() {
    var _this = this;

    var $client = this.dom.$client,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1;

    var cw = $client.width(),
        ch = $client.height(),
        cX = $client.offset().left,
        cY = $client.offset().top,
        ele0top = $ele0.offset().top,
        ele0left = $ele0.offset().left,
        curOn = void 0;

    var _boundTouchMove = function _boundTouchMove(e) {
        e.preventDefault();
        if (e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft >= 0 && e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft <= _this.cache.width && e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop >= 0 && e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop <= _this.cache.height) {
            if (curOn === ACTION_NORTH) {
                $client.css({
                    top: e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop,
                    height: ch - (e.originalEvent.targetTouches[0].clientY - cY) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_SOUTH) {
                $client.css({
                    height: e.originalEvent.targetTouches[0].clientY - cY
                });
            } else if (curOn === ACTION_WEST) {
                $client.css({
                    left: e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft,
                    width: cw - (e.originalEvent.targetTouches[0].clientX - cX) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_EAST) {
                $client.css({
                    width: e.originalEvent.targetTouches[0].clientX - cX
                });
            }
            // 上层图片跟随运动
            $ele1.css({
                top: ele0top - $client.position().top - _this.options.cropper.antWidth,
                left: ele0left - $client.position().left - _this.options.cropper.antWidth
            });
        }
        return false;
    };

    _this.dom.$wrap.on('touchstart', '.cropper-box-client-bar', function (e) {
        curOn = /cropper-box-client-(.)\s/.exec($(e.target)[0].className)[1];
        if (('' + ACTION_EAST + ACTION_WEST + ACTION_SOUTH + ACTION_NORTH).indexOf(curOn) + 1) {
            e.preventDefault();
            ele0top = $ele0.position().top;
            ele0left = $ele0.position().left;
            _this.dom.$wrap.on('touchmove', _boundTouchMove);
        } else {
            return false;
        }
        $(document).one('touchend', function () {
            _this.dom.$wrap.off('touchmove', _boundTouchMove);
            cw = $client.width();
            ch = $client.height();
            cX = $client.offset().left;
            cY = $client.offset().top;
        });
    });
}
function rectPC() {
    var _this = this;

    var $client = this.dom.$client,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1;

    var cw = $client.width(),
        ch = $client.height(),
        cX = $client.offset().left,
        cY = $client.offset().top,
        ele0top = $ele0.offset().top,
        ele0left = $ele0.offset().left,
        curOn = void 0;

    var _boundMove = function _boundMove(e) {
        e.preventDefault();

        if (e.clientX - _this.cache.wrapLeft >= 0 && e.clientX - _this.cache.wrapLeft <= _this.cache.width && e.clientY - _this.cache.wrapTop >= 0 && e.clientY - _this.cache.wrapTop <= _this.cache.height) {
            if (curOn === ACTION_NORTH) {
                $client.css({
                    top: e.clientY - _this.cache.wrapTop,
                    height: ch - (e.clientY - cY) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_SOUTH) {
                $client.css({
                    height: e.clientY - cY
                });
            } else if (curOn === ACTION_WEST) {
                $client.css({
                    left: e.clientX - _this.cache.wrapLeft,
                    width: cw - (e.clientX - cX) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_EAST) {
                $client.css({
                    width: e.clientX - cX
                });
            }
            $ele1.css({
                top: ele0top - $client.position().top - _this.options.cropper.antWidth,
                left: ele0left - $client.position().left - _this.options.cropper.antWidth
            });
        }
        return false;
    };
    _this.dom.$wrap.on('mousedown', '.cropper-box-client-bar', function (e) {
        curOn = /cropper-box-client-(.)\s/.exec($(e.target)[0].className)[1];
        if ('nswe'.indexOf(curOn) + 1) {
            e.preventDefault();
            ele0top = $ele0.position().top;
            ele0left = $ele0.position().left;
            _this.dom.$wrap.on('mousemove', _boundMove);
        } else {
            return false;
        }
        $(document).one('mouseup', function () {
            _this.dom.$wrap.off('mousemove', _boundMove);
            cw = $client.width();
            ch = $client.height();
            cX = $client.offset().left;
            cY = $client.offset().top;
        });
    });
}

function zoomPC() {
    var _this = this;

    var $range = _this.dom.$range,
        $ele0 = _this.dom.$ele0,
        $ele1 = _this.dom.$ele1,
        width = _this.cache.width,
        height = _this.cache.height,
        value = _this.cache.value;

    var ele0top = void 0,
        ele0left = void 0,
        ele1top = void 0,
        ele1left = void 0,
        originalValue = void 0;

    function zoom(e) {
        $range.trigger('change');
    }

    $range.on('change', function (e) {
        if (value === $range.val()) {
            return false;
        }
        _this.cache.value = value = $range.val();
        $ele0.css({
            width: width * value,
            height: height * value,
            top: ele0top - width * (value - originalValue) / 2,
            left: ele0left - height * (value - originalValue) / 2
        });
        $ele1.css({
            width: width * value,
            height: height * value,
            top: ele1top - width * (value - originalValue) / 2,
            left: ele1left - height * (value - originalValue) / 2
        });
    });
    $range.on('mousedown', function (e) {
        ele0top = $ele0.position().top;
        ele0left = $ele0.position().left;
        ele1top = $ele1.position().top;
        ele1left = $ele1.position().left;
        originalValue = value;
        $range.on('mousemove', zoom);
    });
    $range.on('mouseup', function (e) {
        $range.off('mousemove', zoom);
    });
}

function zoomPhone() {
    var _this = this;

    var $range = _this.dom.$range,
        $ele0 = _this.dom.$ele0,
        $ele1 = _this.dom.$ele1,
        width = _this.cache.width,
        height = _this.cache.height,
        value = _this.cache.value;

    var ele0top = void 0,
        ele0left = void 0,
        ele1top = void 0,
        ele1left = void 0,
        originalValue = void 0;

    function zoom(e) {
        $range.trigger('change');
    }

    $range.on('change', function (e) {
        if (value === $range.val()) {
            return false;
        }
        _this.cache.value = value = $range.val();
        $ele0.css({
            width: width * value,
            height: height * value,
            top: ele0top - width * (value - originalValue) / 2,
            left: ele0left - height * (value - originalValue) / 2
        });
        $ele1.css({
            width: width * value,
            height: height * value,
            top: ele1top - width * (value - originalValue) / 2,
            left: ele1left - height * (value - originalValue) / 2
        });
    });
    $range.on('touchstart', function (e) {
        ele0top = $ele0.position().top;
        ele0left = $ele0.position().left;
        ele1top = $ele1.position().top;
        ele1left = $ele1.position().left;
        originalValue = value;
        $range.on('touchmove', zoom);
    });
    $range.on('touchend', function (e) {
        $range.off('touchmove', zoom);
    });
}

function dragPhone() {
    var _this = this;

    var $wrap = this.dom.$wrap,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1,
        curOn = void 0;

    var originX = void 0,
        originY = void 0,
        ele0top = $ele0.position().top,
        ele0left = $ele0.position().left,
        ele1top = $ele1.position().top,
        ele1left = $ele1.position().left;

    function touchDrag(e) {
        e.preventDefault();
        $ele0.css({
            top: ele0top + e.originalEvent.targetTouches[0].clientY - originY,
            left: ele0left + e.originalEvent.targetTouches[0].clientX - originX
        });
        $ele1.css({
            top: ele1top + e.originalEvent.targetTouches[0].clientY - originY,
            left: ele1left + e.originalEvent.targetTouches[0].clientX - originX
        });
    }

    $wrap.on('touchstart', function (e) {
        curOn = $(e.target)[0].className;
        originX = e.originalEvent.targetTouches[0].clientX;
        originY = e.originalEvent.targetTouches[0].clientY;
        ele0top = $ele0.position().top;
        ele0left = $ele0.position().left;
        ele1top = $ele1.position().top;
        ele1left = $ele1.position().left;
        e.preventDefault();
        if (curOn.indexOf('cropper-box-client-bar') + 1 === 0 && !_this.options.cropper.fixed) {
            $wrap.on('touchmove', touchDrag);
            $(document).one('touchend', function () {
                $wrap.off('touchmove', touchDrag());
                ele0top = $ele0.position().top;
                ele0left = $ele0.position().left;
                ele1top = $ele1.position().top;
                ele1left = $ele1.position().left;
            });
        }
    });
}

function dragPC() {
    var _this = this;

    var $wrap = this.dom.$wrap,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1,
        curOn = void 0;

    var originX = void 0,
        originY = void 0,
        ele0top = $ele0.position().top,
        ele0left = $ele0.position().left,
        ele1top = $ele1.position().top,
        ele1left = $ele1.position().left;

    function mouseDrag(e) {
        e.preventDefault();
        $ele0.css({
            top: ele0top + e.clientY - originY,
            left: ele0left + e.clientX - originX
        });
        $ele1.css({
            top: ele1top + e.clientY - originY,
            left: ele1left + e.clientX - originX
        });
    }

    $wrap.on('mousedown', function (e) {
        curOn = $(e.target)[0].className;
        originX = e.clientX;
        originY = e.clientY;
        ele0top = $ele0.position().top;
        ele0left = $ele0.position().left;
        ele1top = $ele1.position().top;
        ele1left = $ele1.position().left;
        e.preventDefault();
        if (curOn.indexOf('cropper-box-client-bar') + 1 === 0 && !_this.options.cropper.fixed) {
            $wrap.on('mousemove', mouseDrag);
            $(document).one('mouseup', function () {
                $wrap.off('mousemove', mouseDrag);
                ele0top = $ele0.position().top;
                ele0left = $ele0.position().left;
                ele1top = $ele1.position().top;
                ele1left = $ele1.position().left;
            });
        }
    });
}

var fn = {
    init: function init() {
        var $element = $(this.$element),
            _this = this;
        if (!isOkImg($element[0])) {
            return false;
        }
        getImageSize($element[0], function (width, height) {
            _this.render(width, height);
            if (IS_PHONE.test(UA)) {
                _this.rectPhone();
                _this.zoomPhone();
                _this.dragPhone();
            } else {
                _this.rectPC();
                _this.zoomPC();
                _this.dragPC();
            }
            _this.bindEnsure();
        });
    },
    render: render,
    rectPC: rectPC,
    rectPhone: rectPhone,
    zoomPC: zoomPC,
    zoomPhone: zoomPhone,
    dragPC: dragPC,
    dragPhone: dragPhone,
    count: function count() {
        var _this = this;

        var $client = _this.dom.$client,
            $ele0 = _this.dom.$ele0;

        var x = void 0,
            y = void 0,
            w = void 0,
            h = void 0;

        w = (_this.data.w = $client.width() + 2 * _this.options.cropper.antWidth) / (_this.cache.ratio * _this.cache.value);
        h = (_this.data.h = $client.height() + 2 * _this.options.cropper.antWidth) / (_this.cache.ratio * _this.cache.value);
        x = ($client.offset().left - $ele0.offset().left) / (_this.cache.ratio * _this.cache.value);
        y = ($client.offset().top - $ele0.offset().top) / (_this.cache.ratio * _this.cache.value);

        _this.data.x = x;
        _this.data.y = y;
        _this.data.w = w;
        _this.data.h = h;
    },
    bindEnsure: function bindEnsure() {
        var _this = this;

        var $mask = _this.dom.$mask,
            $btn = _this.dom.$btn;

        $btn.on('click', function () {
            _this.count();
            $mask.remove();
            if ($.isFunction(_this.callback)) {
                if (_this.options.outputType !== DEFAULT_OUTPUT_TYPE) {
                    _this.callback($.extend({ ele: _this.$element }, _this.data));
                } else {
                    _this.callback(_this.canvasCropper());
                }
            }
        });
    },
    canvasCropper: function canvasCropper() {
        var _this = this;

        var x = _this.data.x,
            y = _this.data.y,
            w = _this.data.w,
            h = _this.data.h;

        var newImg = _this.$element.clone().removeAttr('id').removeAttr('class').removeAttr('style')[0],
            canvas = $('<canvas width="' + w + '" height="' + h + '"></canvas>')[0],
            ctx = canvas.getContext('2d'),
            dataURL = void 0,
            buffer = void 0,
            file = void 0;

        ctx.drawImage(newImg, x, y, w, h, 0, 0, w, h);
        if (_this.options.canvas.type.toLowerCase() === JPEG) {
            dataURL = canvas.toDataURL(_this.options.canvas.type.toLowerCase(), _this.options.canvas.quality);
        } else {
            dataURL = canvas.toDataURL(_this.options.canvas.type.toLowerCase());
        }
        buffer = base64ToArrayBuffer(dataURL);
        file = new File([buffer], 'img$'.concat(Math.random().toString().slice(2)), { type: _this.options.canvas.type.toLowerCase() });

        return file;
    }
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var Cropper = function Cropper(element, options, callback) {
    classCallCheck(this, Cropper);

    this.$element = $(element);
    this.options = $.extend({}, Cropper.DEFAULTS, $.isPlainObject(options) && options);
    // 跨函数传输数据
    this.cache = {};
    // 相关 DOM 存储
    this.dom = {};
    this.data = {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    };
    this.callback = callback;
};

Cropper.DEFAULTS = DEFAULTS;
Cropper.prototype = fn;
fn.constructor = Cropper;

$.fn.cropper = function (options, callback) {
    var $this = $(this);
    var cropper = new Cropper($this, options, callback);
    cropper.init();
};

Cropper.other = $.fn.cropper;

$.fn.cropper.Constructor = Cropper;
$.fn.cropper.noConflict = function () {
    $.fn.cropper = Cropper.other;
    return this;
};

}));
