import { XmlToJSON } from './xml-to-json';


function convertObjectToXml(prefix: string, propertyName: string, propertyValue: any): string {
    let result = ``;


    if (Array.isArray(propertyValue)) {
        propertyValue.forEach(innerItem =>
        {
            result += convertObjectToXml(prefix, propertyName, innerItem);
        });
    } else if (typeof propertyValue === 'object') {

        const attributes = propertyValue['attr'];
        let parsedAttributes = '';
        if (attributes) {
            Object.keys(attributes).forEach(attributeName =>
            {
                parsedAttributes += `${parsedAttributes ? ' ' : ''}${attributeName}="${attributes[attributeName]}"`;
            });
        }

        let parsedValue: any = '';

        if (propertyValue['text']) {
            parsedValue = propertyValue['text'];
        } else {
            Object.keys(propertyValue).forEach(innerProperty => {
                if (innerProperty !== 'attr') {
                    parsedValue += convertObjectToXml(prefix, innerProperty, propertyValue[innerProperty]);
                }
            });
        }

        result += `<${prefix}${propertyName}`;

        if (parsedAttributes) {
            result += ` ${parsedAttributes}>`;
        } else {
            result += '>';
        }

        result += `${parsedValue}</${prefix}${propertyName}>`;
    }


    return result;
}

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

    static toXml(namespace: string, prefix: string, data: object): string {

        let parsedObject = '';
        const parsedPrefix = prefix ? `${prefix}:` : '';

        if (data)
        {
            Object.keys(data).forEach(property => {
                parsedObject += convertObjectToXml(parsedPrefix, property, data[property])
            });
        }

        return `<${parsedPrefix}schema xmlns:xsd="${namespace}">${parsedObject}</${parsedPrefix}schema>`;
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