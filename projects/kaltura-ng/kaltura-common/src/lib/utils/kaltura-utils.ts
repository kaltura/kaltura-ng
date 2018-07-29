import { Download } from './download';

const _xmlCharMap = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;'
};

export class KalturaUtils
{
    static escapeXml(value: any) : string {
        let parsedValue = value;
        switch(typeof value)
        {
            case 'string':
            case 'number':
            case 'boolean':
                parsedValue = value;
                break;
            default:
            parsedValue = value || '';
                break;
        }

        return String(parsedValue).replace(/[&<>]/g, char => _xmlCharMap[char]);
    }

	static getStartDateValue(value : Date) : Date
    {
        if (value) {
            const newValue = new Date(value.getTime());
            newValue.setHours(0);
            newValue.setMinutes(0);
            newValue.setSeconds(0);
            return newValue;
        }else{
            return null;
        }
    }

    static getEndDateValue(value : Date) : Date
    {
        if (value) {
            const newValue = new Date(value.getTime());
            newValue.setHours(23);
            newValue.setMinutes(59);
            newValue.setSeconds(59);
            return newValue;
        }else{
            return null;
        }
    }static removeEmptyProperties(value : {})
	{
		Object.keys(value).forEach(function(key) {
			if (value[key] && typeof value[key] === 'object') {
				KalturaUtils.removeEmptyProperties(value[key]);
			}
			else if (value[key] === null) {
				delete value[key]
			}
		});
		return value;
	}

    static moveUpItems<T>(list: T[], selectedItems : T[]): boolean {
        if (list && list.length && selectedItems && selectedItems.length) {
            const relevantItems = selectedItems.map(item => ({ selectedItem: item, index: list.indexOf(item) }))
                .filter(item => item.index !== -1)
                .sort((a, b) => a.index - b.index);
            if (relevantItems.length) {
                const minIndexInSelected = relevantItems[0].index;
                const nextIndex = Math.max(0, minIndexInSelected - 1);
                relevantItems.forEach((item, i) => {
                    list.splice(item.index - i, 1);
                });

                list.splice(nextIndex, 0, ...relevantItems.map(item => item.selectedItem));

                return true;
            }
        }

        return false;
    }

    static moveDownItems<T>(list: T[], selectedItems : T[]): boolean {
        if (selectedItems && selectedItems.length && list && list.length) {
            const relevantItems = selectedItems.map(item => ({ selectedItem: item, index: list.indexOf(item) }))
                .filter(item => item.index !== -1)
                .sort((a, b) => a.index - b.index);
            if (relevantItems.length) {
                const maxIndexInSelected = relevantItems[relevantItems.length - 1].index;
                const nextIndex = Math.min(list.length - 1, maxIndexInSelected + 1);
                relevantItems.forEach((item, i) => {
                    list.splice(item.index - i, 1);
                });
                const correctedIndex = nextIndex - relevantItems.length;

                list.splice(correctedIndex + 1, 0, ...relevantItems.map(item => item.selectedItem));

                return true;
            }
        }

        return false;
    }

    static formatTime(value: number, addTimeChars: boolean = false): string {

        let hours: number = Math.floor( Math.round( value ) / 3600 ) % 24;
        let minutes: number = Math.floor( ( Math.round( value ) / 60 ) % 60 );
        let seconds: number = Math.round(value) % 60;

        let hoursStr: string = hours === 0 ? '' : addTimeChars ? hours.toString() + "h:" : hours.toString() + ":";
        let minutesStr: string = minutes === 0 && hours === 0 ? '00' : minutes < 10  ? '0' + minutes.toString() : minutes.toString();
        let secondsStr: string = seconds < 10  ? '0' + seconds.toString() : seconds.toString();
        if (addTimeChars){
            minutesStr = minutesStr + "m";
            secondsStr = secondsStr + "s";
        }
        return hoursStr + minutesStr + ":" + secondsStr;
    }

    static fromServerDate(value : number) : Date
    {
        return (value ? new Date(value * 1000) : null);
    }

    static toServerDate(value : Date) : number
    {
        return value ? Math.round(value.getTime() / 1000) : null;
    }

    static download(data: any, strFileName: string, strMimeType: string) : Boolean
    {
        return Download(data, strFileName, strMimeType);
    }
}
