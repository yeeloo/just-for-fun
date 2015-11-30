module.exports = function (grunt, options)
{
	return {
		release:{
			options: {
				sourceMap: options.exportSourceMaps,
				sourceMapIncludeSources: true,
				sourceMapName: function(val) {
					return val.replace(/script/gi, 'sourcemap') + '.map';
				},
				compress: {
					global_defs: {
						RELEASE: true,
						DEBUG: false
					}
				},
				preserveComments: false
			},
			files: [{
				expand: true,
				cwd: '<%= buildDir %>/inc/script',
				src: '**/*.js',
				dest: '<%= buildDir %>/inc/script'
	        }]
		}
	};
};