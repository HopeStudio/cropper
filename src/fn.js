import {isOkImg, getImageSize, base64ToArrayBuffer} from './utilities';
import {UA, IS_PHONE, JPEG, DEFAULT_OUTPUT_TYPE} from './variables';
import {render} from './render';
import * as rect from './rect';
import * as zoom from './zoom';
import * as drag from './drag';

export const fn = {
    _init         : function () {
        let $element = $(this.$element),
            _this = this;
        if (!isOkImg($element[0])) {
            return false;
        }
        getImageSize($element[0], function (width, height) {
            _this._render(width, height);
            if (IS_PHONE.test(UA)) {
                _this._rectPhone();
                _this._zoomPhone();
                _this._dragPhone();
            } else {
                _this._rectPC();
                _this._zoomPC();
                _this._dragPC();
            }
            _this._bindEnsure();
        });
    },
    _render       : render,
    _rectPC       : rect.rectPC,
    _rectPhone    : rect.rectPhone,
    _zoomPC       : zoom.zoomPC,
    _zoomPhone    : zoom.zoomPhone,
    _dragPC       : drag.dragPC,
    _dragPhone    : drag.dragPhone,
    _count        : function () {
        let _this = this;

        let $client = _this.dom.$client,
            $ele0 = _this.dom.$ele0;

        let x,
            y,
            w,
            h;

        w = _this.data.w = $client.outerWidth() / (_this.cache.ratio * _this.cache.value);
        h = _this.data.h = $client.outerHeight() / (_this.cache.ratio * _this.cache.value);
        x = ($client.offset().left - $ele0.offset().left) / (_this.cache.ratio * _this.cache.value);
        y = ($client.offset().top - $ele0.offset().top) / (_this.cache.ratio * _this.cache.value);

        _this.data.x = x;
        _this.data.y = y;
        _this.data.w = w;
        _this.data.h = h;

    },
    _bindEnsure   : function () {
        let _this = this;

        let $mask = _this.dom.$mask,
            $btn = _this.dom.$btn;

        $btn.on('click', function () {
            _this._count();
            $mask.remove();
            if ($.isFunction(_this.callback)) {
                if (_this.options.outputType !== DEFAULT_OUTPUT_TYPE) {
                    _this.callback($.extend({ele: _this.$element}, _this.data));
                } else {
                    _this.callback(_this._canvasCropper());
                }
            }
        });
    },
    _canvasCropper: function () {
        let _this = this;

        let x = _this.data.x,
            y = _this.data.y,
            w = _this.data.w,
            h = _this.data.h;

        let newImg = _this.$element.clone().removeAttr('id').removeAttr('class').removeAttr('style')[0],
            canvas = $('<canvas width="' + w + '" height="' + h + '"></canvas>')[0],
            ctx = canvas.getContext('2d'),
            dataURL,
            buffer,
            file;

        ctx.drawImage(newImg, x, y, w, h, 0, 0, w, h);
        if (_this.options.canvas.type.toLowerCase() === JPEG) {
            dataURL = canvas.toDataURL(_this.options.canvas.type.toLowerCase(), _this.options.canvas.quality);
        } else {
            dataURL = canvas.toDataURL(_this.options.canvas.type.toLowerCase());
        }
        buffer = base64ToArrayBuffer(dataURL);
        file = new File([buffer], 'img$'.concat(Math.random().toString().slice(2)), {type: _this.options.canvas.type.toLowerCase()});

        return file;
    },
    resetPos: function () {
        let _this = this;

        let $ele0 = _this.dom.$ele0,
            $ele1 = _this.dom.$ele1,
            $range = _this.dom.$range,
            $client = _this.dom.$client;

        $range.val(1).trigger('change');

        $ele0.css({
            top: 0,
            left: 0
        });

        $ele1.css({
            top: -_this.options.cropper.antWidth,
            left: -_this.options.cropper.antWidth
        });

        $client.css({
            width: _this.cache.width,
            height: _this.cache.height,
            top: 0,
            left: 0
        });
    },
    setOptions: function (obj) {
        let _this = this;
        $.extend(true, _this.options, $.isPlainObject(obj) && obj);
    },
    fixImg: function () {
        let _this = this;
        _this.setOptions({
            cropper: {
                fixed: true
            }
        });
    }
};
