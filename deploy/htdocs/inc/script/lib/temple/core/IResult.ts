interface IResult<TData, TCode>
{
	success:boolean;
	data?:TData;
	code?:TCode;
	message?:string;
}

export = IResult;