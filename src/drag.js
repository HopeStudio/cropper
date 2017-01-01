export function dragPhone() {
    let _this = this;

    let $wrap = this.dom.$wrap,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1,
        curOn;

    let originX,
        originY,
        ele0top = $ele0.position().top,
        ele0left = $ele0.position().left,
        ele1top = $ele1.position().top,
        ele1left = $ele1.position().left;

    function touchDrag(e) {
        e.preventDefault();
        $ele0.css({
            top : ele0top + e.originalEvent.targetTouches[0].clientY - originY,
            left: ele0left + e.originalEvent.targetTouches[0].clientX - originX
        });
        $ele1.css({
            top : ele1top + e.originalEvent.targetTouches[0].clientY - originY,
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
                $wrap.off('touchmove', touchDrag);
                ele0top = $ele0.position().top;
                ele0left = $ele0.position().left;
                ele1top = $ele1.position().top;
                ele1left = $ele1.position().left;
            });
        }
    });
}

export function dragPC() {
    let _this = this;

    let $wrap = this.dom.$wrap,
        $ele0 = this.dom.$ele0,
        $ele1 = this.dom.$ele1,
        curOn;

    let originX,
        originY,
        ele0top = $ele0.position().top,
        ele0left = $ele0.position().left,
        ele1top = $ele1.position().top,
        ele1left = $ele1.position().left;

    function mouseDrag(e) {
        e.preventDefault();
        $ele0.css({
            top : ele0top + e.clientY - originY,
            left: ele0left + e.clientX - originX
        });
        $ele1.css({
            top : ele1top + e.clientY - originY,
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
