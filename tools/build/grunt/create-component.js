module.exports = function (grunt, options)
{
	return {
		options: {
			'componentDir': '<%= sourceDir %>inc/script/app/component/',
			'templateDir': '<%= gruntDir %>tasks/create-component/',
			'scssDir': '<%= sourceDir %>inc/style/',
			'scssComponentDir': 'component/', // relative to scssDir
			'componentScssPath': 'component/component.scss' // relative to scssDir
		},
		default: {
		}
	};
};