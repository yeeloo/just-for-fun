if( typeof console === 'undefined' ){
	window['console'] = {
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

define([
	//'lib/polyfills/polyfill.string'
	'lib/polyfills/polyfill.requestAnimationFrame'

], function()
{

});