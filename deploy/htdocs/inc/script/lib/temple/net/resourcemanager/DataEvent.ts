import BaseEvent = require("lib/temple/events/BaseEvent");

class DataEvent<T> extends BaseEvent {
	data:T;
	constructor(type:string, data:T){
		super(type);
		this.data = data;
	}
}
export = DataEvent;