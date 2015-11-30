module.exports = function (grunt, options)
{
	return {
		options: {
			optimizationLevel: 7
		},
		default: {
			files: [
				{
					src: ['**/*.{jpg,gif}'],
					dest: '<%= buildDir %>',
					cwd: '<%= sourceDir %>',
					expand: true
				}
			]
		}
	};
};