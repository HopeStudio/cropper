import {DEFAULT_OUTPUT_TYPE, JPEG, RANGE_POS_BOTTOM} from './variables';

export const DEFAULTS = {
    // 默认输出为 file，可选 'data'，输出图片元素和坐标数据
    outputType: DEFAULT_OUTPUT_TYPE,
    range     : {
        min : 1,
        max : 5,
        step: 0.05,
        init: 1,
        pos : RANGE_POS_BOTTOM
    },
    cropper   : {
        minSpace: 30,
        fixed   : false,
        antWidth: 2
    },
    canvas    : {
        type   : JPEG,
        quality: 0.7
    }
};
