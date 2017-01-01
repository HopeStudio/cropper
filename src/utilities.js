import {IS_SAFARI_OR_UIWEBVIEW, REGEXP_HYPHENATE, ISIMAGEBASE64} from './variables';

export function getImageSize(image, callback) {
    let newImage;

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

export function hyphenate(str) {
    if (typeof str !== 'string') {
        return false;
    }
    str = str.replace(REGEXP_HYPHENATE, '$1-$2').toLowerCase();
    return str;
}

export function isOkImg(element) {
    if (!element) {
        return false;
    }
    if (element.nodeName && element.nodeName.toLowerCase() === 'img' && element.src) {
        return true;
    }
    return false;
}

export function base64ToArrayBuffer(base64) {
    if (ISIMAGEBASE64.test(base64)) {
        base64 = base64.replace(RegExp.$1, '');
    } else {
        return;
    }
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }

    return bytes.buffer;
}
