// Type definitions for SockJS 0.3.x
// Project: https://github.com/sockjs/sockjs-client
// Definitions by: Emil Ivanov <https://github.com/vladev>
// DefinitelyTyped: https://github.com/borisyankov/DefinitelyTyped

interface SockJSSimpleEvent {
    type: string;
    toString(): string;
}

interface SJSOpenEvent extends SockJSSimpleEvent {}

interface SJSCloseEvent extends SockJSSimpleEvent {
    code: number;
    reason: string;
    wasClean: boolean;
}

interface SJSMessageEvent extends SockJSSimpleEvent {
    data: string;
}


declare class SockJS {
    constructor (url: string, _reserved?:any, options?: {
         debug?: boolean;
         devel?: boolean;
         protocols_whitelist?: string[];
     });

	static OPEN: number;
	static CLOSING: number;
	static CONNECTING: number;
	static CLOSED: number;

	protocol: string;
	readyState: number;
	onopen: (ev: SJSOpenEvent) => any;
	onmessage: (ev: SJSMessageEvent) => any;
	onclose: (ev: SJSCloseEvent) => any;
	send(data: any): void;
	close(code?: number, reason?: string): boolean;

	removeEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
	addEventListener(type: string, listener: EventListener, useCapture?: boolean): void;
	dispatchEvent(evt: Event): boolean;
}