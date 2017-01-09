# cropper

一款简易的 jQuery 图片裁剪、压缩插件（仍在开发中）。

[Demo](https://hopestudio.github.io/cropper/demo/)

## 快速上手

`$('imgSelector').cropper(options, callback)`

```html
<img class="target-img" src="./test.png" style="width: 100px">
```
```javascript
var cropper = $('.target-img').cropper({
        /**
        * outputType: 数据输出类型，传递给回调函数
        *   type: String
        *   default: 'file'
        */
        outputType: 'file',
        /**
        * range: 图片缩扩（zoom）range bar 参数
        */
        range     : {
            min : 1,
            max : 5,
            step: 0.05,
            init: 1,
            pos : 'bottom'
        },
        /**
        * cropper: 裁剪框参数
        * fixed 设为 true 则图片不可拖动
        */
        cropper   : {
            minSpace: 30,
            fixed   : false,
            antWidth: 1
        },
        /**
        * canvas: 当 outputType 为 'file' 时的图片文件输出格式与压缩率
        */
        canvas    : {
            type   : 'image/jpeg',
            quality: 0.7
        }
    }, function (file) {
        /**
        * 回调函数内 this 指向 cropper 对象
        */
        console.log(URL.createObjectURL(file));
        window.open(URL.createObjectURL(file));
    });
```

## API
`cropper.resetPos()`
* 重置裁剪程序
* 重置图片位置、尺寸、裁剪框参数

`cropper.setOptions(options)`
* 随时用于配置 `cropper` 对象使用的参数

`cropper.setDefaults(options)`
* 配置全局的 `defaults` 参数

`cropper.fixImg()`
* 固定图片，禁止图片拖拽

