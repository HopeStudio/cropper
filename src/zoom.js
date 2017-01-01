export function zoomPC() {
    let _this = this;

    let $range = _this.dom.$range,
        $ele0 = _this.dom.$ele0,
        $ele1 = _this.dom.$ele1,
        width = _this.cache.width,
        height = _this.cache.height,
        value = _this.cache.value;

    let ele0top,
        ele0left,
        ele1top,
        ele1left,
        originalValue;

    function zoom(e) {
        $range.trigger('change');
    }

    $range.on('change', function (e) {
        if (value === $range.val()) {
            return false;
        }
        _this.cache.value = value = $range.val();
        $ele0.css({
            width : width * value,
            height: height * value,
            top   : ele0top - width * (value - originalValue) / 2,
            left  : ele0left - height * (value - originalValue) / 2
        });
        $ele1.css({
            width : width * value,
            height: height * value,
            top   : ele1top - width * (value - originalValue) / 2,
            left  : ele1left - height * (value - originalValue) / 2
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

export function zoomPhone() {
    let _this = this;

    let $range = _this.dom.$range,
        $ele0 = _this.dom.$ele0,
        $ele1 = _this.dom.$ele1,
        width = _this.cache.width,
        height = _this.cache.height,
        value = _this.cache.value;

    let ele0top,
        ele0left,
        ele1top,
        ele1left,
        originalValue;

    function zoom(e) {
        $range.trigger('change');
    }

    $range.on('change', function (e) {
        if (value === $range.val()) {
            return false;
        }
        _this.cache.value = value = $range.val();
        $ele0.css({
            width : width * value,
            height: height * value,
            top   : ele0top - width * (value - originalValue) / 2,
            left  : ele0left - height * (value - originalValue) / 2
        });
        $ele1.css({
            width : width * value,
            height: height * value,
            top   : ele1top - width * (value - originalValue) / 2,
            left  : ele1left - height * (value - originalValue) / 2
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
