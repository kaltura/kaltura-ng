export enum BrowserNames
{
	IE11,
	other
}
export class KalturaBrowserUtils {
	static detectBrowser(): BrowserNames
		{
			if (!!window['MSInputMethodContext'] && !!document['documentMode']){
				return BrowserNames.IE11;
			}else{
				return BrowserNames.other;
			}
		}
}