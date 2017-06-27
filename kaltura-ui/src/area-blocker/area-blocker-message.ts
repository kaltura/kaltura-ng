export interface AreaBlockerMessageButton
{
    label : string;
    action : () => void
}

export class AreaBlockerMessage
{
    message : string;
    buttons : AreaBlockerMessageButton[];

    constructor(content : { message : string, buttons : AreaBlockerMessageButton[]})
    {
        this.message = content.message;
        this.buttons = content.buttons;
    }
}