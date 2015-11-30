module.exports = function (grunt, options)
{
	return {
		'index': {
			src:  'asset/phonegap/index.html',
			dest: '<%= buildDir %>index.html'
		}
	};
};