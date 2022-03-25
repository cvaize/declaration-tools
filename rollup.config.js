import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const name = 'DeclarationTools';
const plugins = [commonjs(), resolve()];
const minPlugins = [commonjs(), resolve(), terser()];

// https://remarkablemark.org/blog/2019/07/12/rollup-commonjs-umd/
const config = {
	input: 'build/index.js',
	output: [
		{ name, file: 'build/index.cjs.js', format: 'cjs', plugins },
		{ name, file: 'build/index.cjs.min.js', format: 'cjs', plugins: minPlugins },
		{ name, file: 'build/index.esm.js', format: 'esm', plugins },
		{ name, file: 'build/index.esm.min.js', format: 'esm', plugins: minPlugins },
		{ name, file: 'build/index.umd.js', format: 'umd', plugins },
		{ name, file: 'build/index.umd.min.js', format: 'umd', plugins: minPlugins },
	],
};

export default config;
