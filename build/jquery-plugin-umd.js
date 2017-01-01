const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * ${new Date()} ${pkg.author}
 * Released under the ${pkg.license} License.
 */
`;
const intro = `(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = function (root, jQuery) {
            if (jQuery === undefined) {
                if (typeof window !== 'undefined') {
                    jQuery = require('jquery');
                } else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        factory(jQuery);
    }
}(function ($) {
'use strict';

`;
const outro = `
}));
`;

// const code = fs.readFileSync(`./dist/${pkg.name}.js`, 'utf-8').replace(/^(\s*)/gm, '    $1');
const code = fs.readFileSync(`./dist/${pkg.name}.js`, 'utf-8');
const result = banner + intro + code + outro;

fs.writeFileSync(`./dist/${pkg.name}.js`, result, 'utf-8');
