import ref = require('lib/ReferenceDefinitions');
import Request = require('lib/temple/utils/Request');

class RequestJSON extends Request {

	constructor( options ){
		super(options);

		throw 'RequestJSON is still beta';

		this._headers['Accept'] = 'application/json';
		this._headers['X-Request'] = 'JSON';

		if(!options['secure']){
			this._options['secure'] = true;
		}
	}

//	success( text:string ){
//		var json;
//		try {
//			json = this.response.json = JSON.decode(text, this.options.secure);
//		} catch( error ) {
//			this.dispatchEvent('error', [text, error]);
//			return;
//		}
//		if( json == null ) this.onFailure(); else this.onSuccess(json, text);
//	}
}