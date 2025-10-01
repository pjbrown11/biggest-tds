import adapter from '@sveltejs/adapter-static';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'$components': path.resolve('./src/components'),
			'$stores': path.resolve('./src/stores'),
			'$helpers': path.resolve('./src/helpers'),
			'$data': path.resolve('./src/data'),
		}
	},
};

export default config;
