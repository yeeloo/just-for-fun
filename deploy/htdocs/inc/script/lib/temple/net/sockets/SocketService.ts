import def = require('lib/ReferenceDefinitions');
import EventDispatcher = require('lib/temple/events/EventDispatcher');
import SocketEvent = require('lib/temple/net/sockets/SocketEvent');
import IResult = require('lib/temple/core/IResult');

/**
 * @module Temple
 * @namespace temple.net.sockets
 * @class SocketService
 */
class SocketService extends EventDispatcher
{
	private socket:SockJS;

	private _handleSocketOpened:EventListener;
	private _handleSocketMessage:EventListener;
	private _handleSocketClosed:EventListener;

	private uniqueCallbackId:number = 0;

	private _fallback:boolean = !window['WebSocket'];

	/*
	 Socket reconnect strategy:
	 Reconnecting is done in tiers.

	 When a connection fails for the first time, the socket is reconnected with delay:
	 $reconnectDelayTiers[$reconnectTier] + random(1-2)

	 $reconnectTier = Math.min($reconnectTier + 1, $reconnectDelayTiers.length)

	 when connection succeeds:
	 $reconnectTier = 0
	 */
	private reconnectTier:number = 0;
	private reconnectTimeout:number;
	private reconnectDelayTiers:number[] = [
		1000,
		6000,
		11000
	];

	private _protocol:string;

	constructor(public url:string = null, public debug:boolean = true)
	{
		super();
	}

	public connect():void
	{
		if (this.isConnected())
		{
			// make sure we have disconnected
			if (this.debug) console.error('SocketService::Connect::AlreadyConnected');
			return;
		}

		if (this.debug) console.log('SocketService::Connect');

		this.reconnectTier = 0;
		this.forceConnect();
	}

	public isConnected():boolean
	{
		return typeof this.socket != 'undefined' && this.socket.readyState == SockJS.OPEN;
	}

	public disconnect():void
	{
		clearTimeout(this.reconnectTimeout);

		if (typeof this.socket == 'undefined')
		{
			return;
		}

		if (this.debug) console.log('SocketService::Disconnect');

		// remove event listeners
		// prevents handleSocketClosed from firing
		// remove the event listener so it doesn't attempt to reconnect
		this.removeEventListeners(this.socket);

		var result = this.socket.close();

		if (this.debug) console.log('SocketService::Disconnect( ' + result + ' )');

		this.socket = undefined;
	}

	public send(type:string, action?:string, data?:any):void
	{
		if (!this.isConnected()) throw new Error("Not connected");

		var message:ISocketMessage = {t: type};

		if (typeof data != 'undefined')
		{
			message["d"] = data;
		}
		if (typeof action != 'undefined')
		{
			message["a"] = action;
		}

		if (this.debug)
		{
			console.log("send", message);
		}

		this.socket.send(JSON.stringify(message));
	}

	public request(action:string, data?:any, callback?:(result:IResult<any, string>) => any)
	{
		var handler = this.addEventListener(SocketEvent.MESSAGE, (event:SocketEvent) =>
		{
			if (event.action == action)
			{
				handler.destruct();

				callback(event.data);
			}
		});

		this.send(REQUEST, action, data);
	}

	private forceConnect():void
	{
		if (this.debug) console.log('SocketService::ForceConnect');

		if (!this.url) throw new Error("URL not set");

		this.dispatchEvent(new SocketEvent(SocketEvent.CONNECTING));

		if (DEBUG) console.log("Connect to url '" + this.url + (this._fallback ? "?fallback=1" : "") + "'");

		$.ajax((this.url + (this._fallback ? "?fallback=1" : "")), {
			timeout: 5000,
			dataType: "jsonp",
			jsonpCallback:"connectCallback"
		}).done((host:string) =>
			{
				if (host == "")
				{
					this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVER_AVAILABLE));
					this.reconnect();
					if (this.debug) console.log('SocketService::NoServerAvailale')

					return;
				}

				if (this.debug) console.log('SocketService::JSONPSuccess');

				if (!this._protocol) this._protocol = this.url.substr(0, this.url.indexOf("://") + 3);

				this.socket = new SockJS(this._protocol + host + '/soccom', undefined, {
					debug: false,
					devel: true,
					protocols_whitelist: this.getProtocols()
				});

				this.addEventListeners(this.socket);
			}).error(() =>
			{
				this.dispatchEvent(new SocketEvent(SocketEvent.NO_SERVER_AVAILABLE));
				if (this.debug) console.log('SocketService::JSONPFailed');

				this.reconnect();
			});
	}

   private getProtocols()
    {
        // check if browser supports websockets (if so, try to connect with websocket on the "main domain")
        return window['WebSocket'] && this._fallback === false ? ['websocket'] : ['xdr-streaming', 'xhr-streaming', 'iframe-eventsource', 'iframe-htmlfile', 'xdr-polling', 'xhr-polling', 'iframe-xhr-polling', 'jsonp-polling'];
    }

	private reconnect():void
	{
		clearTimeout(this.reconnectTimeout);

		var delay = this.reconnectDelayTiers[this.reconnectTier] + Math.round(Math.random() * 4000);

		if (this.debug) console.log('SocketService::Reconnect( ' + this.reconnectTier + ', ' + delay + ' )');

		this.reconnectTimeout = setTimeout(() =>
		{
			this.forceConnect();
		}, delay);

		this.dispatchEvent(new SocketEvent(SocketEvent.RECONNECT));

		this.reconnectTier = Math.min(this.reconnectTier + 1, this.reconnectDelayTiers.length - 1);
	}

	private addEventListeners(socket:SockJS):void
	{
		this.uniqueCallbackId = new Date().getTime();

		if (this.debug) console.log('SocketService::AddEventListeners( ' + this.uniqueCallbackId + ' )');

		this._handleSocketOpened = <EventListener>this.handleSocketOpened.bind(this, this.uniqueCallbackId);
		this._handleSocketMessage = <EventListener>this.handleSocketMessage.bind(this, this.uniqueCallbackId);
		this._handleSocketClosed = <EventListener>this.handleSocketClosed.bind(this, this.uniqueCallbackId);

		socket.addEventListener('open', this._handleSocketOpened);
		socket.addEventListener('message', this._handleSocketMessage);
		socket.addEventListener('close', this._handleSocketClosed);
	}

	private removeEventListeners(socket:SockJS):void
	{
		socket.removeEventListener('open', this._handleSocketOpened);
		socket.removeEventListener('message', this._handleSocketMessage);
		socket.removeEventListener('close', this._handleSocketClosed);
	}

	private handleSocketOpened(uniqueCallbackId:number):void
	{
		if (uniqueCallbackId != this.uniqueCallbackId)
		{
			if (this.debug) console.log('SocketService::Callback::Opened::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');

			return;
		}
		if (this.debug)
		{
			console.log('SocketService::Callback::Opened::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
			console.log('SocketService::ConnectionOpened');
		}

		clearTimeout(this.reconnectTimeout);

		// reset the reconnect tier
		this.reconnectTier = 0;
		this.dispatchEvent(new SocketEvent(SocketEvent.OPENED));
	}

	private handleSocketClosed(uniqueCallbackId:number, e:any):void
	{
		if (uniqueCallbackId != this.uniqueCallbackId)
		{
			if (this.debug) console.log('SocketService::Callback::Closed::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');

			return;
		}
		if (this.debug)
		{
			console.log('SocketService::Callback::Closed::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
			console.warn('SocketService::ConnectionClosed');
		}

		if (e && e.code === 2000)
		{
			// supplied protocols not supported
			this._fallback = true;
		}

		this.reconnect();
		this.dispatchEvent(new SocketEvent(SocketEvent.CLOSED));
	}

	private handleSocketMessage(uniqueCallbackId:number, e:SockJSData):void
	{
		if (uniqueCallbackId != this.uniqueCallbackId)
		{
			if (this.debug) console.warn('SocketService::Callback::Message::Conflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
			return;
		}

		if (this.debug)
		{
			console.log('SocketService::HandleSocketMessage', e);
			console.log('SocketService::Callback::Message::NoConflict( ' + uniqueCallbackId + ', ' + this.uniqueCallbackId + ' )');
		}

		var message:ISocketMessage = <ISocketMessage> JSON.parse(e.data);

		if (this.debug) console.log(message.t + ": " + message.a, message.d);

		this.dispatchEvent(new SocketEvent(SocketEvent.MESSAGE, message.a, message.e, message.d, message.n ? new Date(message.n * 1000) : null));
	}
}

interface SockJSData
{
	data:string;
}

interface ISocketMessage
{
	/**
	 * Type
	 */
	t:string;

	/**
	 * Action
	 */
	a?:string;

	/**
	 * Event
	 */
	e?:string;

	/**
	 * Data
	 */
	d?:any;

	/**
	 * unix time
	 */
	n?:number;
}

var REQUEST:string = "request";

export = SocketService;