interface Function {
	pass?( arg:any, bind:Object ): Function;
	delay?( n:number, arg?:any, bind?:Object ): number;
	bind( bind?:any, arg?:any ): Function;
}

interface MootoolsBrowser {
	name:string;
	version:number;
	Device:{
		name: string;
		ipad?:boolean;
		iphone?:boolean;
	};
	Platform:{
		name: string;
		android?:boolean;
		ios?:boolean;
		webos?:boolean;
		other?:boolean;
		win?:boolean;
		mac?:boolean;
		linux?:boolean;
	};
	ie?: boolean;
}

interface Object {
	toQueryString( data:any ):string;
}

interface Array<T> {
	contains( data:any ):boolean;
}

interface String {
	hyphenate():string;
}

declare var Browser:MootoolsBrowser;
declare var typeOf:( v:any ) => string;
