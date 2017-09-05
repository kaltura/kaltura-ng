export interface AreaBlockerMessageButton
{
    label : string;
    action : () => void
}

export class AreaBlockerMessage
{
    title   : string;
    message : string;
    buttons : AreaBlockerMessageButton[];

    constructor(content : { title? : string, message : string, buttons : AreaBlockerMessageButton[]})
    {
        this.title = content.title || 'Uh oh!';
        this.message = content.message;
        this.buttons = content.buttons;
    }
}