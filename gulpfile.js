const gulp = require('gulp');
const rollup = require('rollup');


const typescript = require('rollup-plugin-typescript2');//typescript2 plugin
const glsl = require('rollup-plugin-glsl');


gulp.task('compile', ()=>{
    return rollup.rollup({
		input: './src/game/TestGame.ts',
		treeshake: true,//建议忽略
		plugins: [
			typescript({
				check: false, //Set to false to avoid doing any diagnostic checks on the code
				tsconfigOverride:{compilerOptions:{removeComments: true}}
			}),
			glsl({
				// By default, everything gets included
				include: /.*(.glsl|.vs|.fs)$/,
				sourceMap: false,
				compress:false
			}),      
		]
	}).then(bundle => {
		return bundle.write({
			file: './bin/js/bundle.js',
			format: 'iife',
			name: 'laya',
			sourcemap: true
		});
	});
})