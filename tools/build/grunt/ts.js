module.exports = function (grunt, options)
{
	return {
		default: {
			// The source TypeScript files, http://gruntjs.com/configuring-tasks#files
			src: ['<%= sourceDir %>inc/script/**/*.ts'],
			// Use to override the default options, http://gruntjs.com/configuring-tasks#options
			options: {
				// 'es3' (default) | 'es5'
				target: 'es3',
				// 'amd' (default) | 'commonjs'
				module: 'amd',
				// true (default) | false
				sourceMap: false,
				// true | false (default)
				declaration: false,
				// true (default) | false
				removeComments: false,
				// true (default) | false
				failOnTypeErrors: true,
				// watch (default) | always | never
				fast: 'never'
			}
		}
	};
};