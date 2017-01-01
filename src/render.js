import {hyphenate} from './utilities';
import {TEMPLATE} from './template';
import {STYLE} from './style';
import {
    CROPPER_IMAGE_ID,
    CROPPER_BOX_CLIENT_TARGET_IMAGE_ID,
    MASK_BGCOLOR,
    WRAP_BGCOLOR,
    RANGE_POS_TOP
} from './variables';

export function render(width, height) {
    let $mask = this.dom.$mask = $(TEMPLATE),
        $wrap = this.dom.$wrap = $mask.find('#cropperBox'),
        $client = this.dom.$client = $mask.find('#cropperBoxClient'),
        $target = this.dom.$target = $mask.find('#cropperBoxClientTarget'),
        $range = this.dom.$range = $mask.find('#cropperRange input'),
        $btn = this.dom.$btn = $mask.find('#cropperEnsure'),
        $ele0 = this.dom.$ele0 = $('<img/>').attr({
            class: hyphenate(CROPPER_IMAGE_ID),
            id   : CROPPER_IMAGE_ID,
            src  : this.$element.attr('src')
        }).prependTo($wrap),
        $ele1 = this.dom.$ele1 = $('<img/>').attr({
            class: hyphenate(CROPPER_BOX_CLIENT_TARGET_IMAGE_ID),
            id   : CROPPER_BOX_CLIENT_TARGET_IMAGE_ID,
            src  : this.$element.attr('src')
        }).prependTo($target);

    let space = this.options.cropper.minSpace,
        value = this.cache.value = $range.val(),
        $window = $(window);

    let computedWidth, computedHeight;
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
        width          : $window.width(),
        height         : $window.height(),
        backgroundColor: MASK_BGCOLOR,
        position       : 'fixed',
        top            : 0,
        left           : 0,
        zIndex         : 10000
    });

    $wrap.css({
        width          : computedWidth,
        height         : computedHeight,
        position       : 'absolute',
        left           : ($mask.width() - computedWidth) / 2,
        top            : ($mask.height() - computedHeight) / 4,
        overflow       : 'hidden',
        backgroundColor: WRAP_BGCOLOR
    });

    $ele0.css({
        width   : computedWidth * value,
        position: 'absolute',
        top     : 0,
        left    : 0
    });

    // 注意插入的时机
    $mask.prependTo('body');

    $btn.css({
        top       : $wrap.height() + $wrap.position().top + 10,
        left      : $mask.width() / 2,
        marginLeft: -$btn.width() / 2,
        position  : 'absolute'
    });

    this.cache.wrapTop = $wrap.position().top;
    this.cache.wrapLeft = $wrap.position().left;

    // 增加 input[type=range] 元素
    if (this.options.range.pos === RANGE_POS_TOP) {
        $range.parent().css({
            top       : this.cache.wrapTop - space,
            left      : $mask.width() / 2,
            marginLeft: -$range.width() / 2,
            position  : 'absolute'
        });
    } else {
        $range.parent().css({
            top       : computedHeight + this.cache.wrapTop + space,
            left      : $mask.width() / 2,
            marginLeft: -$range.width() / 2,
            position  : 'absolute'
        });
    }

    $client.css({
        width : computedWidth,
        height: computedHeight,
        top   : 0,
        left  : 0
    });

    $ele1.css({
        position: 'absolute',
        width   : computedWidth * value,
        height  : computedHeight * value,
        top     : -this.options.cropper.antWidth,
        left    : -this.options.cropper.antWidth
    });

    if (!$('style#cropperStyleSheet')[0]) {
        $('<style/>').html(STYLE).attr({
            id: 'cropperStyleSheet'
        }).appendTo('head');
    }
}
