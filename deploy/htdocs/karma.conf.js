// Karma configuration
// Generated on Sun Jul 14 2013 14:17:34 GMT+0200 (W. Europe Daylight Time)

module.exports = function (config)
{
	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',


		// frameworks to use
		frameworks: ['jasmine', 'requirejs'],


		// list of files / patterns to load in the browser
		files: [
			'inc/**/test-main.js',
			{pattern: 'inc/script/app/**/*.js', included: false, served: true},
			{pattern: 'inc/script/lib/**/*.js', included: false, served: true},
			{pattern: 'inc/script/test/**/*Spec.js', included: false}
		],

		// list of files to exclude
		exclude: [
			'inc/script/app/Main.js',
			'**/karma.conf.js'
		],


		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['dots'],


		// web server port
		port: 9876,

		// cli runner port
		runnerPort: 9100,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: karma.LOG_DISABLE || karma.LOG_ERROR || karma.LOG_WARN || karma.LOG_INFO || karma.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['PhantomJS'],
		//browsers: ['Chrome'],
		//browsers: ['C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'],


		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,


		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
