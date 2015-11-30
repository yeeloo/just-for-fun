module.exports = function (grunt, options)
{
	return {
		compile: {
			name: 'MediaMonks - Skeleton',
			description: 'documentation',
			version: 1,
			url: 'http://www.mediamonks.com',
			options: {
				paths: '<%= sourceDir %>../../',
				themedir: 'tools/docs/theme',
				outdir: 'docs/',
				extension: ".ts"
			}
		}
	};
};