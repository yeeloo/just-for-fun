module.exports = function (grunt, options)
{
	return {
		options: {
			sourcemap: false
			//outputStyle: 'compressed'
		},
		dist: {
			files: [
				{
					expand: true,
					cwd: '<%= sourceDir %>inc/style',
					src: ['*.scss'],
					dest: '<%= sourceDir %>inc/style',
					ext: '.css'
				}
			]
		}

	};
};