import {Cropper} from './cropper';

$.fn.cropper = function (options, callback) {
    let $this = $(this);
    let cropper = new Cropper($this, options, callback);
    cropper.init();
};

Cropper.other = $.fn.cropper;

$.fn.cropper.Constructor = Cropper;
$.fn.cropper.noConflict = function () {
    $.fn.cropper = Cropper.other;
    return this;
};
