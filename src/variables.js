export const REGEXP_HYPHENATE = /([a-z\d])([A-Z])/g;
export const IS_PHONE = /android|iphone/i;
export const ISIMAGEBASE64 = /(data:image\/(?:png|jpeg|gif);base64,)/i;

// 两个图片 DOM 的 ID
export const CROPPER_IMAGE_ID = 'cropperImage';
export const CROPPER_BOX_CLIENT_TARGET_IMAGE_ID = 'cropperBoxClientTargetImage';

export const ACTION_EAST = 'e';
export const ACTION_WEST = 'w';
export const ACTION_SOUTH = 's';
export const ACTION_NORTH = 'n';

export const JPEG = 'image/jpeg';
export const DEFAULT_OUTPUT_TYPE = 'file';
export const RANGE_POS_TOP = 'top';
export const RANGE_POS_BOTTOM = 'bottom';

export const MASK_BGCOLOR = 'rgba(0,0,0,0.65)';
export const WRAP_BGCOLOR = '#ccc';

export const UA = navigator.userAgent;
export const IS_SAFARI_OR_UIWEBVIEW = navigator && /(Macintosh|iPhone|iPod|iPad).*AppleWebKit/i.test(navigator.userAgent);
