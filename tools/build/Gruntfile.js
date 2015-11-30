module.exports = function (grunt)
{
	if (process.argv.length > 2)
	{
		require('time-grunt')(grunt);
	}

	var pkg = grunt.file.readJSON('package.json');
	var path = require('path');

	var sourceDir = 'deploy/htdocs/';
	var appDir = 'phonegap/';
	var buildDir = 'build/';
	var gruntDir = path.normalize(process.cwd() + '/');
	var version = pkg.appversion;
	var appName = pkg.appname;
	var exportSourceMaps = true;
	var base = '../../';

	grunt.config('version', version);
	grunt.config('sourceDir', sourceDir);
	grunt.config('base', base);

	require('load-grunt-config')(grunt, {

		//auto grunt.initConfig
		init: true,

		//data passed into config.  Can use with <%= test %>
		data: {
			sourceDir: sourceDir,
			buildDir: buildDir,
			gruntDir: gruntDir,
			appDir: appDir,
			version: version,
			appName: appName,
			exportSourceMaps: exportSourceMaps
		},

		// auto-loads tasks when needed, instead of by default
		jitGrunt: {
			// here you can pass options to jit-grunt (or just jitGrunt: true)
			customTasksDir: 'tasks',
			staticMappings: {
				availabletasks: 'grunt-available-tasks'
			}
		}
	});

	// change base so tasks don't have to '../'
	grunt.file.setBase(base);
};