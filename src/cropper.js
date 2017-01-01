import {DEFAULTS} from './defaults';
import {fn} from './fn';

export class Cropper {
    constructor(element, options, callback) {
        this.$element = $(element);
        this.options = $.extend(true, {}, Cropper.DEFAULTS, $.isPlainObject(options) && options);
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
    }
}

Cropper.DEFAULTS = DEFAULTS;
Cropper.prototype = fn;
fn.constructor = Cropper;
