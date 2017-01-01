import {Cropper} from './cropper';

$.fn.cropper = function (options, callback) {
    let $this = $(this);
    let cropper = new Cropper($this, options, callback);
    cropper._init();
    return cropper;
};

$.fn.cropper.Constructor = Cropper;

Cropper.other = $.fn.cropper;
$.fn.cropper.noConflict = function () {
    $.fn.cropper = Cropper.other;
    return this;
};

Cropper.setDefaults = function (options) {
    $.extend(true, Cropper.DEFAULTS, options);
};
$.fn.cropper.setDefaults = Cropper.setDefaults;
