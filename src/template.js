export const TEMPLATE = `
<div class="cropper-mask" id="cropperMask">
    <div class="cropper-box" id="cropperBox">
        <!-- 图片 -->

        <!-- cropper-box-mask 用于实现阴影遮罩 -->
        <div class="cropper-box-mask" id="cropperBoxMask"></div>
        <div class="cropper-box-client" id="cropperBoxClient">
            <div class="cropper-box-client-target" id="cropperBoxClientTarget">
                <!-- 图片 -->
            </div>
            <div class="cropper-box-client-n cropper-box-client-bar"></div>
            <div class="cropper-box-client-s cropper-box-client-bar"></div>
            <div class="cropper-box-client-w cropper-box-client-bar"></div>
            <div class="cropper-box-client-e cropper-box-client-bar"></div>
        </div>
    </div>
    <input type="button" value="确认裁剪" class="cropper-ensure" id="cropperEnsure">
    <div class="cropper-range" id="cropperRange">
        <input type="range" min="1" max="5" step="0.05" value="1">
    </div>
</div>
`;
