import { XmlToJSON } from './xml-to-json';

export class XmlParser
{
    static toJson(xml : string) : {}
    {
        return XmlToJSON.parseString(xml,
            {
                textKey: 'text', 	// tag name for text nodes
                valueKey: 'value', 	// tag name for attribute values
                attrKey: 'attr', 	// tag for attr groups
                cdataKey: 'cdata',	// tag for cdata nodes (ignored if mergeCDATA is true)
                childrenAsArray: false 	// force children into arrays
            });
    }



    static toSimpleXml(data : {}, config : {removeEmpty? : boolean} = {}) : string{
        let result = '';
        const _parseValueToXml = (value : any) =>
        {
            let result : string;

            if (typeof value === 'object') {
                result = XmlParser.toSimpleXml(value, config);
            }
            else {
                result = value;
            }

            return result;
        };

        if (data) {
            Object.keys(data).forEach(function (key) {
                const propertyValue = data[key];
                const isEmptyValue = (propertyValue === null || typeof propertyValue === 'undefined' || propertyValue === '');

                if (!config.removeEmpty || (config.removeEmpty && !isEmptyValue)) {
                    if (propertyValue instanceof Array) {
                        propertyValue.map(arrayItem => {
                            const valueAsXml = _parseValueToXml(arrayItem);
                            const isEmptyValue = (valueAsXml === null || typeof valueAsXml === 'undefined' || valueAsXml === '');

                            if (!config.removeEmpty || (config.removeEmpty && !isEmptyValue)) {
                                result += `<${key}>${valueAsXml}</${key}>`;
                            }
                        })
                    } else if (typeof propertyValue === 'object') {
                        const valueAsXml = _parseValueToXml(propertyValue);
                        const isEmptyValue = (valueAsXml === null || typeof valueAsXml === 'undefined' || valueAsXml === '');

                        if (!config.removeEmpty || (config.removeEmpty && !isEmptyValue)) {
                            result += `<${key}>${valueAsXml}</${key}>`;
                        }
                    }
                    else {
                        result += `<${key}>${propertyValue}</${key}>`;
                    }
                }
            });
        }

        return result;
    }
}