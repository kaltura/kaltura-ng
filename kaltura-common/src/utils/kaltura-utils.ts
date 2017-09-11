import { Download } from './download';

export class KalturaUtils
{
    static getStartDateValue(value : Date) : Date
    {
        if (value) {
            value.setHours(0);
            value.setMinutes(0);
            value.setSeconds(0);
            return value;
        }else{
            return null;
        }
    }

    static getEndDateValue(value : Date) : Date
    {
        if (value) {
            value.setHours(23);
            value.setMinutes(59);
            value.setSeconds(59);
            return value;
        }else{
            return null;
        }
    }

    static removeEmptyProperties(value : {})
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
	static getLanguageByCode(code: string): string {
		return this.languageCodes[code] || null;
	}
	static getCodeByLanguage(language: string): string {
		let code = null;
		for (let c in this.languageCodes){
			if (this.languageCodes[c] === language){
				code = c;
				break;
			}
		}
		return code;
	}

	static download(data: any, strFileName: string, strMimeType: string) : Boolean
	{
		return Download(data, strFileName, strMimeType);
	}

	static languageCodes = {
		"Aa": 'Afar',
		"Ab": 'Abkhazian',
		"Af": 'Afrikaans',
		"Am": 'Amharic',
		"Ar": 'Arabic',
		"As": 'Assamese',
		"Ay": 'Aymara',
		"Az": 'Azerbaijani',
		"Ba": 'Bashkir',
		"Be": 'Byelorussian (Belarusian)',
		"Bg": 'Bulgarian',
		"Bh": 'Bihari',
		"Bi": 'Bislama',
		"Bn": 'Bengali (Bangla)',
		"Bo": 'Tibetan',
		"Br": 'Breton',
		"Ca": 'Catalan',
		"Co": 'Corsican',
		"Cs": 'Czech',
		"Cy": 'Welsh',
		"Da": 'Danish',
		"De": 'German',
		"Dz": 'Bhutani',
		"El": 'Greek',
		"En": 'English',
		"EnGb": 'English (British)',
		"EnUs": 'English (American)',
		"Eo": 'Esperanto',
		"Es": 'Spanish',
		"Et": 'Estonian',
		"Eu": 'Basque',
		"Fa": 'Farsi',
		"Fi": 'Finnish',
		"Fj": 'Fiji',
		"Fo": 'Faeroese',
		"Fr": 'French',
		"Fy": 'Frisian',
		"Ga": 'Irish',
		"Gd": 'Gaelic (Scottish)',
		"Gl": 'Galician',
		"Gn": 'Guarani',
		"Gu": 'Gujarati',
		"Gv": 'Gaelic (Manx)',
		"Ha": 'Hausa',
		"He": 'Hebrew',
		"Hi": 'Hindi',
		"Hr": 'Croatian',
		"Hu": 'Hungarian',
		"Hy": 'Armenian',
		"Ia": 'Interlingua',
		"Id": 'Indonesian',
		"Ie": 'Interlingue',
		"Ik": 'Inupiak',
		"In": 'Indonesian',
		"Is": 'Icelandic',
		"It": 'Italian',
		"Iu": 'Inuktitut',
		"Iw": 'Hebrew',
		"Ja": 'Japanese',
		"Ji": 'Yiddish',
		"Jv": 'Javanese',
		"Ka": 'Georgian',
		"Kk": 'Kazakh',
		"Kl": 'Greenlandic',
		"Km": 'Cambodian',
		"Kn": 'Kannada',
		"Ko": 'Korean',
		"Ks": 'Kashmiri',
		"Ku": 'Kurdish',
		"Ky": 'Kirghiz',
		"La": 'Latin',
		"Li": 'Limburgish ( Limburger)',
		"Ln": 'Lingala',
		"Lo": 'Laothian',
		"Lt": 'Lithuanian',
		"Lv": 'Latvian (Lettish)',
		"Mg": 'Malagasy',
		"Mi": 'Maori',
		"Mk": 'Macedonian',
		"Ml": 'Malayalam',
		"Mn": 'Mongolian',
		"Mo": 'Moldavian',
		"Mr": 'Marathi',
		"Ms": 'Malay',
		"Mt": 'Maltese',
		"Mu": 'Multilingual',
		"My": 'Burmese',
		"Na": 'Nauru',
		"Ne": 'Nepali',
		"Nl": 'Dutch',
		"No": 'Norwegian',
		"Oc": 'Occitan',
		"Om": 'Oromo (Afan, Galla)',
		"Or": 'Oriya',
		"Pa": 'Punjabi',
		"Pl": 'Polish',
		"Ps": 'Pashto (Pushto)',
		"Pt": 'Portuguese',
		"Qu": 'Quechua',
		"Rm": 'Rhaeto-Romance',
		"Rn": 'Kirundi (Rundi)',
		"Ro": 'Romanian',
		"Ru": 'Russian',
		"Rw": 'Kinyarwanda (Ruanda)',
		"Sa": 'Sanskrit',
		"Sd": 'Sindhi',
		"Sg": 'Sangro',
		"Sh": 'Serbo-Croatian',
		"Si": 'Sinhalese',
		"Sk": 'Slovak',
		"Sl": 'Slovenian',
		"Sm": 'Samoan',
		"Sn": 'Shona',
		"So": 'Somali',
		"Sq": 'Albanian',
		"Sr": 'Serbian',
		"Ss": 'Siswati',
		"St": 'Sesotho',
		"Su": 'Sundanese',
		"Sv": 'Swedish',
		"Sw": 'Swahili (Kiswahili)',
		"Ta": 'Tamil',
		"Te": 'Telugu',
		"Tg": 'Tajik',
		"Th": 'Thai',
		"Ti": 'Tigrinya',
		"Tk": 'Turkmen',
		"Tl": 'Tagalog',
		"Tn": 'Setswana',
		"To": 'Tonga',
		"Tr": 'Turkish',
		"Ts": 'Tsonga',
		"Tt": 'Tatar',
		"Tw": 'Twi',
		"Ug": 'Uighur',
		"Uk": 'Ukrainian',
		"Un": 'Undefined',
		"Ur": 'Urdu',
		"Uz": 'Uzbek',
		"Vi": 'Vietnamese',
		"Vo": 'Volapuk',
		"Wo": 'Wolof',
		"Xh": 'Xhosa',
		"Yi": 'Yiddish',
		"Yo": 'Yoruba',
		"Zh": 'Chinese',
		"Zu": 'Zulu'
	};
}
