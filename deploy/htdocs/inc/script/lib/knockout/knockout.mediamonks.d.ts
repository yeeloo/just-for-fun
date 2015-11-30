/// <reference path="knockout.d.ts" />


interface KnockoutBindingHandlers {
	localizedText: KnockoutBindingHandler;
	localizedImage: KnockoutBindingHandler;
	localizedBgImage: KnockoutBindingHandler;
	allowBindings: KnockoutBindingHandler;
	component: KnockoutBindingHandler;
}


interface KnockoutTemplateSources {
	stringTemplate:any;
//  @todo implement new in source binding
//	domElement: any;
}

interface KnockoutStatic {
	templates: any;
}