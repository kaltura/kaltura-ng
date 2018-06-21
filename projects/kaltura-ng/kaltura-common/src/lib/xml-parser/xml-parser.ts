import { XmlToJSON } from './xml-to-json';
import { KalturaUtils } from '../utils/kaltura-utils';



function convertAttributes(attributes: object): string {
  let parsedAttributes = '';
  if (attributes) {
    Object.keys(attributes).forEach(attributeName => {
      const value = KalturaUtils.escapeXml(attributes[attributeName]);
      parsedAttributes += ` ${attributeName}="${value}"`;
    });
  }

  return parsedAttributes;
}

function convertObjectToXml(prefix: string, propertyName: string, propertyValue: any): string {
    let result = ``;

    const noPrefixPropertyName = (propertyName || '').indexOf('noprefix:') !== -1;
    if (noPrefixPropertyName) {
      propertyName = propertyName.replace('noprefix:', '');
      prefix = '';
    }

    if (Array.isArray(propertyValue)) {
        propertyValue.forEach(innerItem =>
        {
            result += convertObjectToXml(prefix, propertyName, innerItem);
        });
    } else if (propertyValue && typeof propertyValue === 'object') {

        const parsedAttributes = convertAttributes(propertyValue['attr']);
        let parsedValue: any = '';

        if (propertyValue['text']) {
            parsedValue = KalturaUtils.escapeXml(propertyValue['text']);
        } else {
            Object.keys(propertyValue).forEach(innerProperty => {
                if (innerProperty !== 'attr') {
                    parsedValue += convertObjectToXml(prefix, innerProperty, propertyValue[innerProperty]);
                }
            });
        }

        result += `<${prefix}${propertyName}`;

        if (parsedAttributes) {
            result += `${parsedAttributes}>`;
        } else {
            result += '>';
        }

        result += `${parsedValue}</${prefix}${propertyName}>`;
    }


    return result;
}

export class XmlParser
{
    static toJson(xml : string, grokValues: boolean) : {}
    {
        return XmlToJSON.parseString(xml,
            {
                textKey: 'text', 	// tag name for text nodes
                valueKey: 'value', 	// tag name for attribute values
                attrKey: 'attr', 	// tag for attr groups
                cdataKey: 'cdata',	// tag for cdata nodes (ignored if mergeCDATA is true)
                childrenAsArray: false, 	// force children into arrays
	            grokText: grokValues,
	            grokAttr: grokValues,
            });
    }

    static toXml(data: object, root: string, prefix: string = ''): string {
        const parsedPrefix = prefix ? `${prefix}:` : '';
        let parsedObject = '';
        let parsedAttributes = '';

        if (data) {
            parsedAttributes = convertAttributes(data['attr']);

            Object.keys(data).forEach(property => {
                if (property !== 'attr') {
                   parsedObject += convertObjectToXml(parsedPrefix, property, data[property])
                }
            });
        }

        return `<${parsedPrefix}${root}${parsedAttributes}>${parsedObject}</${parsedPrefix}${root}>`;
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
                result = KalturaUtils.escapeXml(value);
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
                        const value = KalturaUtils.escapeXml(propertyValue);
                        result += `<${key}>${value}</${key}>`;
                    }
                }
            });
        }

        return result;
    }
}
