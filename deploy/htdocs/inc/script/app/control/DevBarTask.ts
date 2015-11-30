import Sequence = require("lib/temple/control/sequence/Sequence")
import AbstractTask = require("lib/temple/control/sequence/tasks/AbstractTask")

/**
 * @namespace app.control
 * @class DevBarTask
 * @extend temple.control.sequence.tasks.AbstractTask
 */
export class DevBarTask extends AbstractTask
{
	/**
	 */
	constructor()
	{
		super();
	}

	/**
	 * @inheritDoc
	 */
	public executeTaskHook():void
	{
		if (DEBUG)
		{
			console.log('DevBarTask.executeTaskHook');
		}

		if (Browser.name == 'chrome' || (
			Browser.Platform.name != 'mac' &&
				Browser.Platform.name != 'win' &&
				Browser.Platform.name != 'linux'
			)
			)
		{
			this.done();
			return;
		}

		var $el = $('<div/>', {html: 'This version has only been tested on Chrome, if you\'re seeing this message please use Chrome for testing & reviewing.<br />Other browsers will be tested and QA\'ed before launch'}).addClass('dev-bar');
		var $close = $('<span/>', {text: 'x'}).addClass('btn-close');

		$el.append($close);

		$('body').append($el);

		$el.on('click', (event) =>
		{
			$el.remove();
			if ($.cookie)
			{
				$.cookie('hide-chrome-devbar', true);
			}
		});

		if ($.cookie)
		{
			if ($.cookie('hide-chrome-devbar'))
			{
				$el.remove();
			}
		}

		this.done();
	}

	/**
	 * @inheritDoc
	 */
	public destruct():void
	{
		super.destruct();
	}
}