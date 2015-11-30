/**
 * Created by Narie on 7/14/13.
 */

//console.log('FILES: ', window.__karma__.files);

var tests = Object.keys(window.__karma__.files).filter(function( file ){
	return /Spec\.js$/.test(file);
});

//console.log('TESTS: ', tests);

var DEBUG = true;

requirejs.config({
	baseUrl: '/base/inc/script',
	waitSeconds: 15,
	paths: {
		requireLib:     'lib/require/require',
		jquery:         'lib/jquery/jquery',
		cookie:         'lib/jquery/jquery.cookie',
		mootools:       'lib/mootools/mootools.utils',
		knockout:       'lib/knockout/knockout',
		text:           'lib/require/text',
		TweenMax:       'lib/gsap/TweenMax.min',
		TweenLite:      'lib/gsap/TweenLite.min',
		CSSPlugin:      'lib/gsap/plugins/CSSPlugin.min',
		TimelineLite:   'lib/gsap/TimelineLite.min',
		TimelineMax:    'lib/gsap/TimelineMax.min',
		EasePack:       'lib/gsap/easing/EasePack.min',
		moment:         'lib/moment/moment'
	},
	map: {
	},
	shim: {
		'history': ['mootools'],
		'knockout': ['jquery']
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,

	// start test run, once Require.js is done
	callback: window.__karma__.start
});


// Narie: this is not the place to put this, but don't know a better one
// I think we should change the bootstrapping of the app
if( typeof console === 'undefined' ){
	console = {
		/**
		 * @param {...*} message
		 */
		log: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		debug: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		warn: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		error: function( message ){
		},
		/**
		 * @param {...*} message
		 */
		info: function( message ){
		}
	}
}