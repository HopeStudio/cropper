export const STYLE = `
body, html {
    padding: 0;
    margin: 0;
}
.cropper-box-mask {
    width: 100%;
    height: 100%;
    opacity: .4;
    background-color: black;
}
.cropper-box-client {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
    border: 2px dashed red;
    background-color: transparent;
}
.cropper-box-client-target {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.cropper-box-client-n {
    position: absolute;
    height: 48px;
    width: 100%;
    cursor: ns-resize;
    top: -24px;
    left: 0;
}
.cropper-box-client-s {
    position: absolute;
    width: 100%;
    height: 48px;
    cursor: ns-resize;
    bottom: -24px;
    left: 0;
}
.cropper-box-client-w {
    position: absolute;
    height: 100%;
    width: 48px;
    cursor: ew-resize;
    left: -24px;
    top: 0;
}
.cropper-box-client-e {
    position: absolute;
    width: 48px;
    height: 100%;
    cursor: ew-resize;
    right: -24px;
    top: 0;
}
.cropper-range input {
    display: inline-block;
}
`;
