export interface AreaBlockerMessageButton
{
    label : string;
    action : () => void;
    classes?: string;
}

export class AreaBlockerMessage
{
    title   : string;
    message : string;
    buttons : AreaBlockerMessageButton[];

    constructor(content : { title? : string, message : string, buttons : AreaBlockerMessageButton[]})
    {
        this.title = content.title || 'Error';
        this.message = content.message;
        this.buttons = content.buttons;
    }
}