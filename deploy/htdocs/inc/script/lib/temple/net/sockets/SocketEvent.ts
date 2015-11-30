import BaseEvent = require('lib/temple/events/BaseEvent');
import IResult = require('lib/temple/core/IResult');

/**
 * @module Temple
 * @namespace temple.net.sockets
 * @class SocketEvent
 */
class SocketEvent extends BaseEvent
{
	/**
	 * @static
	 * @property CONNECTING
	 * @type string
	 */
	public static CONNECTING:string = 'SocketEvent.connecting';

	/**
	 * @static
	 * @property OPENED
	 * @type string
	 */
	public static OPENED:string = 'SocketEvent.opened';

	/**
	 * @static
	 * @property CLOSED
	 * @type string
	 */
	public static CLOSED:string = 'SocketEvent.closed';

	/**
	 * @static
	 * @property RECONNECT
	 * @type string
	 */
	public static RECONNECT:string = 'SocketEvent.reconnect';

	/**
	 * @static
	 * @property NO_SERVER_AVAILABLE
	 * @type string
	 */
	public static NO_SERVER_AVAILABLE:string = 'SocketEvent.no_server_available';

	/**
	 * @static
	 * @property MESSAGE
	 * @type string
	 */
	public static MESSAGE:string = 'SocketEvent.message';

	/**
	 * @class SocketEvent
	 * @constructor
	 * @param {string} type
	 * @param {any} action
	 * @param {any} event
	 * @param {any} data
	 * @param {Date} time
	 */
	constructor(type:string, public action:any = null, public event:any = null, public data:any = null,  public time:Date = null)
	{
		super(type);
	}
}

export = SocketEvent;