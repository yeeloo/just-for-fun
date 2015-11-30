import IResult = require("lib/temple/core/IResult");

class FacebookResult<DataType> implements IResult<DataType, string>
{
	constructor(public success:boolean, public data:DataType = null)
	{
	}
}

export = FacebookResult;