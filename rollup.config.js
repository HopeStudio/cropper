import { readFileSync } from 'fs';
// import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';

const pkg = JSON.parse(readFileSync('package.json', 'utf-8'));

export default {
    entry: 'src/index.js',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: 'es2015-rollup',
            babelrc: false
        }),
        replace({
            '<@VERSION@>': pkg.version,
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ],
    external: [
    ],
    sourceMap: false,
    moduleName: pkg.name,
    globals: {
        jQuery: '$',
        zepto: '$'
    },
    useStrict: false,
    indent: true,
    targets: [{
        dest: `dist/${pkg.name}.js`,
        format: 'es'
    }]
};
