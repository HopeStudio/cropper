import {ACTION_EAST, ACTION_WEST, ACTION_SOUTH, ACTION_NORTH} from './variables';

export function rectPhone() {
    let _this = this;

    let $client = this.dom.$client,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1;

    let cw = $client.width(),
        ch = $client.height(),
        cX = $client.offset().left,
        cY = $client.offset().top,
        ele0top = $ele0.offset().top,
        ele0left = $ele0.offset().left,
        curOn;

    let _boundTouchMove = function (e) {
        e.preventDefault();
        if (e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft >= 0 &&
            e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft <= _this.cache.width &&
            e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop >= 0 &&
            e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop <= _this.cache.height) {
            if (curOn === ACTION_NORTH) {
                $client.css({
                    top   : e.originalEvent.targetTouches[0].clientY - _this.cache.wrapTop,
                    height: ch - (e.originalEvent.targetTouches[0].clientY - cY) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_SOUTH) {
                $client.css({
                    height: e.originalEvent.targetTouches[0].clientY - cY
                });
            } else if (curOn === ACTION_WEST) {
                $client.css({
                    left : e.originalEvent.targetTouches[0].clientX - _this.cache.wrapLeft,
                    width: cw - (e.originalEvent.targetTouches[0].clientX - cX) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_EAST) {
                $client.css({
                    width: e.originalEvent.targetTouches[0].clientX - cX
                });
            }
            // 上层图片跟随运动
            $ele1.css({
                top : ele0top - $client.position().top - _this.options.cropper.antWidth,
                left: ele0left - $client.position().left - _this.options.cropper.antWidth
            });
        }
        return false;
    };

    _this.dom.$wrap.on('touchstart', '.cropper-box-client-bar', function (e) {
        curOn = /cropper-box-client-(.)\s/.exec($(e.target)[0].className)[1];
        if (`${ACTION_EAST}${ACTION_WEST}${ACTION_SOUTH}${ACTION_NORTH}`.indexOf(curOn) + 1) {
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
export function rectPC() {
    let _this = this;

    let $client = this.dom.$client,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1;

    let cw = $client.width(),
        ch = $client.height(),
        cX = $client.offset().left,
        cY = $client.offset().top,
        ele0top = $ele0.offset().top,
        ele0left = $ele0.offset().left,
        curOn;

    let _boundMove = function (e) {
        e.preventDefault();

        if (e.clientX - _this.cache.wrapLeft >= 0 &&
            e.clientX - _this.cache.wrapLeft <= _this.cache.width &&
            e.clientY - _this.cache.wrapTop >= 0 &&
            e.clientY - _this.cache.wrapTop <= _this.cache.height) {
            if (curOn === ACTION_NORTH) {
                $client.css({
                    top   : e.clientY - _this.cache.wrapTop,
                    height: ch - (e.clientY - cY) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_SOUTH) {
                $client.css({
                    height: e.clientY - cY
                });
            } else if (curOn === ACTION_WEST) {
                $client.css({
                    left : e.clientX - _this.cache.wrapLeft,
                    width: cw - (e.clientX - cX) + _this.options.cropper.antWidth * 2
                });
            } else if (curOn === ACTION_EAST) {
                $client.css({
                    width: e.clientX - cX
                });
            }
            $ele1.css({
                top : ele0top - $client.position().top - _this.options.cropper.antWidth,
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
