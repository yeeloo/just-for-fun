import refdef = require('../../../lib/ReferenceDefinitions');
import Destructible = require('../../../lib/temple/core/Destructible');


class ColliderCanvas extends Destructible
{
    public element:HTMLElement;

    constructor(view:HTMLElement)
    {
        super();

        this.element = view;
        this.initialize();
    }

    public initialize()
    {

    }

    public destruct():void
    {
        super.destruct();
    }
}

export = ColliderCanvas;