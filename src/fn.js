import {isOkImg, getImageSize, base64ToArrayBuffer} from './utilities';
import {UA, IS_PHONE, JPEG, DEFAULT_OUTPUT_TYPE} from './variables';
import {render} from './render';
import * as rect from './rect';
import * as zoom from './zoom';
import * as drag from './drag';

export const fn = {
    init         : function () {
        let $element = $(this.$element),
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
    render       : render,
    rectPC       : rect.rectPC,
    rectPhone    : rect.rectPhone,
    zoomPC       : zoom.zoomPC,
    zoomPhone    : zoom.zoomPhone,
    dragPC       : drag.dragPC,
    dragPhone    : drag.dragPhone,
    count        : function () {
        let _this = this;

        let $client = _this.dom.$client,
            $ele0 = _this.dom.$ele0;

        let x,
            y,
            w,
            h;

        w = (_this.data.w = $client.width() + 2 * _this.options.cropper.antWidth) / (_this.cache.ratio * _this.cache.value);
        h = (_this.data.h = $client.height() + 2 * _this.options.cropper.antWidth) / (_this.cache.ratio * _this.cache.value);
        x = ($client.offset().left - $ele0.offset().left) / (_this.cache.ratio * _this.cache.value);
        y = ($client.offset().top - $ele0.offset().top) / (_this.cache.ratio * _this.cache.value);

        _this.data.x = x;
        _this.data.y = y;
        _this.data.w = w;
        _this.data.h = h;

    },
    bindEnsure   : function () {
        let _this = this;

        let $mask = _this.dom.$mask,
            $btn = _this.dom.$btn;

        $btn.on('click', function () {
            _this.count();
            $mask.remove();
            if ($.isFunction(_this.callback)) {
                if (_this.options.outputType !== DEFAULT_OUTPUT_TYPE) {
                    _this.callback($.extend({ele: _this.$element}, _this.data));
                } else {
                    _this.callback(_this.canvasCropper());
                }
            }
        });
    },
    canvasCropper: function () {
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
    }
};
